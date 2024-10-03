import { TerraformVariable, VariableType } from "cdktf";
import { Construct } from "constructs";

export const environments = {
  prod: {
    name: "production",
    PrestashopReplicas: 2,
  },
  staging: {
    name: "staging",
    PrestashopReplicas: 2,
  },
  dev: {
    name: "development",
    PrestashopReplicas: 2,
  },
};

export class Variables {
  public readonly dbPassword: TerraformVariable;
  public readonly dbUser: TerraformVariable;
  public readonly rootPassword: TerraformVariable;
  public readonly dbName: TerraformVariable;
  public readonly maxscaleAdminPassword: TerraformVariable;
  public readonly maxscaleMonitorPassword: TerraformVariable;
  public readonly prestashopAdminEmail: TerraformVariable;
  public readonly prestashopAdminPassword: TerraformVariable;


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

        this.maxscaleAdminPassword = new TerraformVariable(scope, "maxscale_admin_password", {
          description: "The password for the MaxScale admin user",
          sensitive: true,
          type: VariableType.STRING,
        });

        this.maxscaleMonitorPassword = new TerraformVariable(scope, "maxscale_monitor_password", {
          description: "The password for the MaxScale monitor user",
          sensitive: true,
          type: VariableType.STRING,
        });


        this.prestashopAdminEmail = new TerraformVariable(scope, "prestashop_admin_email", {
          description: "The email for the Prestashop admin user",
          sensitive: false,
          type: VariableType.STRING,
        });

        this.prestashopAdminPassword = new TerraformVariable(scope, "prestashop_admin_password", {
          description: "The password for the Prestashop admin user",
          sensitive: true,
          type: VariableType.STRING
        });

      }
}
