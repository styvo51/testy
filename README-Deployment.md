# Imx
Imx is a record matching and verification api.
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
### Install Imx
Installation will:
* Copy imx.service to /etc/systemd/system/
* Publish the imx dotnet app to /var/www/imx
* Enable and start the imx.service with systemctl so that it starts when the server boots, and restarts if it crashes.

A deploy script has been provided to handle this automagically.

```bash
git clone https://github.com/bitcoinbrisbane/imx.git
cd imx
sudo chmod u+x deploy.sh
sudo ./deploy.sh
```

### Configure for deployment
#### Setup ufw
Port 443 (https) needs to be opened in the server firewall to allow requests in and out. The instructions for ufw are as follows:
```bash
sudo ufw allow 443/tcp
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

#### Setup SSL
There are two options for SSL: update nginx with the details of the certificate purchased from a third party, or use Let's Encrypt and Certbot.
To use prepurchased certificates the nginx config will need to be updated. (See [here](http://nginx.org/en/docs/http/configuring_https_servers.html) for more details on nginx https configurations)
Add the following lines (replacing cert.pem and cert.key with the certificate details)
```
    ssl_certificate     cert.pem;
    ssl_certificate_key cert.key;
    ssl_protocols       TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers         HIGH:!aNULL:!MD5;
    keepalive_timeout   70;
```

Alternatively, the Let's Encrypt Certbot can be used to automatically enable SSL for free. Directions for doing this on Ubuntu 18.04 can be found [here](https://certbot.eff.org/lets-encrypt/ubuntubionic-nginx)
In brief:
```bash
    sudo apt-get update
    sudo apt-get install software-properties-common
    sudo add-apt-repository universe
    sudo add-apt-repository ppa:certbot/certbot
    sudo apt-get update

    sudo apt-get install certbot python-certbot-nginx 

    sudo certbot --nginx
```
To test Certbot's ability to autorenew, run
```bash
sudo certbot renew --dry-run
```
 Https should now be enabled. The api will be accessable from `https://api.imx.com`

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
