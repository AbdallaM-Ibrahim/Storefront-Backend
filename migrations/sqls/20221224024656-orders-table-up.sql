CREATE TYPE status_type AS ENUM (
  'active',
  'complete'
  );
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id),
  status status_type DEFAULT 'active' 
);