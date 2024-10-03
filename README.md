# TSWIFT CDKTF Project

This project is a Cloud Development Kit for Terraform (CDKTF) application written in TypeScript. It leverages the power of TypeScript to define and provision cloud infrastructure using Terraform.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (>= 14.x)
- npm (>= 6.x)
- Terraform (>= 0.14)
- CDKTF (>= 0.4.0)

## Getting Started

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/MitryDim/TSWIFT.git
   cd TSWIFT
   ```

2. Install dependencies:

   ```sh
   - npm install

   - cdktf get
   ```

### Configuration

1. Create a `terraform.tfvars` file in the root directory and add your environment variables :

   ```sh
   touch terraform.tfvars # Linux

   mkdir terraform.tfvars # Windows
   ```

2. Add your configuration to the `terraform.tfvars` file :
   ```sh
    db_user          = "your-database-username"
    db_password      = "your-database-password"
    db_root_password = "your-database-root-password"
    db_name          = "your-database-name"
   ```

### Usage

1. Synthesize the Terraform configuration :

   ```sh
   cdktf synth
   ```

2. Deploy the stack you want :

   ```sh
   cdktf deploy dev/staging/prod --auto-approve

    or

   cdktf deploy "*" --auto-approve # Deploy all stacks
   ```

3. Destroy the stack you want :

   ```sh
   cdktf destroy dev/staging/prod --auto-approve

    or

   cdktf destroy "*" --auto-approve # Destory all stacks
   ```

## Setup HTTPS Redirection / Load Balancer with Nginx
1. Generate a private key and a certificate :

    ```sh
    openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365
    ```

> [!NOTE]
> You will be prompted to enter information about your organization. This information will be included in the certificate.


2. Configure Nginx Proxy Manager to use the generated certificate :

   * Deploy stack

   <br>

   ```sh
   cdktf deploy dev --auto-approve
   ```

   * Go to **[localhost:81](localhost:81)**

   * Log In with these credentials :

   ```sh
   email: admin@example.com
   password: changeme
   ```

   * Navigate to the SSL Certificates section in the Nginx Proxy Manager dashboard.

   * Click on "Add SSL Certificate" and select "Custom".

   * Upload the `.key` and `.crt` files.

   3. Create a Proxy Host:

      * Navigate to the "Proxy Hosts" section in the Nginx Proxy Manager dashboard.
      * Click on "Add Proxy Host".
      * Fill in the details for your domain name and forward hostname/IP.
      * Select the "SSL" tab and enable SSL by selecting the certificate you uploaded earlier.
      * Save the proxy host configuration.

## Project Structure

- `Modules/`: Contains the setup containers of the project, Back (Databases, Proxy, Load Balancer) and Front (Prestashop)
- `main.ts`: The entry point of the CDKTF application.
- `cdktf.out/`: The output directory for synthesized Terraform configuration.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

## Acknowledgements

- [Terraform](https://www.terraform.io/)
- [CDKTF](https://github.com/hashicorp/terraform-cdk)

```

```
