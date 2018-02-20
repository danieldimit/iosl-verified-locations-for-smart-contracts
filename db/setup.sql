CREATE TABLE accounts(
   id SERIAL UNIQUE PRIMARY KEY NOT NULL,
   account_address TEXT,
   car_owner_address TEXT,
   renter_address TEXT,
   createdAt timestamp NOT NULL DEFAULT current_timestamp,
   updateAt timestamp NOT NULL DEFAULT current_timestamp
);

CREATE TABLE cars(
   id SERIAL UNIQUE PRIMARY KEY NOT NULL,
   account_address TEXT,
   car_address TEXT,
   carGSMNum TEXT,
   position TEXT,
   geofence TEXT,
   createdAt timestamp NOT NULL DEFAULT current_timestamp,
   updateAt timestamp NOT NULL DEFAULT current_timestamp
);

CREATE TABLE locations(
   id SERIAL UNIQUE PRIMARY KEY NOT NULL,
   location_title TEXT,
   location_string TEXT,
   createdAt timestamp NOT NULL DEFAULT current_timestamp,
   updateAt timestamp NOT NULL DEFAULT current_timestamp
);