# IMX ORACLE API

### Status codes

| Status Codes | Meaning                                                    |
| :----------- | :--------------------------------------------------------- |
| 200          | Success                                                    |
| 201          | Success, with resource being created                       |
| 204          | Success, with no content returned                          |
| 400          | Bad request. E.g. If required properties were not provided |
| 404          | The resource could not be found                            |
| 403          | The request did not provide a valid api key                |
| 500          | Server error                                               |

### Endpoints:

- POST `/oracle/match`
- POST `/oracle/match/:personId`

---

## `POST` /oracle/match

Checks database for a person who matches request body. If no person is found, a new resource is created. The endpoint responds with the person's id, as well as whether a match was found or not, and if that person's data has been confirmed.

Query params:

```typescript
key: string; // API_KEY
```

Request Body:

```typescript
firstName: string;
lastName: string;
dob: Date;
street: string;
city: string;
state: string;
postcode: string;
email: string;
mobile: string;
```

Responds with:

```typescript
personId: string;
match: boolean;
confirmed: boolean;
```

Possible status codes:

- 200
- 201 (The server did not find a match, but successfully created a new resource.)
- 400
- 403
- 500

### Example

Request:

- **url** : `"https://imx.tpa.company/oracle/match?key=apikey"`
- **method** : `POST`
- **content-type**: `application/json`
- **body**:

```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "dob": "1975-11-23",
  "street": "13 Dawn Street",
  "city": "Brisbane",
  "state": "QLD",
  "postcode": "4001",
  "email": "jane@email.com",
  "mobile": "0413579113"
}
```

Response:

- **status**: `201`
- **content**:

```json
{
  "personId": "1",
  "match": false,
  "confirmed": false
}
```

---

## `POST` /oracle/match/:personId

Updates a person's confirmed status to `true`. If the request is successful, a status code of 204 is returned with no content.

Query params:

```typescript
key: string; // API_KEY
```

Path params:

```typescript
personId: string;
```

Possible status codes:

- 204
- 400
- 403
- 500

### Example

Request:

- **url** : `"https://imx.tpa.company/oracle/match/1?key=apikey"`
- **method** : `POST`
- **content-type**: `application/json`

Response:

- **status**: `204`
- **content**: `none`

---
