import { Construct } from "constructs";
import { App, TerraformStack } from "cdktf";
import { Network } from "./.gen/providers/docker/network";
import { DockerProvider } from "./.gen/providers/docker/provider";
import { environments, Variables } from "./variables";
import { Back } from "./Modules/Back/main";
import { Front } from "./Modules/Front/main";

class MyStack extends TerraformStack {
  constructor(scope: Construct, id: string, envConfig: any) {
    super(scope, id);

    new DockerProvider(this, "docker", {});

    const network = new Network(this, "prestashopNetwork", {
      name: "prestashop_network",
    });

    //Init variables :
    const variables = new Variables(this);

    const back = new Back(this, "back", { network, envConfig, variables });

    new Front(this, "front", {
      network,
      envConfig,
      variables,
      replicas: 2, // Définissez le nombre de réplicas souhaité
      maxscaleContainer: back.maxscaleContainer,
    });
  }
}

const app = new App();
new MyStack(app, "prod", environments.prod);
new MyStack(app, "staging", environments.staging);
new MyStack(app, "dev", environments.dev);
app.synth();
