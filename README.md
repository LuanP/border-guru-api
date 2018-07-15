# BorderGuru API

![Travis](https://img.shields.io/travis/LuanP/border-guru-api.svg) ![Coveralls github](https://img.shields.io/coveralls/github/LuanP/border-guru-api.svg) [![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg)](https://github.com/LuanP/django_sites_web)

> A BorderGuru Application Task.

The task is to develop an application using Node.js (JavaScript / TypeScript) that performs the following kind of operations on the data:

1. Get all orders from a given customer
2. Get all orders for a given address
3. Create a new order
4. Update an order by a given order identifier
5. Delete order by a given order identifier
6. Get a list with all the item names and how many times they have been ordered, show the items that have been ordered the most at the beginning of the list, and in case of items with the same amount of occurrences, then sort their names alphabetically.

Now imagine that after deploying and running the system described before successfully for some months, your stakeholders ask you to store information about customers. Assuming that you cannot edit the order structure you created in the previous exercise, as it would break backward compatibility, add all the data you think is necessary to represent a customer entity and provide the following functionalities:

1. Get customer info
2. Update customer info
3. Delete customer info
4. Get all order bought by a customer
5. Get the amount of money paid by a customer 6. Get all customers that bought a certain item

## Table of Contents

- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [API](#api)
- [Contribute](#contribute)
- [License](#license)


## Background

This project was built and tested with `Node 8.11.3` / `Npm 6.2.0`.

It's recommended that you use docker-compose for running this project.

The project uses `MySQL` as database.

This project uses `dotenv`. If you want to use it copy the `env.sample` to `.env-{desired-env}` and edit it's variables.

```
cp .env.sample .env-stage
vi .env-stage
```

## Install

Just run:

```
docker-compose up
```

### Manual install

Requirements:
- MySQL (tested with 5.7)
- Node / Npm (tested with 8.11.3 / 6.2.0)

Set up you database:

```
mysql -u root -p
CREATE DATABASE yourdb;
CREATE USER youruser;
GRANT ALL PRIVILEGES ON `yourdb`.* to `youruser`@`localhost` IDENTIFIED BY 'yourpassword';
FLUSH PRIVILEGES;
```

And install:

```
npm install
```

## Usage

If you have chosen the path of happiness using docker-compose you will be set up and running only with the command of the previous section:

```
docker-compose up
```

### Manual usage

```
npm run local
```

## API

The API is documented using [API Blueprint](https://apiblueprint.org/) and the docs can be seen here:

[API Docs](./docs/border-guru-api.md)

or here (requires login):

[Apiary](https://borderguruapi.docs.apiary.io/)

## Contribute

PRs accepted.

Small note: If editing the Readme, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

[GNU General Public License v3.0](./LICENSE)
