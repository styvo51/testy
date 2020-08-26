# IMX DOCUMENT VERIFICATION

**Version**: 1.1.0

## Changelog

**26 August 2020** :

- `countryCode` is now required on all 3 routes. Valid values are `AU` or `NZ`. Medicare card and Passport verification are only available for Australia.
- New Zealand driver's license verification requests require a different schema to Australia requests. Examples and schemas have been added.

### Status codes

| Status Codes | Meaning                                                    |
| :----------- | :--------------------------------------------------------- |
| 200          | Success                                                    |
| 400          | Bad request. E.g. If required properties were not provided |
| 403          | The request did not provide a valid api key                |
| 500          | Server error                                               |

### Endpoints:

- POST `/verify-document/driverslicence`
- POST `/verify-document/passport`
- POST `/verify-document/medicarecard`

---

## `POST` /verify-document/driverslicence

Verifies whether a drivers licence is valid according to a third party dataset.

Query params:

```typescript
key: string; // API_KEY
```

Possible status codes:

- 200
- 400
- 403
- 500

Responses may contain a `status` field. This field will contain one of the following:

- 0 - Indicates that a full match on the identity has been returned.
- 1 - Indicates that the Identity was matched, but the name provided was incorrect.
- 2 - Indicates all information provided was incorrect.
- 3 - Indicates the data source(s) being utilised are not working.

### New Zealand Driver's License Request

Request:

- **url** : `"https://imx.tpa.company/verify-document/driverslicence?key=apikey"`
- **method** : `POST`
- **content-type**: `application/json`
- **body schema**:

```json
{
  "countryCode": {
    "type": "string",
    "enum": ["AU", "NZ"],
    "example": "NZ"
  },
  "firstName": {
    "type": "string"
  },
  "middleName": {
    "type": "string"
  },
  "lastName": {
    "type": "string"
  },
  "dateOfBirth": {
    "type": "string",
    "format": "date",
    "pattern": "YYYY-MM-DD",
    "example": "2001-01-05"
  },
  "driversLicenceConsentObtained": {
    "type": "boolean",
    "example": true,
    "description": "Must be true"
  },
  "driversLicenceNo": {
    "type": "string"
  },
  "driversLicenceVersion": {
    "type": "string"
  }
}
```

- **Example Request** :

```json
{
  "countryCode": "NZ", // mandatory
  "firstName": "John", // mandatory input
  "middleName": null, // required if present on Licence
  "lastName": "Smith", // mandatory input
  "dateOfBirth": "1965-01-01", // mandatory input
  "driversLicenceNo": "94977000", // mandatory input
  "driversLicenceVersion": "001", // mandatory input
  "driversLicenceConsentObtained": true // must be true, or the request fails
}
```

Response:

- **status**: `200`
- **content schema**:

```json
{
  "reportingReference": {
    "type": "string",
    "example": "DZ-KWD-000000001042128"
  },
  "safeHarbour": {
    "type": "boolean"
  },
  "driversLicense": {
    "type": "object",
    "properties": {
      "status": {
        "type": "number",
        "example": 0
      },
      "verified": {
        "type": "boolean"
      },
      "safeHarbourScore": {
        "type": "string"
      },
      "firstName": {
        "type": "string"
      },
      "lastName": {
        "type": "string"
      },
      "dateOfBirth": {
        "type": "string"
      },
      "middleName": {
        "type": "string"
      }
    }
  }
}
```

- **Example response:** :

```json
{
  "reportingReference": "DZ-KWL-000000001038588",
  "safeHarbour": false,
  "driversLicense": {
    "status": 0,
    "verified": true,
    "safeHarbourScore": "M2",
    "firstName": "Dana",
    "middleName": "",
    "lastName": "Mitchell",
    "dateOfBirth": "1965-09-13"
  }
}
```

### Australian Driver's License Request

Request:

- **url** : `"https://imx.tpa.company/verify-document/driverslicence?key=apikey"`
- **method** : `POST`
- **content-type**: `application/json`
- **body schema**:

```json
{
  "countryCode": {
    "type": "string",
    "enum": ["AU", "NZ"],
    "example": "AU"
  },
  "firstName": {
    "type": "string",
    "example": "John"
  },
  "middleName": {
    "type": "string",
    "example": "null"
  },
  "lastName": {
    "type": "string",
    "example": "Smith"
  },
  "dateOfBirth": {
    "type": "string",
    "format": "date",
    "pattern": "YYYY-MM-DD",
    "example": "2001-01-05"
  },
  "thirdPartyDatasetsConsentObtained": {
    "example": true,
    "description": "Must be true",
    "type": "boolean"
  },
  "driversLicenceNo": {
    "type": "string",
    "example": "94977000"
  },
  "driversLicenceState": {
    "type": "string",
    "enum": ["QLD", "NSW", "ACT", "VIC", "TAS", "SA", "WA", "NT"],
    "example": "QLD"
  }
}
```

