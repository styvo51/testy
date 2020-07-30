# Get contact details for property owner

**Revision** : 1.2.1  
**Revision date** : 28 July 2020

Get the contact details for the owner of a property and confirm if the provided name is the owner (owner/occupier)

**URL** : `https://imx.tpa.company/contacts`

**Live API key** : `provided by tpa`

**Test URL** : `https://test.imx.tpa.company/contacts`

**Test API Key**: `apikey`

**Method** : `POST`

**Auth required** : YES

**Auth type** : Api key sent as a `key` query string. Eg: `/contacts?key=abc`. Api key to be provided by TPA to the api consumer

**Permissions required** : None

**Data constraints**

Provide details of the person and address to search for.

```json
{
  "street": "String, the street address of the property",
  "city": "String, the city component of the property address",
  "state": "String, 2 or 3 character state code for the property address",
  "postcode": "String, 4 digit postcode of the address"
}
```

**Data example** Address fields are required.

```json
{
  "street": "123 Some Street",
  "city": "Kedron",
  "state": "QLD",
  "postcode": "4031"
}
```

## Success Response

**Code** : `200 OK`

**Content examples**

For an owner/occupier property with the owner details on file. Raw name/addresses are the raw property owner data on file. For NSW and QLD, this is almost always going to be present. It is usually free text and formats may differ quite extensively. Raw data is unavailable for Tasmania.

```json
{
  "owner_occupied": true,
  "owner_contacts": {
    "owner_name": {
      "first_name": "John",
      "last_name": "Smith",
      "raw_name_record": "John Smith"
    },
    "email": "john.smith@fake-email.com",
    "phone": "0212345678",
    "address": {
      "street": "123 Some Street",
      "city": "Northgate",
      "postcode": 1234,
      "state": "QLD"
    },
    "raw_addresses": [
      "123 Some Street, Northgate, 1234, QLD",
      "PO Box 123, Northgate, 1234"
    ]
  }
}
```

For a property whose tenant is not the owner and the owner's details are available

```json
{
  "owner_occupied": false,
  "owner_contacts": {
    "owner_name": {
      "first_name": "Eric",
      "last_name": "Widget",
      "raw_name_record": "Eric Widget"
    },
    "email": "e.widget@fake-email.com",
    "phone": "0487654321",
    "address": {
      "street": "25 Some Other Street",
      "city": "Kedron",
      "postcode": 1234,
      "state": "QLD"
    },
    "raw_addresses": ["25 Some Other Street, Northgate, 1234, QLD"]
  }
}
```

For a property where no contact data is available. In this case, it is possible that we can confirm/refute owner occupancy, but lack contact details beyond the property address. The `owner_occupied` field can thus be either `true` or `false`.

```json
{
  "owner_occupied": false
}
```

## Notes

- Contact information is provided on a best efforts basis. Some fields may be missing if they are unavailable. If the `contacts` field is present, then a minimum viable amount of contact data is available.
- Minimum viable contact data is defined as enough information to be able to contact the target via a single method. Examples include an email address, a phone number, or a complete address. For the purposes of this api, a single `raw_address` counts as contactable.
- Tasmanian addresses are unavailable for search and will return with a 400 error and the following message:

```json
{
  "error": "Tasmania is unavailable for search"
}
```

## Test API

A test api matching the same spec is available at `https://test.imx.tpa.company/contacts`. Use `apikey` as the API key. The following addresses can be used to query the api.

### Owner Occupied

```
{
"street":"13 Dawn street",
"city":"Brisbane",
"state":"QLD",
"postcode":"4001"
}
```

### Not Owner occupied, but records are available

```
{
"street":"33 Ableton Road",
"city":"Sydney",
"state":"NSW",
"postcode":"2000"
}
```

### No records present

```
{
"street":"127 Beckett St",
"city":"Melbourne",
"state":"VIC",
"postcode":"3000"
}
```
