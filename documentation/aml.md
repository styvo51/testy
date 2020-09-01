# IMX POLITICALLY EXPOSED PERSONS & Sanctions

### Status codes

| Status Codes | Meaning                                                    |
| :----------- | :--------------------------------------------------------- |
| 200          | Success                                                    |
| 400          | Bad request. E.g. If required properties were not provided |
| 403          | The request did not provide a valid api key                |
| 500          | Server error                                               |

## `POST` /aml/watchlist

Checks whether a person is recorded as an officially sanctioned individual and person of special interest on a third party dataset.

**Query params** :

- **key** : the api key provided by TPA

**Possible status codes** :

- 200
- 400
- 403
- 500

### Example

**Request:**

- **url** : `"https://imx.tpa.company/aml/watchlist?key=apikey"`
- **method** : `POST`
- **content-type**: `application/json`
- **body schema**:

```json
{
  "firstName": {
    "type": "string",
    "description": "The first name of the person to search for"
  },
  "lastName": {
    "type": "string",
    "description": "The last name of the person to search for"
  },
  "gender": {
    "type": "string",
    "description": "The gender of the person to search for",
    "enum": ["Male", "Female"]
  },
  "dateOfBirth": {
    "type": "string",
    "description": "The date of birth of the person to search for",
    "format": "YYYY-MM-DD"
  }
}
```

- **example body** :

```json
{
  "firstName": "Nur",
  "lastName": "Misuari",
  "gender": "Male",
  "dateOfBirth": "1939-03-03"
}
```

**Response:**

- **status**: `200`
- **content schema**:

```json
{
  "countryCode": "Global",
  "clientReference": {
    "type": "string"
  },
  "reportingReference": {
    "type": "string"
  },
  "matchStatus": {
    "type": "string",
    "enum": ["Match", "No Match"]
  },
  "searchErrorMessage": {
    "type": "string"
  },
  "safeHarbour": {
    "type": "boolean"
  },
  "searchStatus": {
    "type": "string",
    "enum": ["Successful", "Failure"]
  },
  "serviceResponses": {
    "type": "object",
    "properties": {
      "Watchlist AML": {
        "type": "object",
        "properties": {
          "status": 0,
          "sourceStatus": {
            "type": "string",
            "enum": ["Successful", "Failure"]
          },
          "errorMessage": "",
          "identityVerified": {
            "type": "boolean"
          },
          "safeHarbourScore": {
            "type": "string"
          },
          "nameMatchScore": {
            "type": "string"
          },
          "addressMatchScore": {
            "type": "string"
          },
          "verifications": {
            "dateOfBirth": {
              "type": "boolean"
            },
            "firstName": {
              "type": "boolean"
            },
            "gender": {
              "type": "boolean"
            },
            "lastName": {
              "type": "boolean"
            }
          },
          "returnedData": {
            "type": "object",
            "properties": {
              "watchlistResults": {
                "type": "array",
                "items": [
                  {
                    "additionalInfoURL": {
                      "type": "string",
                      "description": "Url to Watchlist report"
                    },
                    "category": {
                      "type": "string",
                      "enum": [
                        "Politically Exposed Person",
                        "Sanction",
                        "Relatives and Close Associates",
                        "Special Interest Person",
                        "Special Interest Entities",
                        "Adverse Media"
                      ]
                    },
                    "deathIndex": {
                      "type": "string",
                      "enum": ["NO", "YES"]
                    },
                    "gender": {
                      "type": "string",
                      "enum": ["Male", "Female"]
                    },
                    "otherNames": {
                      "type": "array",
                      "items": [{ "type": "string" }]
                    },
                    "scanId": {
                      "type": "string"
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  }
}
```

- **example content**:

```json
{
  "countryCode": "Global",
  "clientReference": "Test_0001",
  "reportingReference": "DZ-083a258d-88d2-4b4d-a893-559aa737ade7",
  "matchStatus": "Match",
  "searchErrorMessage": "",
  "safeHarbour": false,
  "searchStatus": "Successful",
  "serviceResponses": {
    "Watchlist AML": {
      "status": 0,
      "sourceStatus": "Successful",
      "errorMessage": "",
      "identityVerified": true,
      "safeHarbourScore": "none",
      "nameMatchScore": "1.000",
      "addressMatchScore": "N/A",
      "verifications": {
        "dateOfBirth": true,
        "firstName": true,
        "gender": true,
        "lastName": true
      },
      "returnedData": {
        "watchlistResults": [
          {
            "additionalInfoURL": "https://idu.datazoo.com/api/v2/watchlist/PDF/519303",
            "category": "Politically Exposed Person",
            "deathIndex": "NO",
            "gender": "Male",
            "otherNames": ["Nour Misuari"],
            "scanId": "I519303"
          }
        ]
      }
    }
  }
}
```

---
