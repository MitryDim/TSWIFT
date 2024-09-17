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

    const dbImage = new Image(this, "dbImage", {
      name: "mariadb:latest",
      keepLocally: false,
    });

    
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
      ports: [
        {
          internal: 3306,
        },
      ],
    });
  }
}
