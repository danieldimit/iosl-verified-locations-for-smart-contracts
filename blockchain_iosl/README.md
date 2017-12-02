# Backend

## Description

Blockchain Project for ISOL.

**Get all available testrpc accounts**
----
  Returns json array about available accounts on testrpc.

* **URL**

  * `/`

* **Method:**

  * `GET`

* **Success Response:**

   * **Content:** `["0x95c6296220947fbe84b2deb44d2b760ed62b13da",
    "0x095e205ca33dac67ab53f36c2740a617e95d3dde",
    "0xc33e49f8533cec7f7370a12d45a4c64d63799718",
    "0x9f06b701b4f098b3ac76900507665ef49d09b804",
    "0x5bc45bdb86038bbcc67fc32a824fef3c64bbae7d",
    "0x882603ab7b7d03c1f939b02b840cb70c27805ed9",
    "0xbc35aca0403ab3bbca09d8dbdea15065f0f78591",
    "0x4c8573602c0f8631aa3c0154b65ffc4594a3241b",
    "0xcc56404da487e3c3628769cfcef758e01a8875db",
    "0xf5405d6f853501a770b8bd284f1018f5abc8709e"]`

* **Sample Call:**

  * `/`


## Usage
1.Make sure you have docker install run this command `docker-compose up`

2.To rebuild the container run `docker-compose up --build`

3.In case testrpc is not connected the look for the container ip of testrpc `docker inspect CONTAINER_ID | grep "IPAddress"`

4.you can check all containers `docker ps -a`

5.Change the entry ETHEREUM_CLIENT_IP in docker-compose.yml to your Docker IP (ip testrpc is running on)

6.Access Expose on `http://localhost:4000/`

## Team
  *Har Preet
  *Daneil
  *David
  *Dirk
  *Friedhelm
  *Piyasa
  *Rvl
  *Sebastian