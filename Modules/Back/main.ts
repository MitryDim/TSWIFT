import { Construct } from "constructs";
import { Container } from "../../.gen/providers/docker/container";
import { Image } from "../../.gen/providers/docker/image";
import { Network } from "../../.gen/providers/docker/network";
import { Variables } from "../../variables";
import { Volume } from "../../.gen/providers/docker/volume";
import { mkdirSync, writeFileSync } from "fs";
import { generateMaxScaleConfig } from "../../generateConfig";
import { dirname, join } from "path";

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

    const dbImage = new Image(this, "dbImage", {
      name: "mariadb:latest",
      keepLocally: true,
    });

    const dbMasterVolume = new Volume(this, "dbMasterVolume", {
      name: "db-master-volume",
    });


    const maxscaleVolume = new Volume(this, "maxscaleVolume", {
      name: "maxscale-volume"
    });

    const maxscaleImage = new Image(this, "maxscaleImage", {
      name: "mariadb/maxscale:latest",
      keepLocally: true,
    });

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
      ],
      ports: [
        {
          internal: 3306,
        },
      ],
      command: ["--server-id=1", "--log-bin=mysql-bin", "--binlog-format=row"],
    });

   for (let i = 1; i <= 3; i++) {
     const dbSlaveVolume = new Volume(this, `dbSlaveVolume${i}`, {
       name: `db-slave-volume${i}`,
     });
const port = 3307 + i;
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
       ],
       networksAdvanced: [
         {
           name: props.network.name,
         },
       ],
       ports: [
         {
           internal: port,
         },
       ],
       command: [
         "--server-id=" + (i + 1),
         "--log-bin=mysql-bin",
         "--binlog-format=row",
         "--relay-log=relay-bin",
         "--port=" + port,
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
      maxscaleUser: "admin",
      maxscalePassword: "prestashop",
    });

    writeFileSync(configPath, config);

    new Container(this, "maxscaleContainer", {
      name: "maxscale",
      image: maxscaleImage.name,
      env: ["MAXSCALE_USER=admin", "MAXSCALE_PASSWORD=prestashop"],
      networksAdvanced: [
        {
          name: props.network.name,
        },
      ],
      volumes: [
        {
          volumeName: maxscaleVolume.name,
          hostPath: configPath, // Chemin du fichier sur votre hôte
          containerPath: "/etc", //Chemin du fichier dans le conteneur
        },
      ],
      ports: [
        {
          internal: 3307
        },
        {
          internal: 8989, // Port interne de l'interface web
          external: 8989, // Port externe sur l'hôte
        },
      ],
    });
  }
}
