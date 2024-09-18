import { Construct } from "constructs";
import { Container } from "../../.gen/providers/docker/container";
import { Image } from "../../.gen/providers/docker/image";
import { Network } from "../../.gen/providers/docker/network";
import { Variables } from "../../variables";
import { Volume } from "../../.gen/providers/docker/volume";

interface FrontProps {
  network: Network;
  envConfig: any;
  variables: Variables;
  replicas: number;
}

export class Front extends Construct {
  constructor(scope: Construct, id: string, props: FrontProps) {
    super(scope, id);

    //** Setup Prestashop Image */
    const prestashopImage = new Image(this, "prestashopImage", {
      name: "prestashop/prestashop:latest",
      keepLocally: true,
    });

  
    for (let i = 1; i <= props.replicas; i++) {
        const sharedVolume = new Volume(this, `prestashopSharedVolume${i}`, {
          name: `prestashop-data${i}`,
        });
      const port = 8080 + i;
      new Container(this, `prestashopContainer${i}`, {
        name: `prestashop-${props.envConfig.name}-${i}`,
        image: prestashopImage.name,
        env: [
          `DB_SERVER=maxscale`,
          `DB_NAME=${props.variables.dbName}`,
          `DB_USER=${props.variables.dbUser}`,
          `DB_PASSWD=${props.variables.dbPassword}`,
          `PS_INSTALL_AUTO=${i === 1 ? "1" : "1"}`,
          "DB_PORT=3307",
          `PS_ERASE_DB=${i === 1 ? "1" : "0"}`,
          `PS_INSTALL_DB=${i === 1 ? "1" : "0"}`,
          "DB_PREFIX=ps_",
          "PS_LANGUAGE=fr",
          "PS_COUNTRY=fr",
          "PS_DEV_MODE=1",
          "PS_FOLDER_ADMIN=admin-dev",
          "PS_FOLDER_INSTALL=install-dev",
          "PS_DOMAIN=localhost:" + port,
          "PS_HANDLE_DYNAMIC_DOMAIN=1",
          "ADMIN_PASSWD=test@test.com",
          "ADMIN_MAIL=test@test.com",
          // Ajout de la configuration spécifique pour la deuxième instance
          `PS_SHOP_ID=${i === 1 ? "1" : "2"}`, // Différent pour chaque instance
          `PS_SHOP_MAIN=${i === 1 ? "1" : "0"}`, // La première instance est la principale
        ],
        networksAdvanced: [
          {
            name: props.network.name,
          },
        ],
        ports: [
          {
            internal: 80,
            external: port,
          },
        ],
        volumes: [
          {
            volumeName: sharedVolume.name,
            containerPath: "/var/www/html", // Chemin où PrestaShop stocke ses données
          },
        ],
        restart: "always",
      });
    }
  }
}
