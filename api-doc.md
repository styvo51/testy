# IMX

A service for finding duplicate records

## Installation
Instructions are for Ubuntu flavoured linux.
### Install dotnet core
```bash
wget -q https://packages.microsoft.com/config/ubuntu/18.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
sudo add-apt-repository universe
sudo apt-get update
sudo apt-get install apt-transport-https
sudo apt-get update
sudo apt-get install dotnet-sdk-2.2
```
### Install PostgreSQL
```bash
sudo apt-get update
sudo apt-get install postgresql-11
```
### Install nginx
TODO: nginx config to reverse proxy at the service.
```bash
sudo apt-get update
sudo apt-get install nginx
```
### Open port 443 in UFW
If you have a 
```bash
sudo ufw allow 443
```
### Setup the app
The deploy script will copy the imx.service file to `/etc/systemd/system`. It will then enable and start the service.
```bash
git clone
cd imx
sudo chmod u+x deploy.sh
./deploy.sh
```

## Usage
The service should start automatically on boot. You can monitor the service with:

```bash
systemctl status imx.service
```
If you need to start the service:
```bash
systemctl start imx.service
```
If you need to restart the service:
```bash
systemctl restart imx.service
```
If you need to stop the service:
```bash
systemctl stop imx.service
```
If you need to disable the service:
```bash
systemctl disable imx.service
```

# IMX API
## Overview
By default, the IMX service will bind to `http://localhost:5000`.

## Get multiple people

Retrieve everyone

**URL** : `/person`

**Method** : `GET`

**Auth required** : YES

**Permissions required** : None

### Success Response

**Code** : `200 OK`

**Content examples**

Returns all the people in the database

```json
[{
    "ID":1234,
	"Title":"Mr",
	"ForeName":"John",
	"LastName":"Smith",
	"Address1":"1 Pelican Drive",
	"Address3":"Sydney",
	"DOB":"01/01/1980",
	"Telephone":"02 1234 5678",
	"Url":"example.com",
	"IP":"127.0.0.1"
},
{
    "ID":5678,
	"Title":"Mr",
	"ForeName":"Jack",
	"LastName":"Smith",
	"Address1":"1 Pelican Drive",
	"Address3":"Sydney",
	"DOB":"01/01/1980",
	"Telephone":"02 1234 5678",
	"Url":"example.com",
	"IP":"127.0.0.1"
}]
```


## Retrieve a person by ID
Retrieve a specific person's record by ID number

**URL** : `/person/:id`

**URL Parameters** : `id=[integer]` where `id` is the ID of the person's record in the database.

**Method** : `GET`

**Auth required** : YES

**Permissions required** : None

### Success Response

**Code** : `200 OK`

**Content examples**

For a Person with ID 1234 on the local database with all fields filled.

```json
{
    "ID":1234,
	"Title":"Mr",
	"ForeName":"John",
	"LastName":"Smith",
	"Address1":"1 Pelican Drive",
	"Address3":"Sydney",
	"DOB":"01/01/1980",
	"Telephone":"02 1234 5678",
	"Url":"example.com",
	"IP":"127.0.0.1"
}
```

## Create New Person
Create a record for a new person if that person doesn't already exist.

**URL**: `/person`

**Method**: `POST`

**Auth required** : YES

**Permissions required** : None

**Data constraints**

Provide the title, first name, last name, address line 1, address line 2, DoB, telephone, URL, and IP of the person to be created.

```json
{
	"Title":"[16 chars max]",
	"ForeName":"[200 chars max]",
	"LastName":"[200 chars max]",
	"Address1":"[200 chars max]",
	"Address3":"[200 chars max]",
	"DOB":"[date]",
	"Telephone":"[200 chars max]",
	"Url":"[200 chars max]",
	"IP":"[50 chars max]"
}
```

**Data example** All fields must be sent.

```json
{
    "Title":"Mr",
	"ForeName":"John",
	"LastName":"Smith",
	"Address1":"1 Pelican Drive",
	"Address3":"Sydney",
	"DOB":"01/01/1980",
	"Telephone":"02 1234 5678",
	"Url":"example.com",
	"IP":"127.0.0.1"
}
```

### Success Response

**Condition** : If everything is OK and an record didn't exist for this Person.

**Code** : `201 CREATED`

**Content example**

```json
{
    "id": 1234,
    "Title":"Mr",
	"ForeName":"John",
	"LastName":"Smith",
	"Address1":"1 Pelican Drive",
	"Address3":"Sydney",
	"DOB":"01/01/1980",
	"Telephone":"02 1234 5678",
	"Url":"example.com",
	"IP":"127.0.0.1"
}
```

### Error Responses

**Condition** : If record already exists for this Person.

**Code** : `303 SEE OTHER`

**Headers** : `Location: http://testserver/person/1234/`

**Content** : `{}`

#### Or

**Condition** : If fields are missing.

**Code** : `400 BAD REQUEST`

**Content example**

```json
{
    "ForeName":["All fields are required"]
}
```


## Update Person
Update a record.

**URL** : `/person/:id`

**URL Parameters** : `id=[integer]` where `id` is the ID of the person's record in the database.

**Method** : `PUT`

**Auth required** : YES

**Permissions required** : None

**Data constraints**

```json
{
	"Title":"[16 chars max]",
	"ForeName":"[200 chars max]",
	"LastName":"[200 chars max]",
	"Address1":"[200 chars max]",
	"Address3":"[200 chars max]",
	"DOB":"[date]",
	"Telephone":"[200 chars max]",
	"Url":"[200 chars max]",
	"IP":"[50 chars max]"
}
```

Note that `id` is currently a read only fields.

**Data examples**

Partial data is allowed.

```json
{
    "ForeName": "Simon",
    "Telephone":"03 8765 4321"
}
```

Empty data can be PUT to erase a field

```json
{
    "Url": ""
}
```

### Success Responses

**Condition** : Data provided is valid and User is Authenticated.

**Code** : `200 OK`

**Content example** : Response will reflect back the updated information. A record with `id` of '1234' has the fore name and url updated:

```json
{
    "id": 1234,
    "ForeName": "Joe",
    "Url": ""
}
```

### Error Response

**Condition** : If provided data is invalid, e.g. a name field is too long.

**Code** : `400 BAD REQUEST`

**Content example** :

```json
{
    "IP": ["Please provide maximum 16 character or empty string"]
}
```

### Notes

* Endpoint will ignore irrelevant and read-only data such as parameters that
  don't exist, or fields that are not editable like `id`.

## Delete a Person's Record
Delete the Person identified by the provided ID number.

**URL** : `/person/:id`

**URL Parameters** : `id=[integer]` where `id` is the ID of the person's record in the database.

**Method** : `DELETE`

**Auth required** : YES

**Permissions required** : None

**Data** : `{}`

### Success Response

**Condition** : If the Person exists.

**Code** : `204 NO CONTENT`

**Content** : `{}`

### Error Responses

**Condition** : If there was no record for a Person with that ID number.

**Code** : `404 NOT FOUND`

**Content** : `{}`

#### Or

**Condition** : User is not authorized.

**Code** : `403 FORBIDDEN`

**Content** : `{}`





