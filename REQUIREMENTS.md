# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

#### Products

- Index
  `GET ${api}/products`
- Show
  `GET ${api}/products/:product_id`
- Create [token required]
  `POST ${api}/products`
  ```json
  "headers": {
    "Authorization": "Bearer " + TOKEN
  },
  "body": {
    "name": "",
    "price": "",
    "category": ""
  }
  ```

- [OPTIONAL] Top 5 most popular products
  `GET ${api}/dashboard/popular_products`
- [OPTIONAL] Products by category (args: product category)
  `GET ${api}/dashboard/product_by_category?category=perfume`

> ##### Order_Products (products listed in orders)

- Index its Products `{{api}}/orders/:order_id/products`
- Add product to itself `{{api}}/orders/:order_id/products`
- Remove product on itself `{{api}}/orders/:order_id/products/:product_id`

#### Users

- Index [token required
  `GET ${api}/users`

  ```json
  "headers": {
    "Authorization": "Bearer " + TOKEN
  }
  ```

- Show [token required]
  `GET ${api}/users/:user_id`
  ```json
  "headers": {
    "Authorization": "Bearer " + TOKEN
  }
  ```
- Create [token required]
  `POST ${api}/users`
  ```json
  "headers": {
    "Authorization": "Bearer " + TOKEN
  },
  "body": {
    "firstName": "",
    "lastName": "",
    "password": ""
  }
  ```
- Destroy [token required] `{{api}}/users/:id`
  ```json
  "headers": {
    "Authorization": "Bearer " + TOKEN
  }
  ```

#### Orders

- Create `{{api}}/orders`
  ```json
  "body": {
    "user_id": 1,
    "status": "active"
  }
  ```
- index `{{api}}/orders`
- show `{{api}}/orders/:id`
- destroy `{{api}}/orders/:id`
- Current Order by user (args: user id)[token required]
  `GET ${api}/users/:user_id/current`
  ```json
  "headers": {
    "Authorization": "Bearer " + TOKEN
  }
  ```
- [OPTIONAL] Completed Orders by user (args: user id)[token required]
  `GET ${api}/users/:user_id/completed`
  ```json
  "headers": {
    "Authorization": "Bearer " + TOKEN
  }
  ```

## Data Shapes

#### Product

- id
- name
- price
- [OPTIONAL] category

```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price REAL NOT NULL,
  category VARCHAR(255)
);
```

#### User

- id
- firstName
- lastName
- password

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  firstName VARCHAR(50),
  lastName VARCHAR(50),
  password VARCHAR NOT NULL
);
```

#### Orders

- id
- <s>id of each product in the order</s>
- <s>quantity of each product in the order</s>
- user_id
- status of order (active or complete)

```sql
CREATE TYPE status_type AS ENUM (
  'active',
  'complete'
  );
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  users_id BIGINT NOT NULL REFERENCES users(id),
  status status_type NOT NULL DEFAULT 'active'
);
```

> ---
>
> Due many to many relationship now we have <b>Order_Products</b> containing products which have been included inside an order
>
> ---

#### Order_Products

- order_id
- product_id
- quantity of that product in the order

```sql
CREATE TABLE order_products(
  order_id BIGINT NOT NULL REFERENCES orders(id),
  product_id BIGINT NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  PRIMARY KEY(order_id, product_id)
);
```
