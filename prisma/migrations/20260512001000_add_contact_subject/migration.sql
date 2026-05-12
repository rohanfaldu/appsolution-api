DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ContactStatus') THEN
    CREATE TYPE "ContactStatus" AS ENUM ('UNREAD', 'READ', 'REPLIED');
  END IF;
END
$$;

CREATE TABLE IF NOT EXISTS "contacts" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "subject" TEXT,
  "message" TEXT NOT NULL,
  "captcha" TEXT,
  "status" "ContactStatus" NOT NULL DEFAULT 'UNREAD',
  "ipAddress" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "contacts" ADD COLUMN IF NOT EXISTS "subject" TEXT;

CREATE INDEX IF NOT EXISTS "contacts_status_idx" ON "contacts"("status");
CREATE INDEX IF NOT EXISTS "contacts_createdAt_idx" ON "contacts"("createdAt");
