#!/bin/bash

docker run --name postgis -p 5432:5432 -e POSTGRES_PASSWORD=password -d mdillon/postgis