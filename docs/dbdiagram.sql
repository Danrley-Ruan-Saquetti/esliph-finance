# https://dbdiagram.io
# Docs: https://dbml.dbdiagram.io/docs
# https://dbdiagram.io/d/portal-finance-656716f83be1495787f68936

CREATE TABLE "account" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "name" TEXT NOT NULL,
  "email" TEXT UNIQUE NOT NULL,
  "password" TEXT NOT NULL,
  "balance" REAL DEFAULT 0,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "notification" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "account_id" INTEGER NOT NULL,
  "subject" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "was_read" INTEGER DEFAULT 0,
  "type" TEXT NOT NULL,
  "is_send" INTEGER DEFAULT 0,
  "send_at" TIMESTAMP,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("account_id") REFERENCES "account" ("id")
);

CREATE TABLE "mail" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "notification_id" INTEGER NOT NULL,
  "recipient" TEXT NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("notification_id") REFERENCES "notification" ("id")
);

CREATE TABLE "category" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "account_id" INTEGER NOT NULL,
  "name" TEXT NOT NULL,
  "color" TEXT NOT NULL,
  "is_favorite" INTEGER DEFAULT 0,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("account_id") REFERENCES "account" ("id")
);

CREATE TABLE "financial_transaction" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "account_id" INTEGER NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "value" REAL NOT NULL,
  "priority" INTEGER,
  "is_observable" INTEGER DEFAULT 0,
  "is_send_notification" INTEGER DEFAULT 0,
  "times_to_repeat" INTEGER DEFAULT 0,
  "count_repeated_occurrences" INTEGER DEFAULT 0,
  "type" TEXT NOT NULL,
  "receiver" TEXT,
  "sender" TEXT,
  "type_occurrence" TEXT DEFAULT 'Single',
  "situation" TEXT DEFAULT 'Pending',
  "expires_in" TIMESTAMP NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("account_id") REFERENCES "account" ("id")
);

CREATE TABLE "note" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "financial_transaction_id" INTEGER NOT NULL,
  "description" TEXT,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("financial_transaction_id") REFERENCES "financial_transaction" ("id")
);

CREATE TABLE "payment" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "financial_transaction_id" INTEGER NOT NULL,
  "value" REAL NOT NULL,
  "discount" REAL DEFAULT 0,
  "increase" REAL DEFAULT 0,
  "paid_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("financial_transaction_id") REFERENCES "financial_transaction" ("id")
);

CREATE TABLE "media" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "financial_transaction_id" INTEGER NOT NULL,
  "name" TEXT,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("financial_transaction_id") REFERENCES "financial_transaction" ("id")
);

CREATE TABLE "financial_transaction_category" (
  "financial_transaction_id" INTEGER,
  "category_id" INTEGER,
  PRIMARY KEY ("financial_transaction_id", "category_id"),
  FOREIGN KEY ("financial_transaction_id") REFERENCES "financial_transaction" ("id"),
  FOREIGN KEY ("category_id") REFERENCES "category" ("id")
);
