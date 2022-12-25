# Storefront Backend
## How to setup
### .env file example
```ts
POSTGRES_HOST='127.0.0.1'
POSTGRES_DB='store_db'
POSTGRES_USER='store_user'
POSTGRES_PASSWORD='password123'
POSTGRES_TEST_DB='store_test_db'
ENV='dev'
BCRYPT_PASSWORD='password123'
SALT_ROUNDS=10
TOKEN_SECRET='myPrivateSecret'
PEPPER='1qaz@WSX'
```

### Database configuration
login into postgres and run this queries
```sql
CREATE DATABASE store_db;
CREATE DATABASE store_test_db;
CREATE USER store_user WITH PASSWORD 'password123';
\c store_db
GRANT ALL PRIVILEGES ON DATABASE store_db TO store_user;
\c store_test_db
GRANT ALL PRIVILEGES ON DATABASE store_test_db TO store_user;
```
exit from postgres `\q`
then run command in terminal 
```console
db-migrate up
```
> from here you should be good to go

### PORTS
- Server Port: 3000
- Database Port: 5432

### Package Installation
install main packages by:
```console
npm i
```
in addition to that will need to install some globally
```console
npm i db-migrate -g
``` 
## Scripts
- Run Server (ts)
```console
npm start
```
- Run Server (js) 
```console
npm run build && node ./build/server
```
- Testing
```console
npm test
```
- Build to JS
```console
npm run build
```
- eslint
```console
npm run lint
```
- prettier
```console
npm run prettier
```

## Notes
- Remember to read the updated version of [REQUIREMENTS.md](REQUIREMENTS.md) file
- Can use my [postman workspace](https://www.postman.com/supply-technologist-95764904/workspace/42629980-c5f2-4180-a8e8-3a4d08b482e8/ "workspace") for testing
- there is a logger you can remove its `.use` comment for debugging 
- 100% feel bad for the delayed submit
