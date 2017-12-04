# verified locations for smart contracts - frontend

This is the frontend of the verified locations for the blockchain project.

## Installing / Getting started

- run `git clone https://github.com/danieldimit/iosl-verified-locations-for-smart-contracts.git`
- run `cd frontend`
- run `npm i` or `yarn install`
- run `npm start`

## Developing

### Built With
React / Redux / Less / NodeJS / Express

### Prerequisites
- Node JS / NPM
- PM2 in production mode



### Building

#### Development
##### Styling:

- `grunt less` compiles less files
- `grunt watch` watches the less files and compiles them after every change

##### React and Express App
If you started the server with `npm start` it’s running with webpack dev and hot middleware so changes on react or server files should retranspile the files automatically. You can manually start (restart) the server by running

`npm run start-with-babel-node`

#### Production
To run the app in prodcution mode you need to run

`npm run start-production`

**OR**

##### 1. transpile the app with webpack for production mode by running

`webpack -p`

##### 2. Compile the less files, minificate the stylesheet, give it a hash and override the `<link href="styleseeht.css`> by running

`grunt production`

##### 3. Transpile the server files (including the react app for server side rendering) by running

`npm run build`

##### 4. Start the the server by running

`npm run start-production-server`

This uses PM2 process manager. You can also start the server with node or any other tool, just set the NODE_ENV to production and use the entry point `dist/server/index.js`

## Versioning

0.0.1


## Configuration

### 1.
You can add a .env file to the root. The server reads following variables:

```
//Port in production
PORT=3000

//Port in development
DEV_PORT=3000

//Turn on or off basic auth in development
BASIC_AUTH=true //or false

//Name for basic auth
BASIC_AUTH_NAME=MyName

//Password for basic auth
BASIC_AUTH_PASSWORD=password
```

### 2.
You can change the root url to the backend in src/app/config.js

```
export const backendUrl = 'http://…'
```

## Licensing


