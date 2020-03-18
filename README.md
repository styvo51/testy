# Imx Node

A node version of Imx. [![CircleCI](https://circleci.com/github/dltx/imx.svg?style=svg&circle-token=957628dcd018f27fd039620506fdacf30072f8c4)](LINK)

## Installation

Clone, install dependancies, configure environment variables

```bash
git clone git@github.com:dltxio/imx.git
cd imx/imx-node
npm install
```

If using a `.env` file:

```
APIKEY=3f85a233-dff8-47ce-a971-5716aa93af9c
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=postgres
DB_PASSWORD=admin
DB_PORT=5432
DB_TEST_DATABASE=test
```

## Usage

This assumes that you have nodemon installed globally.

```bash
npm run start
```

## Tests

There are tests available for the middleware and the `/match` route

```bash
npm run test
```

## Environment variables

The following environment variables need to be set for the server to function:

- APIKEY
- DB_USER
- DB_HOST
- DB_DATABASE
- DB_PASSWORD
- DB_PORT

Additionally, the following environment variable needs to be set to run tests (this must be different from DB_DATABASE):

- DB_TEST_DATABASE
