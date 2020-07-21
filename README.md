# Imx Node

[![CircleCI](https://circleci.com/gh/dltxio/imx/tree/master.svg?style=svg&circle-token=957628dcd018f27fd039620506fdacf30072f8c4)](https://circleci.com/gh/dltxio/imx/tree/master)

A node version of Imx.

## Installation

Clone, install dependancies, configure environment variables

```bash
git clone git@github.com:dltxio/imx.git
cd imx
npm install
```

## Usage

- `npm start`: Starts the server
- `npm run dev`: Runs the server with hot reloading
- `npm test`: Runs test suites
- `npm run ci:test`: Runs test suites, but configured for use in continuous integration

## Environment variables

Environment variables should be stored in a .env file in the root directory. For tests, environment variables are stored in .env.test.

| Variable                     | Required? | Default                                 |
| :--------------------------- | :-------- | :-------------------------------------- |
| NODE_ENV                     | yes       | 'test' if testing, otherwise undefined. |
| DB_TEST_DATABASE             | yes       | undefined                               |
| DATA_ZOO_USERNAME            | yes       | undefined                               |
| DATA_ZOO_PASSWORD            | yes       | undefined                               |
| DATA_ZOO_DVS_REQUEST_EXPIRY  | no        | '90 days'                               |
| DATA_ZOO_PEPS_REQUEST_EXPIRY | no        | '90 days'                               |
| PORT                         | no        | 5000                                    |
| PGHOST                       | no        | 'localhost'                             |
| PGUSER                       | no        | process.env.USER                        |
| PGDATABASE                   | no        | process.env.USER                        |
| PGPASSWORD                   | no        | null                                    |
| PGPORT                       | no        | 5432                                    |
| DOMAIN_ID                    | yes       | id                                      |
| DOMAIN_SECRET                | yes       | secret                                  |

- `NODE_ENV`: This should either be 'development', 'produciton', or 'test'.
- `DB_TEST_DATABASE`: This should NOT be the same as PGDATABASE. All the tables on the test database are dropped before each test so proceed with caution.
- `DATA_ZOO_DVS_REQUEST_EXPIRY`: This is the time in which the response received from the datazoo api is reused for matching requests from end users. It takes the format 'number unit', e.g. '1 second', '2 years', '30 days', etc.
- `DATA_ZOO_PEPS_REQUEST_EXPIRY`: Same as above, but for the politically exposed persons endpoint.
- `DOMAIN_ID` and `DOMAIN_SECRET`: Credentials to retrieve data from the Domain Price Finder api.

## Security

Secured routes require an api key to be added as a query parameter to the request url. E.g. `.../person?key=API_KEY`

Users can be restricted to specific routes by adding a record to the user_routes table.

E.g.

| user_id | route         | access                                                                                                                                                                                                        |
| :------ | :------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1       | \*            | Can access all routes. If no entries exist in the user_routes table, this is the default. default.                                                                                                            |
| 2       | /exactpath    | Will work with the exact match, but not `/exactpath/other` etc.                                                                                                                                               |
| 2       | /exactpath/\* | Will NOT work with `/exactpath` (use /exactpath\* see below) but will match with `/exactpath/1` etc.                                                                                                          |
| 3       | /person\*     | Will match with `/person` and any additional endpoints which begin with `/person`. E.g. `/person/:id` or `/person/user/name` etc. This will not allow access to url's such as `/something/person` (see below) |
| 3       | \*/user\*     | May be used for any endpoints with /user in the chain. e.g. `/api/user`.                                                                                                                                      |

If the incoming request matches any of the entries, the request is allowed to pass.

Alternatively, a specific endpoint or endpoints may need to be restricted to only certain users. To do this, the 'whitelistByUsers' middleware can be used. Simply include this middleware after the 'auth' middelware and pass it an array of whitelisted usernames. E.g.

```javascript
app.use(
  "/restricted",
  auth,
  whitelistByUsers(["Admin", "PrivilegedUser"]),
  controller
);
```
