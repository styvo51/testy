# IMX DOCUMENT VERIFICATION

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

### Example

Request:

- **url** : `"https://.../verify-document/driverslicence?key=apikey"`
- **method** : `POST`
- **content-type**: `application/json`
- **body**:

```json
{
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
- **content**:

Example response:

```json
{
  "reportingReference": "DZ-KWD-000000001042128",
  "safeHarbour": false,
  "thirdPartyDatasets": {
    "status": 0,
    "verified": true,
    "safeHarbourScore": "M2",
    "firstName": "John",
    "lastName": "Smith",
    "dateOfBirth": "1965-01-01",
    "driversLicenceNo": "94977000",
    "driversLicenceState": "ACT"
  }
}
```

---

## `POST` /verify-document/passport

Verifies whether a passport is valid according to a third party dataset.

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

- **url** : `"https://.../verify-document/passport?key=apikey"`
- **method** : `POST`
- **content-type**: `application/json`
- **body**:

```json
{
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

Verifies whether a medicarecard is valid according to a third party dataset.

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

- **url** : `"https://.../verify-document/medicarecard?key=apikey"`
- **method** : `POST`
- **content-type**: `application/json`
- **body**:

```json
{
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
