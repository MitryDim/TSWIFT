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
  maxscaleContainer: Container;
}

export class Front extends Construct {
  constructor(scope: Construct, id: string, props: FrontProps) {
    super(scope, id);

    //** Setup Prestashop Image */
    const prestashopImage = new Image(this, "prestashopImage", {
      name: "prestashop/prestashop:latest",
      keepLocally: true,
    });

    const sharedVolume = new Volume(this, `prestashopSharedVolume`, {
      name: `prestashop-data`,
    });


    for (let i = 1; i <= 2; i++) {
      const port = 8080 + i;
      new Container(this, `prestashopContainer${i}`, {
        name: `prestashop-${props.envConfig.name}-${i}`,
        image: prestashopImage.name,
        env: [
          `DB_SERVER=maxscale`,
          `DB_NAME=${props.variables.dbName}`, // Nom de la base de données
          `DB_USER=${props.variables.dbUser}`, // Utilisateur de la base de données
          `DB_PASSWD=${props.variables.dbPassword}`, // Mot de passe de la base de données
          `PS_INSTALL_AUTO=1`, // Installation automatique
          "DB_PORT=3307", // Port de la base de données
          `PS_ERASE_DB=0`, // Supprimer la base de données existante
          `PS_INSTALL_DB=0`, // Installer la base de données
          "DB_PREFIX=ps_", // Préfixe des tables
          "PS_LANGUAGE=fr", 
          "PS_COUNTRY=fr", 
          "PS_DEV_MODE=0", // Mode développement
          "PS_DOMAIN=tswift.local", // Domaine de l'application
          "PS_ENABLE_SSL=1", // Utilisation SSL
          "PS_HANDLE_DYNAMIC_DOMAIN=0", // Gestion dynamique du domaine
          `ADMIN_MAIL=${props.variables.prestashopAdminEmail.value}`, // Email de l'administrateur
          `ADMIN_PASSWD=${props.variables.prestashopAdminPassword.value}`, // Mot de passe de l'administrateur
          "PS_HOST_MODE=0", // Mode d'hébergement
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
            containerPath: "/var/www/html",
          },
        ],
        restart: "always",
      });
    }
  }
}
