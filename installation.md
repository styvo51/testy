# IMX Initial Install on VM

## Firewall

Set up firewall to allow OpenSSH

```bash
ufw app list
ufw allow OpenSSH
ufw enable
ufw status
```

## Node

Install node

```bash
apt-get -y install curl
curl -sL https://deb.nodesource.com/setup_10.x | bash -
apt-get -y install nodejs
```

## Git

Configure git profile. This is so the vm can pull the latest branch from github on new deployments.

```bash
git config --global user.email "dltx@protonmail.com"
git config --global user.name "DLTx"
```

### Set up ssh for git hub

```bash
ssh-keygen -t rsa -b 4096 -C "dltx@protonmail.com"
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_rsa
cat ~/.ssh/id_rsa.pub
```

The public key then needs to be added to the DLTx github account.

## NGINX

```
apt-get update
apt-get install nginx
ufw app list
ufw allow 'Nginx HTTP'
```

Alternatively, 'Nginx HTTPS' allows the port for https traffic.

Update the location section of /etc/nginx/sites-available/default:

```
location / {
    proxy_pass http://localhost:5000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

Check the configuration is correct and restart nginx:

```
nginx -t
systemctl restart nginx
```

## Project

Get project from git and install dependencies.

```bash
cd /var/www
git clone git@github.com:dltxio/imx.git
cd imx
npm i
```

### Set up deploy script and systemd service:

```bash
cp deploy-scripts/imx.service /etc/systemd/system/imx.service
cp deploy-scripts/deploy.sh ~/deploy.sh
chmod +x ~/deploy.sh
systemctl enable imx.service
systemctl start imx.service
```

### Environment variables

Edit the file in `/etc/systemd/system/imx.service.d/env.conf` and update environment variables as needed.

e.g.

```
[Service]
Environment="NODE_ENV=production"
Environment="PORT=5000"
Environment="API_KEY=secret"
Environment="DB_USER=postgres"
Environment="DB_HOST=localhost"
Environment="DB_DATABASE=imx"
Environment="DB_PASSWORD="
Environment="DB_PORT=5432"
Environment="DB_TEST_DATABASE=test"
```

Then run:

```
systemctl daemon-reload
systemctl restart imx
```

## Circle ci public key to authorized keys

Generate an ssh key pair for circle ci to use on deployments called id_rsa_dltx. Then insert public key into authorized keys file on server (replacing 0.0.0.0 with the server's ip):

```
cat .ssh/id_rsa_dltx.pub | ssh root@134.209.99.80 "cat >> ~/.ssh/authorized_keys"
```

## ssl

Set up ssl.
See here: https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-16-04

## Postgres

```
apt-get install postgresql postgresql-contrib
update-rc.d postgresql enable
service postgresql start
```

Current postgres credentials set up as follows:

- `database`: imx
- `port`: 5432

| Role name | Attributes                                                 | Member of  | Password         |
| :-------- | :--------------------------------------------------------- | :--------- | :--------------- |
| ben       |                                                            | {imxadmin} | QHurOJ9V4vdrCeQV |
| imxadmin  |                                                            | {}         | gKBnvUSQRKdY     |
| postgres  | Superuser, Create role, Create DB, Replication, Bypass RLS | {}         |                  |
