-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'CONSULTANT', 'VIEWER');

-- CreateEnum
CREATE TYPE "CompanySize" AS ENUM ('MICRO', 'SMALL', 'MEDIUM', 'LARGE');

-- CreateEnum
CREATE TYPE "SchemeType" AS ENUM ('SCHEME', 'CERTIFICATION', 'FRAMEWORK', 'SUBSIDY', 'GRANT', 'LOAN', 'INCENTIVE');

-- CreateEnum
CREATE TYPE "LinkRelation" AS ENUM ('PREREQUISITE', 'SUPPORTS', 'UNLOCKS', 'CONFLICTS', 'ALTERNATIVE', 'COMPLEMENT');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('REGULATION', 'GUIDELINE', 'NOTIFICATION', 'CIRCULAR', 'AMENDMENT', 'JUDGMENT');

-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "TemplateCategory" AS ENUM ('CHECKLIST', 'POLICY', 'FORM', 'REPORT', 'AUDIT', 'PROCEDURE');

-- CreateEnum
CREATE TYPE "FileCategory" AS ENUM ('DOCUMENT', 'CIRCULAR', 'FAQ', 'FORM', 'CHECKLIST', 'REPORT', 'CERTIFICATE');

-- CreateEnum
CREATE TYPE "FileStatus" AS ENUM ('ACTIVE', 'ARCHIVED', 'DELETED');

-- CreateEnum
CREATE TYPE "PlanStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ItemStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('INTERESTED', 'APPLIED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'COMPLETED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'CONSULTANT',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "organization" TEXT,
    "phone" TEXT,
    "expertise" TEXT[],

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "udyamNumber" TEXT,
    "sector" TEXT NOT NULL,
    "size" "CompanySize" NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT,
    "address" TEXT,
    "turnoverCr" DECIMAL(65,30),
    "employees" INTEGER,
    "contactPerson" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "complianceStatus" JSONB,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schemes" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "shortCode" TEXT,
    "type" "SchemeType" NOT NULL,
    "authority" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "benefits" TEXT,
    "eligibility" TEXT,
    "documentsUrl" TEXT,
    "jurisdiction" TEXT NOT NULL DEFAULT 'Central',
    "sector" TEXT[],
    "companySize" "CompanySize"[],
    "pillarE" BOOLEAN NOT NULL DEFAULT false,
    "pillarS" BOOLEAN NOT NULL DEFAULT false,
    "pillarG" BOOLEAN NOT NULL DEFAULT false,
    "applicationDeadline" TIMESTAMP(3),
    "processingDays" INTEGER,
    "applicationFee" DECIMAL(65,30),
    "maxBenefitAmount" DECIMAL(65,30),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "validFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validTo" TIMESTAMP(3),
    "priority" INTEGER NOT NULL DEFAULT 0,
    "popularity" INTEGER NOT NULL DEFAULT 0,
    "createdBy" TEXT,

    CONSTRAINT "schemes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scheme_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "scheme_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scheme_tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "scheme_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scheme_links" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fromId" TEXT NOT NULL,
    "toId" TEXT NOT NULL,
    "relation" "LinkRelation" NOT NULL,
    "notes" TEXT,

    CONSTRAINT "scheme_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "legal_docs" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "jurisdiction" TEXT NOT NULL,
    "sector" TEXT,
    "locationTag" TEXT,
    "summary" TEXT,
    "url" TEXT,
    "documentType" "DocumentType" NOT NULL DEFAULT 'GUIDELINE',
    "severity" "Severity" NOT NULL DEFAULT 'MEDIUM',
    "effectiveFrom" TIMESTAMP(3),
    "lastUpdated" TIMESTAMP(3),
    "pillarE" BOOLEAN NOT NULL DEFAULT false,
    "pillarS" BOOLEAN NOT NULL DEFAULT false,
    "pillarG" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "legal_docs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "templates" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "category" "TemplateCategory" NOT NULL,
    "description" TEXT,
    "contentMd" TEXT NOT NULL,
    "downloadUrl" TEXT,
    "version" TEXT NOT NULL DEFAULT '1.0',
    "isLatest" BOOLEAN NOT NULL DEFAULT true,
    "parentId" TEXT,
    "tags" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "files" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mimeType" TEXT,
    "size" INTEGER,
    "category" "FileCategory" NOT NULL DEFAULT 'DOCUMENT',
    "description" TEXT,
    "schemeId" TEXT,
    "uploadedBy" TEXT,
    "status" "FileStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "esg_plans" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "companyId" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "assignedTo" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "targetDate" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "status" "PlanStatus" NOT NULL DEFAULT 'DRAFT',
    "progress" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "esg_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "esg_plan_items" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "planId" TEXT NOT NULL,
    "schemeId" TEXT,
    "dueDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "status" "ItemStatus" NOT NULL DEFAULT 'PENDING',
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "esg_plan_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_favorites" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "schemeId" TEXT NOT NULL,

    CONSTRAINT "user_favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_applications" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "schemeId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'INTERESTED',
    "appliedAt" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "user_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "oldValues" JSONB,
    "newValues" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SchemeToSchemeTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_SchemeToSchemeCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "companies_udyamNumber_key" ON "companies"("udyamNumber");

