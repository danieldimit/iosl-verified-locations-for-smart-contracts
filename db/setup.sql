CREATE TABLE logs(
   id SERIAL UNIQUE PRIMARY KEY NOT NULL,
   account_address TEXT,
   car_owner_address TEXT,
   renter_address TEXT,
   createdAt timestamp NOT NULL DEFAULT current_timestamp,
   updateAt timestamp NOT NULL DEFAULT current_timestamp
);