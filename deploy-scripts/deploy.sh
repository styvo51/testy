#!/usr/bin/env bash
cd /var/www/imx
git stash
git checkout master
git pull
npm install
systemctl restart imx.service
