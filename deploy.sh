#!/bin/sh -x
cd ~
cd imx
git stash
git checkout master
git pull
cp imx.service /etc/systemd/system/imx.service
cd /src/Imx.API
sudo dotnet publish -c Release -o /var/www/imx/
sudo systemctl restart imx.service
#sudo systemctl enable instantcrypto.service
#sudo systemctl start instantcrypto.service
