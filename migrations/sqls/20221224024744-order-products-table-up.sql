CREATE TABLE order_products(
  order_id BIGINT NOT NULL REFERENCES orders(id), 
  product_id BIGINT NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  PRIMARY KEY(order_id, product_id)
);