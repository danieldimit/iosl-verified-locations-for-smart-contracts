FROM node:8.1

RUN mkdir -p /backend
WORKDIR /backend
ENV public_port 4000
COPY . /backend
RUN npm install

# start app
CMD ["npm", "start"]
