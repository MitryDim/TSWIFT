import { TerraformVariable, VariableType } from "cdktf";
import { Construct } from "constructs";

export const environments = {
  prod: {
    name: "production"
  },
  staging: {
    name: "staging"
  },
  dev: {
    name: "development"
  },
};

export class Variables {
  public readonly dbPassword: TerraformVariable;
  public readonly dbUser: TerraformVariable;
  public readonly rootPassword: TerraformVariable;
  public readonly dbName: TerraformVariable;

  constructor(scope : Construct) {
       this.dbPassword = new TerraformVariable(scope, "db_password", {
         description: "The password for the WordPress database user",
         sensitive: true,
         type: VariableType.STRING,
       });

       this.dbUser = new TerraformVariable(scope, "db_user", {
          description: "The user for the WordPress database user",
          sensitive: false,
          type: VariableType.STRING,
        });

        this.rootPassword = new TerraformVariable(scope, "db_root_password", {
          description: "The root password for MariaDB",
          sensitive: true,
          type: VariableType.STRING,
        });

        this.dbName = new TerraformVariable(scope, "db_name", {
          description: "The name of the database",
          sensitive: false,
          type: VariableType.STRING,
        });

      }
}
