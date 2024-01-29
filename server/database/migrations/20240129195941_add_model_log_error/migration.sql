-- CreateTable
CREATE TABLE "log_error" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "stack" TEXT NOT NULL DEFAULT '',
    "causes" JSONB[] DEFAULT ARRAY[]::JSONB[],
    "date_time" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "log_error_pkey" PRIMARY KEY ("id")
);
