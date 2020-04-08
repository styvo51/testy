#!/usr/bin/env bash
cd /var/www/imx
git stash
git checkout master
git pull
cp deploy-scripts/imx.service /etc/systemd/system/imx.service
systemctl daemon-reload
systemctl enable imx.service
systemctl start imx.service
systemctl restart imx.service
