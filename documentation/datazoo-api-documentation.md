# Confirm a Name/Address pair

Will return true if the surname and address match, or if the property is held by a corporation.
Data coverage for TAS, ACT, NT, and SA is incomplete or unavailable, and may return a false negative/postive.

**URL** : `https://api.imxdata.com.au/confirm`

**Method** : `POST`

**HTTPS Only** : Yes

**Auth required** : Yes

**Auth type** : API key, provided as a query string value for `key`

**Auth Example** : `https://api.imxdata.com.au/confirm?key=1234abcd`

**Permissions required** : None

**Constraints** : Has a rate limit of 10 requests/second or 50,000 requests per month. Server will return a `429 TOO MANY REQUESTS` response if either limit is exceeded.

**Data constraints**

Provide name and address to check. Last name must be exact.

```json
{
  "lastName": "[string]",
  "address1": "[string]",
  "address2": "[string]",
  "postcode": "[3 or 4 digit integer, beginning with 1]",
  "state": "[string, one of: QLD, NSW, ACT, VIC, TAS, NT, WA, SA]"
}
```

**Data example** All fields must be sent.

```json
{
  "last_name": "Smith",
  "address1": "239 George St",
  "address2": "Brisbane",
  "postcode": "4000",
  "state": "QLD"
}
```

## Success Response

**Condition** : If everything is OK and a match was made.

**Code** : `200 OK`

**Content example**

```json
{
  "match": true,
  "corporate": false,
  "owner": "Eleanor Jean & John Peter Smith",
  "matchedOn": {
    "surname": "Smith"
  },
  "tried": {
    "surname": "Smith"
  }
}
```

### Or

**Condition** : If everything is OK and the details do not match current records.
**Code** : `200 OK`

**Content example**

```json
{
  "match": false,
  "corporate": false,
  "tried": {
    "surname": "Smith"
  }
}
```

### Or

**Condition** : If the address has a corporate owner
**Code** : `200 OK`
**Content example**

```json
{
  "match": false,
  "corporate": true,
  "owner": "XYZ PTY LTD",
  "tried": {
    "surname": "smith"
  }
}
```

## Error Responses

**Condition** : If fields are missed.

**Code** : `400 BAD REQUEST`

**Content example**

```json
{
  "last_name": ["This field is required."]
}
```

### Or

**Condition** : If API key is missing

**Code** : `403 FORBIDDEN`

**Content example**

```json
{
  "error": "Unable to authenticate your api key"
}
```

### Or

**Condition** : If monthly rate limit is exceeded. Will also throw a `429` if the per second rate limit is exceeded.

**Code** : `429 TOO MANY REQUESTS`

**Content example**

```json
{
  "error": "Monthly rate limit exceeded"
}
```
