# Verify Person Details

Accepts a set of details about a person and returns true or false depending on whether they match current records. Names are fuzzy searched, and a confidence interval is provided. The confidence interval represents the level of certainty that the person retrieved from current records matches the person supplied. The cutoff for the confidence interval is 75%.

The route searches multiple sources, and if a match can be found in one, then the IMX record is updated. If no matches in any sources are found, the route will return false.

**URL** : `/match`

**Method** : `POST`

**Auth required** : YES

**Auth type** : API Key

**Auth method** : Query string

**Auth example** : `/match?key=123456abcde`

**Permissions required** : None

**Data constraints**

Provide the details of the person to be checked.

The following are required.
The system can tolerate misspellings of both first and last name, with this being reflected in the confidence inteveral.

```json
{
  "dob": "[datestring, YYY-MM-DD]",
  "email": "[string, email address]",
  "mobile": "[string, 0412345678]",
  "first_name": "[string]",
  "last_name": "[string]"
}
```

The following fields are optional, but if included they must match exactly (misspellings not tolerated).

```json
{
  "address1": "[string]",
  "address2": "[string]",
  "postcode": "[4 digit integer]",
  "state": "[string]",
  "purchase_price": "[numeric]",
  "bank_name": "[string]",
  "user_name": "[string]",
  "landline": "[string]",
  "url": "[string]",
  "ip": "[string, IPv4 format with or without netmask]",
  "title": "[string]"
}
```

**Data example**

```json
{
  {
  "dob": "1998-01-29",
  "email": "geralt@rivia.net",
  "mobile": "0412345678",
  "first_name": "Geralt",
  "last_name": "du Haute-Bellegarde",
  "address1": "1 Butcher Row",
  "address2": "Blaviken",
  "postcode": 6652,
  "ip": "257.1.57.10/32",
  "title": "Sir"
}
}
```

## Success Response

**Condition** : If the details match current records.

**Code** : `200 OK`

**Content example**

```json
{
  "match": true,
  "confidence": 0.9
}
```

## Error Responses

**Condition** : If the person was not found.

**Code** : `404 NOT FOUND`

**Content Example**

```json
{
  "match": false,
  "confidence": 0.75
}
```
