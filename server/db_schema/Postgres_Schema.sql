-- ENUM types
CREATE TYPE detailing_type_enum AS ENUM ('basic', 'advanced');
CREATE TYPE location_type_enum AS ENUM ('drop-off', 'customer-location');
CREATE TYPE booking_status_enum AS ENUM ('pending', 'confirmed', 'completed', 'canceled');
CREATE TYPE payment_method_enum AS ENUM ('credit_card', 'debit_card', 'paypal', 'stripe');
CREATE TYPE payment_status_enum AS ENUM ('pending', 'successful', 'failed');
CREATE TYPE estimation_status_enum AS ENUM ('pending', 'completed', 'failed');
CREATE TYPE estimation_method_enum AS ENUM ('realtime', 'overnight');

-- Create Tables
CREATE TABLE "Users" (
  "user_id" SERIAL PRIMARY KEY,
  "name" varchar,
  "email" varchar,
  "phone" varchar,
  "address" text,
  "created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Vehicles" (
  "vehicle_id" SERIAL PRIMARY KEY,
  "user_id" int,
  "vin_number" varchar,
  "make" varchar NOT NULL,
  "model" varchar NOT NULL,
  "year" int NOT NULL,
  "trim" varchar,
  "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_vehicle_model UNIQUE (make, model, year, trim)
);

CREATE TABLE "Services" (
  "service_id" SERIAL PRIMARY KEY,
  "category" varchar,
  "name" varchar,
  "description" text,
  "service_active" boolean DEFAULT true,
  "created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "PopupQuestions" (
  "question_id" SERIAL PRIMARY KEY,
  "service_id" int,
  "question_text" text NOT NULL,
  "question_order" int,
  "created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "PopupAnswers" (
  "answer_id" SERIAL PRIMARY KEY,
  "question_id" int,
  "answer_text" text NOT NULL,
  "is_option" boolean DEFAULT false,
  "answer_order" int,
  "created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "DetailingOptions" (
  "detailing_id" SERIAL PRIMARY KEY,
  "name" varchar,
  "description" text,
  "type" detailing_type_enum,
  "price" decimal,
  "created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "ServiceEstimates" (
  "estimate_id" SERIAL PRIMARY KEY,
  "service_id" int NOT NULL,
  "vehicle_id" int NOT NULL,
  "region" varchar DEFAULT 'Ontario, Canada',
  "estimation_status" estimation_status_enum DEFAULT 'pending',
  "estimation_method" estimation_method_enum,
  "manual_checked" boolean DEFAULT false,
  "labor_cost" decimal,
  "parts_cost" decimal,
  "total_price" decimal,
  "price_min" decimal,
  "price_max" decimal,
  "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_service_estimate UNIQUE (vehicle_id, service_id, region)
);

CREATE TABLE "EstimationLogs" (
  "log_id" SERIAL PRIMARY KEY,
  "vehicle_id" int NOT NULL,
  "service_id" int,
  "estimation_method" estimation_method_enum NOT NULL,
  "batch_number" int,
  "total_batches" int,
  "status" estimation_status_enum,
  "error_message" text,
  "retry_count" int DEFAULT 0,
  "created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
  "booking_id" SERIAL PRIMARY KEY,
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
  "created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Payments" (
  "payment_id" SERIAL PRIMARY KEY,
  "booking_id" int,
  "amount" decimal,
  "payment_method" payment_method_enum,
  "payment_status" payment_status_enum,
  "transaction_id" varchar,
  "created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Foreign Key Constraints
ALTER TABLE "Vehicles" ADD FOREIGN KEY ("user_id") REFERENCES "Users" ("user_id");
ALTER TABLE "Bookings" ADD FOREIGN KEY ("user_id") REFERENCES "Users" ("user_id");
ALTER TABLE "Bookings" ADD FOREIGN KEY ("vehicle_id") REFERENCES "Vehicles" ("vehicle_id");
ALTER TABLE "Bookings" ADD FOREIGN KEY ("service_id") REFERENCES "Services" ("service_id");
ALTER TABLE "Bookings" ADD FOREIGN KEY ("detailing_id") REFERENCES "DetailingOptions" ("detailing_id");
ALTER TABLE "Payments" ADD FOREIGN KEY ("booking_id") REFERENCES "Bookings" ("booking_id");
ALTER TABLE "ServiceEstimates" ADD FOREIGN KEY ("service_id") REFERENCES "Services" ("service_id");
ALTER TABLE "ServiceEstimates" ADD FOREIGN KEY ("vehicle_id") REFERENCES "Vehicles" ("vehicle_id");
ALTER TABLE "PopupQuestions" ADD FOREIGN KEY ("service_id") REFERENCES "Services" ("service_id");
ALTER TABLE "PopupAnswers" ADD FOREIGN KEY ("question_id") REFERENCES "PopupQuestions" ("question_id");
ALTER TABLE "EstimationLogs" ADD FOREIGN KEY ("vehicle_id") REFERENCES "Vehicles" ("vehicle_id");
ALTER TABLE "EstimationLogs" ADD FOREIGN KEY ("service_id") REFERENCES "Services" ("service_id");

-- Indexes
CREATE INDEX idx_services_category ON "Services" ("category");
CREATE INDEX idx_service_estimates_lookup ON "ServiceEstimates" ("service_id", "vehicle_id");
CREATE INDEX idx_service_estimates_region ON "ServiceEstimates" ("region");
CREATE INDEX idx_service_estimates_status ON "ServiceEstimates" ("estimation_status", "manual_checked");
CREATE INDEX idx_popup_questions_service ON "PopupQuestions" ("service_id");
CREATE INDEX idx_popup_answers_question ON "PopupAnswers" ("question_id");
CREATE INDEX idx_estimation_logs_vehicle ON "EstimationLogs" ("vehicle_id");
CREATE INDEX idx_estimation_logs_method ON "EstimationLogs" ("estimation_method", "created_at");
