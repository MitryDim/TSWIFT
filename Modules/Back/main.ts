import { Construct } from "constructs";
import { Container } from "../../.gen/providers/docker/container";
import { Image } from "../../.gen/providers/docker/image";
import { Network } from "../../.gen/providers/docker/network";
import { Variables } from "../../variables";
import { Volume } from "../../.gen/providers/docker/volume";
import { chmodSync, mkdirSync, writeFileSync } from "fs";
import { generateMariaDbUserConfig, generateMaxScaleConfig } from "../../generateConfig";
import { dirname, join } from "path";
import path = require("path");
import * as dotenv from "dotenv";


dotenv.config();

interface BackProps {
  network: Network;
  envConfig: any;
  variables: Variables;
}

export class Back extends Construct {
  public readonly maxscaleContainer: Container;
  constructor(scope: Construct, id: string, props: BackProps) {
    super(scope, id);

    const configPath = join(__dirname, "config/maxscale.cnf");
    // Créez le répertoire si nécessaire
    const configDir = dirname(configPath);
    mkdirSync(configDir, { recursive: true });

    //** Setup Database Volume*/
    const dbMasterVolume = new Volume(this, "dbMasterVolume", {
      name: "db-master-volume",
    });

    //** Setup Database Image */
    const dbImage = new Image(this, "dbImage", {
      name: "mariadb:latest",
      keepLocally: true,
    });

    //** Nginx Image */
    const nginxImage = new Image(this, "nginxImage", {
      name: "nginx:latest",
    });

    //** MaxScale Image */
    const maxscaleImage = new Image(this, "maxscaleImage", {
      name: "mariadb/maxscale:latest",
      keepLocally: true,
    });

    const mariaDBConfig = generateMariaDbUserConfig();

    // Écriture dans le fichier create_user.sh
    const filePath = path.resolve(__dirname, "./config/create_user.sh");
    writeFileSync(filePath, mariaDBConfig);

    // Rendre le script exécutable
    chmodSync(filePath, 0o755); // chmod +x create_user.sh

    const sqlConfig = path.resolve(__dirname, "./config/create_user.sh");

    this.maxscaleContainer = new Container(this, "dbContainer", {
      name: `db-master-${props.envConfig.name}`,
      image: dbImage.name,
      env: [
        `MYSQL_ROOT_PASSWORD=${props.variables.rootPassword.value}`,
        `MYSQL_DB_USER_PASSWORD=${props.variables.dbPassword.value}`,
        `MYSQL_DATABASE=${props.variables.dbName.value}`,
        `MAXSCALE_MONITORING_PASSWORD=${props.variables.maxscaleMonitorPassword.value}`,
        `MAXSCALE_ADMIN_PASSWORD=${props.variables.maxscaleAdminPassword.value}`,
        `MYSQL_DB_USER=${props.variables.dbUser.value}`,
      ],
      networksAdvanced: [
        {
          name: props.network.name,
        },
      ],
      volumes: [
        {
          volumeName: dbMasterVolume.name,
          containerPath: "/var/lib/mysql",
        },
        {
          hostPath: sqlConfig, // Emplacement local du fichier SQL
          containerPath: "/docker-entrypoint-initdb.d/create_user.sh", // Chemin à l'intérieur du conteneur
        },
      ],
      ports: [
        {
          internal: 3306,
        },
      ],
      command: [
        "--server-id=1",
        "--log-bin=mysql-bin",
        "--binlog-format=row",
        "--gtid-domain-id=1",
        "--log-slave-updates=1",
      ],
    });

    for (let i = 1; i <= 3; i++) {
      const dbSlaveVolume = new Volume(this, `dbSlaveVolume${i}`, {
        name: `db-slave-volume${i}`,
      });
      new Container(this, `dbSlaveContainer${i}`, {
        name: `db-slave-${props.envConfig.name}${i}`,
        image: dbImage.name,
        env: [
          `MYSQL_ROOT_PASSWORD=${props.variables.rootPassword.value}`,
          `MYSQL_DB_USER_PASSWORD=${props.variables.dbPassword.value}`,
          `MYSQL_DATABASE=${props.variables.dbName.value}`,
          `MAXSCALE_MONITORING_PASSWORD=${props.variables.maxscaleMonitorPassword.value}`,
          `MAXSCALE_ADMIN_PASSWORD=${props.variables.maxscaleAdminPassword.value}`,
          `MYSQL_DB_USER=${props.variables.dbUser.value}`,
        ],
        volumes: [
          {
            volumeName: dbSlaveVolume.name,
            containerPath: "/var/lib/mysql",
          },
          {
            hostPath: sqlConfig, // Emplacement local du fichier SQL
            containerPath: "/docker-entrypoint-initdb.d/create_user.sh", // Chemin à l'intérieur du conteneur
          },
        ],
        networksAdvanced: [
          {
            name: props.network.name,
          },
        ],
        ports: [
          {
            internal: 3306,
          },
        ],
        command: [
          "--server-id=" + (i + 1),
          "--log-bin=mysql-bin",
          "--binlog-format=row",
          "--relay-log=relay-bin",
          "--gtid-domain-id=" + (i + 1),
          "--log-slave-updates=1",
          "--read-only=1",
        ],
      });
    }

    // Generate MaxScale configuration
    const config = generateMaxScaleConfig({
      masterHost: `db-master-${props.envConfig.name}`,
      slaveHosts: [
        `db-slave-${props.envConfig.name}1`,
        `db-slave-${props.envConfig.name}2`,
        `db-slave-${props.envConfig.name}3`,
      ],
      maxscaleUser: "maxscale_admin",
    });

    writeFileSync(configPath, config);

    new Container(this, "maxscaleContainer", {
      name: "maxscale",
      image: maxscaleImage.name,
      env: [
        "MAXSCALE_USER=maxscale_admin",
        `MAXSCALE_PASSWORD=${props.variables.maxscaleAdminPassword.value}`,
      ],
      networksAdvanced: [
        {
          name: props.network.name,
        },
      ],
      volumes: [
        {
          hostPath: configPath, // Chemin du fichier sur votre hôte
          containerPath: "/etc/maxscale.cnf", //Chemin du fichier dans le conteneur
        },
      ],
      ports: [
        {
          internal: 3307,
        },
        {
          internal: 8989, // Port interne de l'interface web
          external: 8989, // Port externe sur l'hôte
        },
      ],
      healthcheck: {
        test: ["CMD", "maxctrl", "list", "servers"],
        interval: "10s", // Augmentez l'intervalle si nécessaire
        timeout: "20s", // Augmentez le délai d'attente si nécessaire
        retries: 10, // Augmentez le nombre de tentatives si nécessaire
      },
    });

    //** Setup Nginx */
    const certsPath = path.resolve(__dirname, "../../certs/");
    const nginxConfPath = path.resolve(__dirname, "./config/nginx.conf");

    //** Setup Nginx */
    new Container(this, "nginxContainer", {
      name: `nginx-${props.envConfig.name}`,
      image: nginxImage.name,
      volumes: [
        {
          containerPath: "/etc/nginx/ssl", // Le chemin dans le conteneur Nginx
          hostPath: certsPath, // Dossier local contenant tes certificats
        },
        {
          containerPath: "/etc/nginx/nginx.conf",
          hostPath: nginxConfPath,
        },
      ],
      networksAdvanced: [
        {
          name: props.network.name,
        },
      ],
      ports: [
        {
          internal: 80,
          external: 80,
        },
        {
          internal: 443,
          external: 443,
        },
      ],
      restart: "always",
    });

    // //** Setup K6 Benchmark */
    // const k6Image = new Image(this, "k6-image", {
    //   name: "grafana/k6:latest",
    //   keepLocally: true,
    // });

    // new Container(this, "k6-container", {
    //   image: k6Image.name,
    //   name: `k6-${props.envConfig.name}`,
    //   restart: "always",
    //   volumes: [
    //     {
    //       hostPath: path.resolve(__dirname, "./config/k6-bench.js"),
    //       containerPath: "/scripts/k6-bench.js",
    //     },
    //     {
    //       containerPath: "/etc/ssl/certs", // Le chemin dans le conteneur Nginx
    //       hostPath: certsPath, // Dossier local contenant tes certificats
    //     },
    //   ],
    //   networksAdvanced: [
    //     {
    //       name: props.network.name,
    //     },
    //   ],
    //   ports: [
    //     {
    //       internal: 6565,
    //       external: 6565,
    //     },
    //   ],
    //   command: [
    //     "run",
    //     "--http-debug",
    //     "--insecure-skip-tls-verify",
    //     "/scripts/k6-bench.js",
    //   ],
    //   user: "root",
    // });
  }
}
