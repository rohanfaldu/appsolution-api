-- Remove JSON columns from users
ALTER TABLE "users" DROP COLUMN IF EXISTS "cart";
ALTER TABLE "users" DROP COLUMN IF EXISTS "favorites";

-- CreateEnum
DO $$ BEGIN
  CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED', 'REFUNDED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- carts
CREATE TABLE IF NOT EXISTS "carts" (
  "id"        TEXT NOT NULL,
  "userId"    TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "carts_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "carts_userId_key" ON "carts"("userId");
ALTER TABLE "carts" ADD CONSTRAINT "carts_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- cart_items
CREATE TABLE IF NOT EXISTS "cart_items" (
  "id"        TEXT NOT NULL,
  "cartId"    TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "quantity"  INTEGER NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "cart_items_cartId_productId_key" ON "cart_items"("cartId", "productId");
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cartId_fkey"
  FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- favorites
DROP TABLE IF EXISTS "favorite_items";
CREATE TABLE IF NOT EXISTS "favorites" (
  "id"        TEXT NOT NULL,
  "userId"    TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "favorites_userId_productId_key" ON "favorites"("userId", "productId");
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- orders
CREATE TABLE IF NOT EXISTS "orders" (
  "id"        TEXT NOT NULL,
  "userId"    TEXT NOT NULL,
  "status"    "OrderStatus" NOT NULL DEFAULT 'PENDING',
  "total"     DECIMAL(10,2) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- order_items
CREATE TABLE IF NOT EXISTS "order_items" (
  "id"        TEXT NOT NULL,
  "orderId"   TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "price"     DECIMAL(10,2) NOT NULL,
  "quantity"  INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_fkey"
  FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- payments
CREATE TABLE IF NOT EXISTS "payments" (
  "id"            TEXT NOT NULL,
  "orderId"       TEXT NOT NULL,
  "transactionId" TEXT NOT NULL,
  "amount"        DECIMAL(10,2) NOT NULL,
  "method"        TEXT NOT NULL DEFAULT 'PayPal',
  "status"        "PaymentStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "payments_orderId_key" ON "payments"("orderId");
CREATE UNIQUE INDEX IF NOT EXISTS "payments_transactionId_key" ON "payments"("transactionId");
ALTER TABLE "payments" ADD CONSTRAINT "payments_orderId_fkey"
  FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