- **Example Request** :

```json
{
  "countryCode": "AU", // mandatory
  "firstName": "John", // mandatory input
  "middleName": null, // required if present on Licence
  "lastName": "Smith", // mandatory input
  "dateOfBirth": "1965-01-01", // mandatory input
  "driversLicenceNo": "94977000", // mandatory input
  "driversLicenceState": "ACT", // mandatory input
  "thirdPartyDatasetsConsentObtained": true
}
```

Response:

- **status**: `200`
- **content schema**:

```json
{
  "reportingReference": {
    "type": "string",
    "example": "DZ-KWD-000000001042128"
  },
  "safeHarbour": {
    "type": "boolean"
  },
  "thirdPartyDatasets": {
    "type": "object",
    "properties": {
      "status": {
        "type": "number",
        "example": 0
      },
      "verified": {
        "type": "boolean"
      },
      "safeHarbourScore": {
        "type": "string"
      },
      "firstName": {
        "type": "string"
      },
      "lastName": {
        "type": "string"
      },
      "dateOfBirth": {
        "type": "string"
      },
      "middleName": {
        "type": "string"
      },
      "driversLicenseNo": {
        "type": "string"
      },
      "driversLicenseState": {
        "type": "string"
      }
    }
  }
}
```

- **Example response:**

```json
{
  "reportingReference": "DZ-KWD-000000001042128",
  "safeHarbour": false,
  "thirdPartyDatasets": {
    "status": 0,
    "verified": true,
    "safeHarbourScore": "M2",
    "firstName": "John",
    "middleName": "",
    "lastName": "Smith",
    "dateOfBirth": "1965-01-01",
    "driversLicenceNo": "94977000",
    "driversLicenceState": "ACT"
  }
}
```

---

## `POST` /verify-document/passport

Verifies whether a passport is valid according to a third party dataset. Currently only available for Australia.

Query params:

```typescript
key: string; // API_KEY
```

Possible status codes:

- 200
- 400
- 403
- 500

### Example

Request:

- **url** : `"https://imx.tpa.company/verify-document/passport?key=apikey"`
- **method** : `POST`
- **content-type**: `application/json`
- **body**:

```json
{
  "countryCode": "AU", // mandatory
  "firstName": "John", // mandatory input
  "middleName": null, //required if present on Passport
  "lastName": "Smith", // mandatory input
  "dateOfBirth": "1965-01-01", // mandatory input
  "passportNo": "C5100511", // mandatory input
  "gender": "Male", // mandatory input
  "thirdPartyDatasetsConsentObtained": true
}
```

Response:

- **status**: `200`
- **content**:

Example response:

```json
{
  "reportingReference": "DZ-KWE-000000001042132",
  "safeHarbour": false,
  "thirdPartyDatasets": {
    "status": 0,
    "verified": true,
    "safeHarbourScore": "M2",
    "firstName": "John",
    "lastName": "Smith",
    "dateOfBirth": "1965-01-01",
    "passportNo": "C5100511"
  }
}
```

---

## `POST` /verify-document/medicarecard

Verifies whether a medicarecard is valid according to a third party dataset. Currently only available for Australia

Query params:

```typescript
key: string; // API_KEY
```

Possible status codes:

- 200
- 400
- 403
- 500

### Example

Request:

- **url** : `"https://imx.tpa.company/verify-document/medicarecard?key=apikey"`
- **method** : `POST`
- **content-type**: `application/json`
- **body**:

```json
{
  "countryCode": "AU", // mandatory
  "firstName": "John", // mandatory input
  "middleName": "Allen", //required if initials are present on Medicare card
  "lastName": "Smith", // mandatory input
  "dateOfBirth": "1965-01-01", // mandatory input
  "medicareCardNo": "3512743581", // mandatory input
  "medicareCardType": "G", // mandatory input
  "medicareIndividualRefNo": "1", // mandatory input
  "medicareExpiryDate": "2019-12", // mandatory input
  "thirdPartyDatasetsConsentObtained": true
}
```

Response:

- **status**: `200`
- **content**:

Example response:

```json
{
  "reportingReference": "DZ-KWR-000000001042137",
  "safeHarbour": false,
  "thirdPartyDatasets": {
    "status": 0,
    "verified": true,
    "safeHarbourScore": "M2",
    "firstName": "John",
    "middleName": "Allen",
    "lastName": "Smith",
    "dateOfBirth": "1965-01-01",
    "medicareCardNo": "3512743581",
    "medicareCardType": "G",
    "medicareIndividualRefNo": 1,
    "medicareExpiryDate": "2019-12-01"
  }
}
```

---
