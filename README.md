# Game Of Three Server by Yigit Yesilpinar for lieferando.de assignment

Socket server for the game, using Express, socket.io, mongoDB and mongoose

## Requirements

 **node: 6.9.3, npm: 3.10.10**

## Instructions

Please install all required npm modules for the main application

```sh
npm install
```

#### Production Build

To build the server application production-ready under **"./productionServer"** folder, please type

```sh
npm run build
```

When the building process is finished, to go inside the **productionServer** folder, please type

```sh
cd productionServer
```

Please install the dependencies of productionServer module

```sh
npm install
```

To run the server (from the productionServer folder), please type

```sh
npm start
```

Local Server runs at **localhost:4444** (with default configuration),

There is a running instance of the server On amazon <http://34.208.237.222/>, but this is just the server no html response for the address please visit

the client application to play the game served at <http://52.10.232.19/>


Or create a zip file from the content of production folder and upload/deploy to AWS Elastic Beanstalk!


#### Developing Mode

To launch the application in developing mode please type, (need to be in root folder not productionServer)

```sh
npm start
```

For linting with eslint, please type

```sh
npm run lint
```