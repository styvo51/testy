#!/bin/sh -x
cp imx.service /etc/systemd/system/imx.service
cd src/Imx.API/
dotnet publish -c Release -o /var/www/imx/
systemctl restart imx.service
systemctl enable imx.service
systemctl start imx.service
