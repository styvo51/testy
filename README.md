# imx

## Setup

```
git clone 
sudo chmod u+x deploy.sh
```

### Install .net core
```shell
wget -q https://packages.microsoft.com/config/ubuntu/18.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
sudo add-apt-repository universe
sudo apt-get update
sudo apt-get install apt-transport-https
sudo apt-get update
sudo apt-get install dotnet-sdk-3.0
```
### Install ngnix

```
sudo apt-get update
sudo apt-get install ngnix
```

### Create SystemCtl

Copy `/imx.service`

Or new
```
sudo nano /etc/systemd/system/imx.service
```
```
[Unit]
Description=Imx API                      

[Service]
WorkingDirectory=/var/www/api     
ExecStart=/usr/bin/dotnet /var/www/api/imx.ap.dll
Restart=always
# Restart service after 10 seconds if the dotnet service crashes:
RestartSec=10
KillSignal=SIGINT
SyslogIdentifier=instant-crypto
User=www-data
Environment=ASPNETCORE_ENVIRONMENT=Production
Environment=DOTNET_PRINT_TELEMETRY_MESSAGE=false

[Install]
WantedBy=multi-user.target
```

### Setup UFW

```
sudo ufw allow 443
```

## Postgre
```
username = doadmin
password = n0dcnpl742s2awjq
host = db-postgresql-sgp1-94366-do-user-2132945-0.db.ondigitalocean.com
port = 25060
database = defaultdb
sslmode = require
```

## Tables / Models

### Person
```
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

```csharp
{
     public Int32 Id { get; set; }

     public String Title { get; set; }

     public String Forename { get; set; }

     public String Lastname { get; set; }

     public String Address1 { get; set; } 

     public String Address3 { get; set; }

     public String DOB { get; set; }

     public String Telephone { get; set; }

     public String Url { get; set; }

     public String IP { get; set; }
 }
```

## API Endpoints

`/person` GET
`/person` POST

## Examples
```
1 CAREW STREET MT DRUITT 2770,1 Carew Street,,Mt Druitt,NSW,2770
1 Cassidy Crescent,1 Cassidy Crescent,BOGANGAR,,NSW,2488
1 Celeste Court St Kilda East Vic 3183,1 Celeste Court St,,Kilda East,VIC,3183
1 Cromer Court,1 Cromer Court,BANORA POINT,,NSW,2486
1 Crown Court,1 Crown Court,VARSITY LAKES,,QLD,4226
1 DE CARLE STREET COBURG,1 De Carle Street,Coburg��,,VIC,3058
1 Elizabeth Street,1 Elizabeth Street,FINGAL,,NSW,2487
1 Emu Bank,1 Emu Bank,Belconnen,,ACT,2617
1 FABOS PL CROYDON PARK,1 Fabos Place,Croydon Park,,NSW,2133
1 Fairtrader Drive,1 Fairtrader Drive,YAMBA,,NSW,2464
1 Falconer Road Boronia 3155,1 Falconer Road,,Boronia,VIC,3155
1 FRASER ST RANDWICK,1 Fraser Street,,Randwick�,NSW,2031
1 Gibbon Street,1 Gibbon Street,LENNOX HEAD,,NSW,2478
1 GLIDERWAY STREET,1 Gliderway Street,,Bundamba,QLD,4034
```

## Reference
https://bitcoinbrisbane-my.sharepoint.com/personal/steve_bitcoinbrisbane_com_au/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fsteve%5Fbitcoinbrisbane%5Fcom%5Fau%2FDocuments%2FIMX%20Ben&originalPath=aHR0cHM6Ly9iaXRjb2luYnJpc2JhbmUtbXkuc2hhcmVwb2ludC5jb20vOmY6L2cvcGVyc29uYWwvc3RldmVfYml0Y29pbmJyaXNiYW5lX2NvbV9hdS9FaEgzN1hkY094NUNrM0RaaWtwb3MwQUJtWnc5ZUdxY0ZHQUJyaWdhQ1FYZkxnP3J0aW1lPUpIMzE2QU5HMTBn
