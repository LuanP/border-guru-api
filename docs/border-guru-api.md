FORMAT: 1A
HOST: https://border-guru-api.luanpablo.com/

# border-guru-api

A simple API allowing consumers to view and create orders.

## Orders Collection [/v1/orders{?customer.name,customer.address}]

+ Parameters

  + customer.name: `Peter Lustig` (string, optional)
  + customer.address: `Steindamm 80` (string, optional)

### Get orders [GET /v1/orders{?customer.name,customer.address}]

+ Response 200 (application/json)

        [
          {
            "id": 1,
            "price": {
              "amount": "1700.00",
              "currency": "EUR"
            },
            "address": {
              "id": 1,
              "streetName": "Steindamm 80",
              "createdAt": "2018-07-14T04:15:28.000Z",
              "updatedAt": "2018-07-14T04:15:28.000Z"
            },
            "createdAt": "2018-07-14T04:16:52.000Z",
            "updatedAt": "2018-07-14T04:16:52.000Z",
            "customer": {
              "id": 1,
              "name": "Peter Lustig",
              "createdAt": "2018-07-14T04:15:14.000Z",
              "updatedAt": "2018-07-14T04:15:14.000Z",
            },
            "item": {
              "id": 1,
              "name": "Macbook",
              "price": {
                "amount": "1700.00",
                "currency": "EUR"
              },
              "createdAt": "2018-07-14T04:16:15.000Z",
              "updatedAt": "2018-07-14T04:16:15.000Z"
            }
          }
        ]

### Create Order [POST /v1/orders]

+ Request (application/json)

        {
          "customer": {
            "name": "Peter Lustig",
            "address": {
              "streetName": "Steindamm 80"
            }
          },
          "item": {
            "name": "Macbook",
            "price": {
              "amount": "1700.00",
              "currency": "EUR"
            }
          }
        }

+ Response 201 (application/json)

    + Headers

            location: /v1/orders/1

    + Body

            {
              "id": 1,
              "price": {
                "amount": "1700.00",
                "currency": "EUR"
              },
              "address": {
                "id": 1,
                "streetName": "Steindamm 80",
                "createdAt": "2018-07-14T04:15:28.000Z",
                "updatedAt": "2018-07-14T04:15:28.000Z"
              },
              "customer": {
                "id": 3,
                "name": "Peter Lustig",
                "createdAt": "2018-07-14T04:15:28.000Z",
                "updatedAt": "2018-07-14T04:15:28.000Z"
              },
              "item": {
                "name": "Macbook",
                "price": {
                  "amount": "1700.00",
                  "currency": "EUR"
                }
              }
            }

### Update Order [PUT /v1/orders/{id}]

+ Parameters

  + id: 1 (number, required) - the order identifier

+ Request (application/json)

        {
          "customer": {
            "name": "Peter Lustig",
            "address": {
              "streetName": "Steindamm 81"
            },
            "item": {
              "name": "Macbook",
              "price": {
                "amount": "1700.00",
                "currency": "EUR"
              }
            }
          }
        }

+ Response 200 (application/json)

    + Body

            [
              {
                "id": 1,
                "price": {
                  "amount": "1700.00",
                  "currency": "EUR"
                },
                "address": {
                  "id": 1,
                  "streetName": "Steindamm 80",
                  "createdAt": "2018-07-14T04:15:28.000Z",
                  "updatedAt": "2018-07-14T04:15:28.000Z"
                },
                "customer": {
                  "id": 1,
                  "name": "Peter Lustig",
                  "createdAt": "2018-07-14T04:15:14.000Z",
                  "updatedAt": "2018-07-14T04:15:14.000Z"
                },
                "item": {
                  "id": 1,
                  "name": "Macbook",
                  "price": {
                    "amount": "1700.00",
                    "currency": "EUR"
                  },
                  "createdAt": "2018-07-14T04:16:15.000Z",
                  "updatedAt": "2018-07-14T04:16:15.000Z"
                }
              }
            ]

### Delete Order [DELETE /v1/orders/{id}]

+ Parameters

  + id: 1 (number, required) - the order identifier

+ Response 204

## Items Collection [/v1/items/informations]

### List all the items [GET /v1/items/informations]
It list all the item names and how many times they have been ordered, it shows the items that have been ordered the most at the beginning of the list, and in case of items with the same amount of occurrences, it's sorted by their names alphabetically.


+ Response 200 (application/json)

        [
          {
            "item": {
              "id": 1,
              "name": "Macbook"
            },
            "info": {
              "ordered": {
                "times": 2
              }
            }
          }
        ]

## Customers Collection [/v1/customers]

### Get customer information [GET /v1/customers/{id}]

+ Parameters

  + id: 1 (number, required) - the order identifier

+ Response 200 (application/json)

        {
          "id": 3,
          "name": "user name",
          "createdAt": "2018-07-15T02:18:30.000Z",
          "updatedAt": "2018-07-15T02:18:30.000Z"
        }
