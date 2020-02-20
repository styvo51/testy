# Confirm a Name/Address pair

Will return `true` if the person and the address match, and `false` otherwise. Address matches are based on property title, and may not accurately reflect tentant details.
Data for Tasmania is unavailable. Data coverage for Northern Territory and South Australia is incomplete.

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
  "firstName": "[string]",
  "nicknames": "[list of strings]",
  "lastName": "[string]",
  "address1": "[string]",
  "address2": "[string]",
  "postcode": "[3 or 4 digit integer]",
  "state": "[string, one of: QLD, NSW, ACT, VIC, TAS, NT, WA, SA]"
}
```

**Data example** All fields must be sent.

```json
{
  "first_name": "John",
  "last_name": "Smith",
  "nicknames": [],
  "address1": "239 George St",
  "address2": "Brisbane",
  "postcode": "4000",
  "state": "QLD"
}
```

## Success Response

**Condition** : If everything is OK and the details match current records.

**Code** : `200 OK`

**Content example**

```json
{
  "match": true,
  "matchedOn": {
    "surname": "Smith",
    "nicknames": ["Tony"],
    "firstName": ""
  },
  "tried": {
    "surname": "Smith",
    "nicknames": ["Tony"],
    "firstName": "Anthony"
  }
}
```

### Or

**Condition** : If everything is OK and the details do not match current records.
incomplete
**Code** : `200 OK`

**Content example**

```json
{
  "match": false,
  "tried": {
    "surname": "Smith",
    "nicknames": ["Tony"],
    "firstName": "Anthony"
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
