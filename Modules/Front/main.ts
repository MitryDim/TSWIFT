import { Construct } from "constructs";
import { Container } from "../../.gen/providers/docker/container";
import { Image } from "../../.gen/providers/docker/image";
import { Network } from "../../.gen/providers/docker/network";
import { Variables } from "../../variables";

interface FrontProps {
  network: Network;
  envConfig: any;
  variables: Variables;

}

export class Front extends Construct {
  constructor(scope: Construct, id: string, props: FrontProps) {
    super(scope, id);

    const prestashopImage = new Image(this, "prestashopImage", {
      name: "prestashop/prestashop:latest",
      keepLocally: false,
    });




    new Container(this, "prestashopContainer", {
      name: `prestashop-${props.envConfig.name}`,
      image: prestashopImage.name,
      env: [
        `DB_SERVER=db-${props.envConfig.name}`,
        `DB_NAME=${props.variables.dbName}`,
        `DB_USER=${props.variables.dbUser}`,
        `DB_PASSWD=${props.variables.dbPassword}`,
      ],
      networksAdvanced: [
        {
          name: props.network.name,
        },
      ],
      ports: [
        {
          internal: 80,
          external: 8080,
        },
      ],
    });
  }
}
