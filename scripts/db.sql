-- Script to create the database schema for Shortly application
-- This script will create the necessary tables and relationships

DROP TABLE IF EXISTS "urls";
DROP TABLE IF EXISTS "users";

CREATE TABLE "users" (
	"id" SERIAL PRIMARY KEY,
	"name" TEXT NOT NULL,
	"email" TEXT NOT NULL UNIQUE,
	"password" TEXT NOT NULL,
	"createdAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE "urls" (
	"id" SERIAL PRIMARY KEY,
	"url" TEXT NOT NULL,
	"shortUrl" TEXT NOT NULL UNIQUE,
	"visitCount" INTEGER NOT NULL DEFAULT 0,
	"userId" INTEGER NOT NULL,
	"createdAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),

	CONSTRAINT "fk_urls_users"
		FOREIGN KEY ("userId")
		REFERENCES "users"("id")
		ON DELETE CASCADE
);