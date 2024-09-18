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
    });

    //** Setup Nginx */
    new Container(this, "nginxContainer", {
      name: `nginx-${props.envConfig.name}`,
      image: nginxImage.name,
      volumes: [
        {
          containerPath: "/etc/nginx/ssl",
          hostPath: "../../certs/",
          volumeName: `nginx-ssl-${props.envConfig.name}`,
        },
        {
          containerPath: "/etc/nginx/conf.d",
          volumeName: `nginx-conf-${props.envConfig.name}`,
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
      ],
    });



  }
}
