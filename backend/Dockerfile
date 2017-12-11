FROM node:8.1

RUN mkdir -p /backend
WORKDIR /backend

COPY . /backend

RUN npm install

# start app
CMD ["npm", "start"]
