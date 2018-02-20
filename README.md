# Verified Locations for Smart Contracts

Verified locations for smart contracts is a proof-of-concept project.

## Deployment via Docker

1. Make sure you have docker. Install it if you don't have it already.

2. To get the project locally run:
```
git clone https://github.com/danieldimit/iosl-verified-locations-for-smart-contracts.git
```
4. Find the file `config.js` in backend and frontend and change the IPs listed there to correspond to the IP of docker on your machine. Most of the IP should be localhost, but on Windows docker is running on separate contaier and usually has IP 192.168.99.100. Because of that most of the IP in the frontend `config.js` file would have IP 192.168.99.100.

3. Finally start the project by running:
 ```
 docker-compose up --build
 ```

## Team

Daniel Dimitrov * Har Preet Singh * Piyasa Basak * Radoslav Vlaskovski * Sebastian Zickau * Victor Friedhelm
