# Project Showcase Application
This is a MERN stack application developed as a part of the CS546 Course (Web Programming 1) at the Stevens Institute of Technology.


## Features
- 

## How to setup locally

### Clone

Clone the repo to your local machine using `https://github.com/khatri7/cs546-group36-final-project.git`

### Setup

Install npm dependencies in both the `client` and `server` subdirectories and also the root directory using `npm install`

```shell
$ npm install
$ cd server && npm install
$ cd client && npm install
```

The root directory has been initialized as an npm project and installs [`concurrently`](https://www.npmjs.com/package/concurrently) as a dev dependency to start both the client and the server with a single command

Set up a MongoDB database either locally or online via <a href='https://www.mongodb.com/cloud/atlas'>MongoDB Atlas</a>

Create a `.env` file in both the `client` and `server` subdirectories as shown in the `.env.example` files

Set up the following environment variables

In `client/.env`:

```js
REACT_APP_SERVER_URL=http://localhost:3005/
```

In `server/.env`:

```js
MONGO_URL= //MongoDB database endpoint
MONGO_DATABASE= //name of the database
```

### Run

Finally, to run the code, from the root directory you can start the application using:

```shell
$ npm run dev
```
