-- CreateTable
CREATE TABLE "companies" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cuit" TEXT NOT NULL,
    "social_reason" TEXT,
    "social_number" INTEGER,
    "fantasy_name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "phone" TEXT,
    "contact_name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "professionals" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullname" TEXT NOT NULL,
    "tuition_number" TEXT NOT NULL,
    "signature_path" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "taxonomies" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "normalized_name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "categories" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "normalized_name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "category_items" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "category_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "normalized_name" TEXT NOT NULL,
    "law_reference" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "category_items_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "inspections" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "company_id" INTEGER NOT NULL,
    "professional_id" INTEGER NOT NULL,
    "area_id" INTEGER NOT NULL,
    "sector_id" INTEGER NOT NULL,
    "reason_id" INTEGER NOT NULL,
    "art" TEXT NOT NULL,
    "work_schedule" TEXT,
    "total_visits_count" INTEGER NOT NULL DEFAULT 0,
    "total_inspections_count" INTEGER NOT NULL DEFAULT 0,
    "current_employee_count" INTEGER,
    "observations" TEXT,
    "breach" TEXT,
    "signature_customer_path" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "inspections_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "inspections_professional_id_fkey" FOREIGN KEY ("professional_id") REFERENCES "professionals" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "inspections_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "taxonomies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "inspections_sector_id_fkey" FOREIGN KEY ("sector_id") REFERENCES "taxonomies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "inspections_reason_id_fkey" FOREIGN KEY ("reason_id") REFERENCES "taxonomies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "inspection_results" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "inspection_id" INTEGER NOT NULL,
    "category_item_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "item_snapshot" TEXT,
    CONSTRAINT "inspection_results_inspection_id_fkey" FOREIGN KEY ("inspection_id") REFERENCES "inspections" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "inspection_results_category_item_id_fkey" FOREIGN KEY ("category_item_id") REFERENCES "category_items" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "companies_cuit_key" ON "companies"("cuit");

-- CreateIndex
CREATE UNIQUE INDEX "companies_fantasy_name_key" ON "companies"("fantasy_name");

-- CreateIndex
CREATE UNIQUE INDEX "professionals_tuition_number_key" ON "professionals"("tuition_number");

-- CreateIndex
CREATE UNIQUE INDEX "taxonomies_normalized_name_key" ON "taxonomies"("normalized_name");

-- CreateIndex
CREATE UNIQUE INDEX "categories_normalized_name_key" ON "categories"("normalized_name");

-- CreateIndex
CREATE UNIQUE INDEX "category_items_normalized_name_key" ON "category_items"("normalized_name");
