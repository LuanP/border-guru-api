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
              "amount": 1700.00,
              "currency": "EUR"
            },
            "customer": {
              "name": "Peter Lustig",
              "address": {
                "streetAddress": "Steindamm 80"
              },
              "item": {
                "id": 1,
                "name": "Macbook",
                "price": {
                  "amount": 1700.00,
                  "currency": "EUR"
                }
              }
            }
          }
        ]

### Create Order [POST /orders]

+ Request (application/json)

        {
          "customer": {
            "name": "Peter Lustig",
            "address": {
              "streetAddress": "Steindamm 80"
            },
            "item": {
              "name": "Macbook",
              "price": {
                "amount": 1700.00,
                "currency": "EUR"
              }
            }
          }
        }

+ Response 201 (application/json)

    + Headers

            Location: /v1/orders/1

    + Body

            {
              "id": 1,
              "price": {
                "amount": 1700,
                "currency": "EUR"
              },
              "customer": {
                "name": "Peter Lustig",
                "address": {
                  "streetAddress": "Steindamm 80"
                },
                "item": {
                  "name": "Macbook",
                  "price": {
                    "amount": 1700,
                    "currency": "EUR"
                  }
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
              "streetAddress": "Steindamm 81"
            },
            "item": {
              "name": "Macbook",
              "price": {
                "amount": 1700.00,
                "currency": "EUR"
              }
            }
          }
        }

+ Response 200 (application/json)

    + Headers

            Location: /v1/orders/1

    + Body

            {
              "id": 1,
              "price": {
                "amount": 1700.00,
                "currency": "EUR"
              },
              "customer": {
                "name": "Peter Lustig",
                "address": {
                  "streetAddress": "Steindamm 81"
                },
                "item": {
                  "name": "Macbook",
                  "price": {
                    "amount": 1700.00,
                    "currency": "EUR"
                  }
                }
              }
            }

### Delete Order [DELETE /v1/orders/{id}]

+ Parameters

  + id: 1 (number, required) - the order identifier

+ Response 204

## Items Collection [/v1/items]

### List all the items [GET /v1/items]
It list all the item names and how many times they have been ordered, it shows the items that have been ordered the most at the beginning of the list, and in case of items with the same amount of occurrences, it's sorted by their names alphabetically.


+ Response 200 (application/json)

        [
          {
            "item": {
              "name": "Macbook"
            },
            "info": {
              "ordered": {
                "times": 2
              }
            }
          }
        ]
