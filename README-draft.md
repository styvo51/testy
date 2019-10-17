# Imx
Imx is a record matching and verification tool.
## Table of Contents
[TOC]

## Installation

### Install dependancies
#### Dotnet Core
Instructions for different distros can be found [here](https://dotnet.microsoft.com/download/linux-package-manager/ubuntu18-04/sdk-current).
```bash
wget -q https://packages.microsoft.com/config/ubuntu/18.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
sudo add-apt-repository universe
sudo apt-get update
sudo apt-get install apt-transport-https
sudo apt-get update
sudo apt-get install dotnet-sdk-2.2
```
#### Nginx

```bash
sudo apt update
sudo apt install nginx
```
#### PostgreSQL

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```
### Install Imx
Installation will:
* Copy imx.service to /etc/systemd/system/
* Publish the imx dotnet app to /var/www/imx
* Enable and start the imx.service with systemctl.

A deploy script has been provided to handle this automagically.

```bash
git clone https://github.com/bitcoinbrisbane/imx.git
cd imx
sudo chmod u+x deploy.sh
sudo ./deploy.sh
```

### Configure for deployment
#### Setup ufw
Port 443 (https) needs to be opened in the server firewall to allow requests in and out. Nginx will be configured to redirect http requests to https. The instructions for ufw are as follows:
```bash
sudo ufw allow 443/tcp
```
#### Setup postgres
A postgres database with the following details needs to be created.
* Database name: defaultdb
* sslmode: require
* Port: 25060
* Host:
* Username:
* Password:

The following SQL script will create the necessary tables.
```sql
CREATE TABLE QLD70to79(
   id serial PRIMARY KEY,
   first_name VARCHAR (200) NOT NULL,
   last_name VARCHAR (200) NOT NULL,
   email VARCHAR (200) NOT NULL,
   address VARCHAR (200) NOT NULL,
   address2 VARCHAR (200) NOT NULL,
   postcode VARCHAR (10) NOT NULL,
   dob DATE NOT NULL,
   telephone VARCHAR (200) NOT NULL,
   url VARCHAR (200) NOT NULL,
   ip VARCHAR (50) NOT NULL
);
```

#### Setup nginx
Nginx should be setup as a reverse proxy forwarding requests to the imx service at `http://localhost:5000`.

Update `/etc/nginx/nginx.conf` with the following:
```
server {
    listen        443 ssl;
    server_name   api.imx.com *.imx.com;
    location / {
        proxy_pass         http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection keep-alive;
        proxy_set_header   Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }
}
```

#### Setup imx.service
The Imx service should have been enabled and started by the deployment script. It will be listening for requests on `http://localhost:5000` The service can be checked with:
```bash
systemctl status imx
```
## Usage
The server responds to requests made to the following endpoints:
* `GET /person`
* `GET /person/:id`
* `POST /person`
* `PUT /person/:id`
* `DELETE /person/:id`

For full API documentation see [the API specification](api-doc.md)
