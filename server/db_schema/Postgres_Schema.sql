-- ENUM types
CREATE TYPE detailing_type_enum AS ENUM ('basic', 'advanced');
CREATE TYPE location_type_enum AS ENUM ('drop-off', 'customer-location');
CREATE TYPE booking_status_enum AS ENUM ('pending', 'confirmed', 'completed', 'canceled');
CREATE TYPE payment_method_enum AS ENUM ('credit_card', 'debit_card', 'paypal', 'stripe');
CREATE TYPE payment_status_enum AS ENUM ('pending', 'successful', 'failed');
CREATE TYPE service_difficulty_enum AS ENUM ('easy', 'medium', 'hard');

-- Create Tables
CREATE TABLE "Users" (
  "user_id" int PRIMARY KEY,
  "name" varchar,
  "email" varchar,
  "phone" varchar,
  "address" text,
  "created_at" timestamp
);

CREATE TABLE "Vehicles" (
  "vehicle_id" int PRIMARY KEY,
  "user_id" int,
  "vin_number" varchar,
  "make" varchar,
  "model" varchar,
  "year" int,
  "created_at" timestamp
);

CREATE TABLE "Services" (
  "service_id" varchar(30) PRIMARY KEY,
  "category" varchar,
  "name" varchar,
  "estimated_time" int4range,
  "tools_required" text,
  "difficulty" service_difficulty_enum,
  "avg_cost" numrange,
  "description" text,
  "created_at" timestamp
);

CREATE TABLE "DetailingOptions" (
  "detailing_id" int PRIMARY KEY,
  "name" varchar,
  "description" text,
  "type" detailing_type_enum,
  "price" decimal,
  "created_at" timestamp
);

CREATE TABLE "Bookings" (
  "booking_id" int PRIMARY KEY,
  "user_id" int,
  "vehicle_id" int,
  "service_id" int,
  "detailing_id" int,
  "location_type" location_type_enum,
  "travel_km" int,
  "water_supply" boolean,
  "electric_supply" boolean,
  "booking_date" date,
  "time_slot" time,
  "total_price" decimal,
  "status" booking_status_enum,
  "created_at" timestamp
);

CREATE TABLE "Payments" (
  "payment_id" int PRIMARY KEY,
  "booking_id" int,
  "amount" decimal,
  "payment_method" payment_method_enum,
  "payment_status" payment_status_enum,
  "transaction_id" varchar,
  "created_at" timestamp
);

-- Foreign Key Constraints
ALTER TABLE "Vehicles" ADD FOREIGN KEY ("user_id") REFERENCES "Users" ("user_id");
ALTER TABLE "Bookings" ADD FOREIGN KEY ("user_id") REFERENCES "Users" ("user_id");
ALTER TABLE "Bookings" ADD FOREIGN KEY ("vehicle_id") REFERENCES "Vehicles" ("vehicle_id");
ALTER TABLE "Bookings" ADD FOREIGN KEY ("service_id") REFERENCES "Services" ("service_id");
ALTER TABLE "Bookings" ADD FOREIGN KEY ("detailing_id") REFERENCES "DetailingOptions" ("detailing_id");
ALTER TABLE "Payments" ADD FOREIGN KEY ("booking_id") REFERENCES "Bookings" ("booking_id");

-- Indexes
CREATE INDEX idx_services_category ON "Services" ("category");
