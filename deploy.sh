#!/bin/sh -x
cd ~
cd imx
git stash
git checkout master
git pull
sudo dotnet publish -c Release -o /var/www/imx/
sudo systemctl restart imx.service
