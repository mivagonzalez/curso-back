#Ecommerce application - Coder House

## Run the application

* In order to run the application, please run the following command:

```JavaScript
npm run start:dev
```

* In order for you to run the application, you have to create a .env file in the root folder of the application, following the name convention: env.<environment>.local
* You can use the following snippet as an example of .env file.

```JavaScript
NODE_ENV=development
PORT=5000
HOST=localhost
API_VERSION=v1

# BD
DB_USE_ATLAS=true
DB_NAME='DB_NAME'
DB_PASSWORD='TEST_NAME'
DB_USER='USER_NAME'

#LOCAL DB
LOCAL_DB_NAME='DB_NAME'
LOCAL_DB_HOST=127.0.0.1
LOCAL_DB_PORT=27017

# CORS
ORIGIN = *

#COOKIE
SESSION_SECRET='EXAMPLESECRET'

# GITHUB AUTH
GITHUB_CLIENT_ID='EXAMPLEID'
GITHUB_CLIENT_SECRET='EXAMPLESECRET'
```