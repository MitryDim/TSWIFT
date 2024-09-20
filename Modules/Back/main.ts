import { Construct } from "constructs";
import { Container } from "../../.gen/providers/docker/container";
import { Image } from "../../.gen/providers/docker/image";
import { Network } from "../../.gen/providers/docker/network";
import { Variables } from "../../variables";
import { Volume } from "../../.gen/providers/docker/volume";
import { mkdirSync, writeFileSync } from "fs";
import { generateMaxScaleConfig } from "../../generateConfig";
import { dirname, join } from "path";
import path = require("path");

interface BackProps {
  network: Network;
  envConfig: any;
  variables: Variables;
}

export class Back extends Construct {
  constructor(scope: Construct, id: string, props: BackProps) {
    super(scope, id);

    const configPath = join(__dirname, "config/maxscale.cnf");
    // Créez le répertoire si nécessaire
    const configDir = dirname(configPath);
    mkdirSync(configDir, { recursive: true });

    //** Setup Database Image */
    const dbImage = new Image(this, "dbImage", {
      name: "mariadb:latest",
      keepLocally: true,
    });

    //** Setup Nginx Image */
    const nginxImage = new Image(this, "nginxImage", {
      name: "nginx:latest",
    });

    //** Setup Database */
    const dbMasterVolume = new Volume(this, "dbMasterVolume", {
      name: "db-master-volume",
    });

    const maxscaleImage = new Image(this, "maxscaleImage", {
      name: "mariadb/maxscale:latest",
      keepLocally: true,
    });

    const initSQL = path.resolve(__dirname, "./config/init.sql");
    new Container(this, "dbContainer", {
      name: `db-master-${props.envConfig.name}`,
      image: dbImage.name,
      env: [
        `MYSQL_ROOT_PASSWORD=${props.variables.rootPassword}`,
        `MYSQL_DATABASE=${props.variables.dbName}`,
        `MYSQL_USER=${props.variables.dbUser}`,
        `MYSQL_PASSWORD=${props.variables.dbPassword}`,
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
          hostPath: initSQL, // Emplacement local du fichier SQL
          containerPath: "/docker-entrypoint-initdb.d/init.sql", // Chemin à l'intérieur du conteneur
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
        "--replicate_do_db=prestashop",
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
          `MYSQL_ROOT_PASSWORD=${props.variables.rootPassword}`,
          `MYSQL_DATABASE=${props.variables.dbName}`,
          `MYSQL_USER=${props.variables.dbUser}`,
          `MYSQL_PASSWORD=${props.variables.dbPassword}`,
        ],
        volumes: [
          {
            volumeName: dbSlaveVolume.name,
            containerPath: "/var/lib/mysql",
          },
          {
            hostPath: initSQL, // Emplacement local du fichier SQL
            containerPath: "/docker-entrypoint-initdb.d/init.sql", // Chemin à l'intérieur du conteneur
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
          "--replicate_do_db=prestashop"
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
      maxscalePassword: "secret",
    });

    writeFileSync(configPath, config);

    new Container(this, "maxscaleContainer", {
      name: "maxscale",
      image: maxscaleImage.name,
      env: ["MAXSCALE_USER=maxscale_admin", "MAXSCALE_PASSWORD=secret"],
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
  }
}
