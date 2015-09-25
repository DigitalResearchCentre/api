#!/bin/bash

npm start &
cd client
node index.js &

trap "kill -TERM -$$" SIGINT
wait




# install dependencies:
# $ cd tc && npm install

# run the app:
# $ DEBUG=tc:* npm start
