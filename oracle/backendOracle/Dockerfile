FROM node:8.1

RUN mkdir -p /oracle/backendOracle
WORKDIR /oracle/backendOracle

COPY . /oracle/backendOracle

RUN npm install

# start app
CMD "node" index.js