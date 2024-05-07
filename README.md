# Building project

# IMPORTANT! Configuring JWT-authorization

Go to ```./auth.js```.

You will see this code

```javascript
const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_SECRET = '';
```

To successfully run this project you need to set your token ```ACCESS_TOKEN_SECRET```

## Installing requirements

```
npm install -i
```

## Running migrations
```
npx sequelize-cli db:migrate
```

## Starting web-server
```
npm start
```

Go to page http://localhost:3000
