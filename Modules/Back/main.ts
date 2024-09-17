import { Construct } from "constructs";
import { Container } from "../../.gen/providers/docker/container";
import { Image } from "../../.gen/providers/docker/image";
import { Network } from "../../.gen/providers/docker/network";
import { Variables } from "../../variables";

interface BackProps {
  network: Network;
  envConfig: any;
  variables: Variables;
}

export class Back extends Construct {
  constructor(scope: Construct, id: string, props: BackProps) {
    super(scope, id);

    //** Setup Database Image */
    const dbImage = new Image(this, "dbImage", {
      name: "mariadb:latest",
      keepLocally: false,
    });

    //** Setup Nginx Proxy Manager Image */
    const npmImage = new Image(this, "npmImage", {
      name: "jc21/nginx-proxy-manager:latest",
      keepLocally: false,
    });

    //** Setup Database */
    new Container(this, "dbContainer", {
      name: `db-${props.envConfig.name}`,
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
          containerPath: "/var/lib/mysql",
          volumeName: `db-data-${props.envConfig.name}`,
        },
      ],
      ports: [
        {
          internal: 3306,
        },
      ],
    });

    //** Setup Nginx Proxy Manager */
    new Container(this, "nginx-proxy-manager", {
      image: npmImage.name,
      name: `nginx-proxy-manager-${props.envConfig.name}`,
      ports: [
        { internal: 81, external: 81 },
        { internal: 443, external: 443 },
      ],
      restart: "unless-stopped",
      env: [
        `DB_MYSQL_HOST=db-${props.envConfig.name}`,
        "DB_MYSQL_PORT=3306",
        `DB_MYSQL_USER=${props.variables.dbUser}`,
        `DB_MYSQL_PASSWORD=${props.variables.dbPassword}`,
        `DB_MYSQL_NAME=${props.variables.dbName}`,
      ],
      volumes: [
        {
          containerPath: "/data",
          volumeName: `npm-data-${props.envConfig.name}`,
        },
        {
          containerPath: "/etc/letsencrypt",
          volumeName: `npm-letsencrypt-${props.envConfig.name}`,
        },
      ],
      networksAdvanced: [
        {
          name: props.network.name,
        },
      ],
    });
  }
}