-- CreateIndex
CREATE UNIQUE INDEX "schemes_name_key" ON "schemes"("name");

-- CreateIndex
CREATE INDEX "schemes_type_jurisdiction_idx" ON "schemes"("type", "jurisdiction");

-- CreateIndex
CREATE INDEX "schemes_pillarE_pillarS_pillarG_idx" ON "schemes"("pillarE", "pillarS", "pillarG");

-- CreateIndex
CREATE INDEX "schemes_isActive_validFrom_validTo_idx" ON "schemes"("isActive", "validFrom", "validTo");

-- CreateIndex
CREATE UNIQUE INDEX "scheme_categories_name_key" ON "scheme_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "scheme_tags_name_key" ON "scheme_tags"("name");

-- CreateIndex
CREATE INDEX "scheme_links_fromId_idx" ON "scheme_links"("fromId");

-- CreateIndex
CREATE INDEX "scheme_links_toId_idx" ON "scheme_links"("toId");

-- CreateIndex
CREATE UNIQUE INDEX "scheme_links_fromId_toId_relation_key" ON "scheme_links"("fromId", "toId", "relation");

-- CreateIndex
CREATE UNIQUE INDEX "legal_docs_title_key" ON "legal_docs"("title");

-- CreateIndex
CREATE INDEX "legal_docs_jurisdiction_sector_idx" ON "legal_docs"("jurisdiction", "sector");

-- CreateIndex
CREATE INDEX "legal_docs_pillarE_pillarS_pillarG_idx" ON "legal_docs"("pillarE", "pillarS", "pillarG");

-- CreateIndex
CREATE UNIQUE INDEX "templates_title_key" ON "templates"("title");

-- CreateIndex
CREATE INDEX "files_schemeId_idx" ON "files"("schemeId");

-- CreateIndex
CREATE INDEX "files_category_status_idx" ON "files"("category", "status");

-- CreateIndex
CREATE INDEX "esg_plans_companyId_status_idx" ON "esg_plans"("companyId", "status");

-- CreateIndex
CREATE INDEX "esg_plan_items_planId_status_idx" ON "esg_plan_items"("planId", "status");

-- CreateIndex
CREATE INDEX "esg_plan_items_dueDate_idx" ON "esg_plan_items"("dueDate");

-- CreateIndex
CREATE UNIQUE INDEX "user_favorites_userId_schemeId_key" ON "user_favorites"("userId", "schemeId");

-- CreateIndex
CREATE INDEX "user_applications_status_idx" ON "user_applications"("status");

-- CreateIndex
CREATE UNIQUE INDEX "user_applications_userId_schemeId_companyId_key" ON "user_applications"("userId", "schemeId", "companyId");

-- CreateIndex
CREATE INDEX "audit_logs_userId_createdAt_idx" ON "audit_logs"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_entity_entityId_idx" ON "audit_logs"("entity", "entityId");

-- CreateIndex
CREATE UNIQUE INDEX "_SchemeToSchemeTag_AB_unique" ON "_SchemeToSchemeTag"("A", "B");

-- CreateIndex
CREATE INDEX "_SchemeToSchemeTag_B_index" ON "_SchemeToSchemeTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SchemeToSchemeCategory_AB_unique" ON "_SchemeToSchemeCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_SchemeToSchemeCategory_B_index" ON "_SchemeToSchemeCategory"("B");

-- AddForeignKey
ALTER TABLE "schemes" ADD CONSTRAINT "schemes_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheme_links" ADD CONSTRAINT "scheme_links_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "schemes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheme_links" ADD CONSTRAINT "scheme_links_toId_fkey" FOREIGN KEY ("toId") REFERENCES "schemes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_schemeId_fkey" FOREIGN KEY ("schemeId") REFERENCES "schemes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "esg_plans" ADD CONSTRAINT "esg_plans_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "esg_plans" ADD CONSTRAINT "esg_plans_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "esg_plans" ADD CONSTRAINT "esg_plans_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "esg_plan_items" ADD CONSTRAINT "esg_plan_items_planId_fkey" FOREIGN KEY ("planId") REFERENCES "esg_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "esg_plan_items" ADD CONSTRAINT "esg_plan_items_schemeId_fkey" FOREIGN KEY ("schemeId") REFERENCES "schemes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_favorites" ADD CONSTRAINT "user_favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_favorites" ADD CONSTRAINT "user_favorites_schemeId_fkey" FOREIGN KEY ("schemeId") REFERENCES "schemes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_applications" ADD CONSTRAINT "user_applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_applications" ADD CONSTRAINT "user_applications_schemeId_fkey" FOREIGN KEY ("schemeId") REFERENCES "schemes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_applications" ADD CONSTRAINT "user_applications_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SchemeToSchemeTag" ADD CONSTRAINT "_SchemeToSchemeTag_A_fkey" FOREIGN KEY ("A") REFERENCES "schemes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SchemeToSchemeTag" ADD CONSTRAINT "_SchemeToSchemeTag_B_fkey" FOREIGN KEY ("B") REFERENCES "scheme_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SchemeToSchemeCategory" ADD CONSTRAINT "_SchemeToSchemeCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "schemes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SchemeToSchemeCategory" ADD CONSTRAINT "_SchemeToSchemeCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "scheme_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
