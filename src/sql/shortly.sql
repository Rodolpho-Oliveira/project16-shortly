CREATE TABLE "users" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL
)

CREATE TABLE "urls" (
    "id" SERIAL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "shortUrl" TEXT NOT NULL UNIQUE,
    "visitCount" INTEGER DEFAULT 0,
    "userId" SERIAL NOT NULL REFERENCES "users"("id")
)

CREATE TABLE "sessions" (
    "id" SERIAL PRIMARY KEY,
    "token" TEXT UNIQUE NOT NULL,
    "userId" INTEGER  NOT NULL REFERENCES "users"("id")
)