# TSWIFT CDKTF Project

This project is a Cloud Development Kit for Terraform (CDKTF) application written in TypeScript. It leverages the power of TypeScript to define and provision cloud infrastructure using Terraform.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (>= 14.x)
- npm (>= 6.x)
- Terraform (>= 0.14)
- CDKTF (>= 0.4.0)


## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
   - [Installation](#installation)
   - [Configuration](#configuration)
   - [Usage](#usage)
- [Setup HTTPS Redirection / Load Balancer with Nginx](#setup-https-redirection--load-balancer-with-nginx)
- [Cost Analysis: A Single Server Running All Docker Containers](#cost-analysis-a-single-server-running-all-docker-containers)
- [Project Structure](#project-structure)
- [Acknowledgements](#acknowledgements)



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
    maxscale_admin_password   = "your-maxscale-admin-password"
    maxscale_monitor_password = "your-maxscale-monitor-password"
    prestashop_admin_email    = "your-prestashop-admin-email"
    prestashop_admin_password = "your-prestashop-admin-password"
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

1. Start **dev** environment:

   ```sh
   cdktf deploy dev --auto-approve
   ```

2. Access the Nginx container:

   ```sh
   docker exec -it nginx-development /bin/bash
   ```

3. Generate a private key and a certificate:

   ```sh
   openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout example.key -out example.crt
   ```

> [!NOTE]
> You will be prompted to enter information about your organization. This information will be included in the certificate.

4. Export the **".crt"** and **".key"** from the container and put them in the **"certs"** folder at the root of the project.

5. Edit the nginx conf at /Modules/Back/config/nginx.conf

   ```sh
   # /etc/nginx/nginx.conf

   user nginx;
   worker_processes auto;
   error_log /var/log/nginx/error.log warn;
   pid /var/run/nginx.pid;

   events {
      worker_connections 1024;
   }

   http {
      include /etc/nginx/mime.types;
      default_type application/octet-stream;

      sendfile on;
      keepalive_timeout 65;
      gzip on;

      # Load balancing
      upstream prestashop_upstream {
         ip_hash;
         server prestashop-{ENVIRONEMENT}-1; # development/staging/production
         server prestashop-{ENVIRONEMENT}-2; # development/staging/production
      }

      # HTTP server block
      server {
         listen 80;
         server_name example.com;

         # Redirect all HTTP requests to HTTPS
         return 301 https://$host$request_uri;
      }

      #HTTPS server block
      server {
         listen 443 ssl;
         server_name example.com;
         ssl_session_cache shared:MozSSL:10m;
         ssl_session_tickets off;

         ssl_certificate /etc/nginx/ssl/example.crt; # Your .crt previously created
         ssl_certificate_key /etc/nginx/ssl/example.key; # Your .key previously created
         ssl_protocols TLSv1.2 TLSv1.3;
         ssl_prefer_server_ciphers on;

         location / {

               proxy_set_header Host $host;
               proxy_set_header X-Real-IP $remote_addr;
               proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
               proxy_set_header X-Forwarded-Host $http_host;
               proxy_set_header X-Forwarded-Proto $scheme;
               proxy_pass http://prestashop_upstream/;

         }
      }
   }
   ```

6. Add the following entry to your hosts file to map `example.com` to `127.0.0.1`:

   - **Windows**:
      ```sh
      notepad C:\Windows\System32\drivers\etc\hosts
      ```

   - **Linux**:
      ```sh
      sudo nano /etc/hosts
      ```

   ```
   127.0.0.1 example.com
   ```


## Cost Analysis: A Single Server Running All Docker Containers

### 1. Server Resources
- **CPU**: 4 vCPUs
- **Memory (RAM)**: 16 GB RAM
- **Storage**: SSD of 200 GB (enough for databases and PrestaShop files)
- **Network Traffic**: Based on traffic demands

### 2. SSL Certificate
- **Let's Encrypt**: Free
- **Commercial Certificate**: Around $5 to $10/month

### 3. Server Cost Estimation
- **Cloud or Dedicated Server**:
  - Server with 4 vCPUs, 16 GB RAM, 200 GB SSD
  - Cost: Around $40 to $80/month (e.g., DigitalOcean, AWS)
- **Additional Storage** (if needed):
  - $0.10 to $0.20/GB/month for additional storage

### Monthly Cost Summary

| Resource                  | Estimated Cost                    |
|---------------------------|------------------------------------|
| Server (4 vCPUs, 16 GB RAM, 200 GB SSD) | $40 - $80/month                |
| SSL Certificate            | Free (Let's Encrypt) or $5 - $10/month |
| Additional Storage         | $0.10 to $0.20/GB (if necessary)  |

### Total Estimated Monthly Cost
- **Without Commercial SSL**: $40 - $80/month
- **With Commercial SSL**: $45 - $90/month

> **Note**: These costs may vary depending on the cloud provider and traffic demands.


## Project Structure

- `Modules/`: Contains the setup containers of the project, Back (Databases, Proxy, Load Balancer) and Front (Prestashop)
- `main.ts`: The entry point of the CDKTF application.
- `cdktf.out/`: The output directory for synthesized Terraform configuration.

## Acknowledgements

- [Terraform](https://www.terraform.io/)
- [CDKTF](https://github.com/hashicorp/terraform-cdk)
