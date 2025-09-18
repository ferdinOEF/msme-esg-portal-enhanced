-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'CONSULTANT', 'CLIENT');

-- CreateEnum
CREATE TYPE "SchemeType" AS ENUM ('SCHEME', 'CERTIFICATION', 'FRAMEWORK', 'SUBSIDY', 'INCENTIVE');

-- CreateEnum
CREATE TYPE "Jurisdiction" AS ENUM ('CENTRAL', 'STATE', 'INTERNATIONAL', 'CPCB', 'NGT', 'SECTOR_SPECIFIC');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('INTERESTED', 'APPLIED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED', 'ON_HOLD');

-- CreateEnum
CREATE TYPE "LinkRelation" AS ENUM ('SUPPORTS', 'REQUIRES', 'UNLOCKS', 'CONFLICTS_WITH', 'SIMILAR_TO');

-- CreateEnum
CREATE TYPE "TemplateCategory" AS ENUM ('CHECKLIST', 'AUDIT', 'POLICY', 'REPORT', 'FORM', 'GUIDELINE');

-- CreateEnum
CREATE TYPE "CompanySize" AS ENUM ('MICRO', 'SMALL', 'MEDIUM', 'LARGE');

-- CreateEnum
CREATE TYPE "PlanStatus" AS ENUM ('DRAFT', 'ACTIVE', 'COMPLETED', 'ON_HOLD', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ESGPillar" AS ENUM ('ENVIRONMENTAL', 'SOCIAL', 'GOVERNANCE', 'QUALITY');

-- CreateEnum
CREATE TYPE "ItemStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AuditType" AS ENUM ('ENVIRONMENTAL', 'SOCIAL', 'GOVERNANCE', 'COMPLIANCE', 'INTEGRATED');

-- CreateEnum
CREATE TYPE "AuditStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'REVIEWED');

-- Drop existing tables to recreate with new schema
DROP TABLE IF EXISTS "File" CASCADE;
DROP TABLE IF EXISTS "Link" CASCADE;
DROP TABLE IF EXISTS "Template" CASCADE;
DROP TABLE IF EXISTS "LegalDoc" CASCADE;
DROP TABLE IF EXISTS "Scheme" CASCADE;

-- Drop existing enums if they exist
DROP TYPE IF EXISTS "FileType" CASCADE;
DROP TYPE IF EXISTS "FileStatus" CASCADE;

-- Recreate FileType and FileStatus enums
CREATE TYPE "FileType" AS ENUM ('CIRCULAR', 'FAQ', 'GUIDELINE', 'FORM', 'SUPPORTING', 'AUDIT_REPORT', 'CERTIFICATE', 'OTHER');
CREATE TYPE "FileStatus" AS ENUM ('UPLOADED', 'PENDING', 'PROCESSING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" "Role" NOT NULL DEFAULT 'CONSULTANT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "icon" TEXT,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scheme" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortCode" TEXT,
    "type" "SchemeType" NOT NULL,
    "categoryId" TEXT,
    "authority" TEXT,
    "jurisdiction" "Jurisdiction" NOT NULL DEFAULT 'CENTRAL',
    "pillar" TEXT,
    "tags" TEXT NOT NULL,
    "description" TEXT,
    "benefits" TEXT,
    "eligibility" TEXT,
    "documentsUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Scheme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserScheme" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "schemeId" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'INTERESTED',
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "appliedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserScheme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LegalDoc" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "jurisdiction" "Jurisdiction" NOT NULL,
    "sector" TEXT,
    "locationTag" TEXT,
    "summary" TEXT,
    "url" TEXT,
    "tags" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "effectiveDate" TIMESTAMP(3),
    "expiryDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LegalDoc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "TemplateCategory" NOT NULL,
    "contentMd" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "downloadUrl" TEXT,
    "version" TEXT NOT NULL DEFAULT '1.0',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "schemeId" TEXT,
    "name" TEXT NOT NULL,
    "originalName" TEXT,
    "url" TEXT,
    "storageKey" TEXT,
    "type" "FileType" NOT NULL DEFAULT 'OTHER',
    "status" "FileStatus" NOT NULL DEFAULT 'PENDING',
    "mimeType" TEXT,
    "sizeBytes" INTEGER,
    "uploadedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Link" (
    "id" TEXT NOT NULL,
    "fromId" TEXT NOT NULL,
    "toId" TEXT NOT NULL,
    "relation" "LinkRelation" NOT NULL,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ESGPlan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "userId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "size" "CompanySize" NOT NULL,
    "state" TEXT NOT NULL,
    "udyamNumber" TEXT,
    "turnoverCr" DOUBLE PRECISION,
    "status" "PlanStatus" NOT NULL DEFAULT 'DRAFT',
    "targetDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ESGPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ESGPlanItem" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "schemeId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "pillar" "ESGPillar" NOT NULL,
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "status" "ItemStatus" NOT NULL DEFAULT 'PENDING',
    "dueDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "notes" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ESGPlanItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditRecord" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "auditType" "AuditType" NOT NULL,
    "findings" TEXT,
    "score" DOUBLE PRECISION,
    "maxScore" DOUBLE PRECISION,
    "status" "AuditStatus" NOT NULL DEFAULT 'DRAFT',
    "auditDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuditRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Scheme_name_key" ON "Scheme"("name");

-- CreateIndex
CREATE INDEX "Scheme_type_jurisdiction_idx" ON "Scheme"("type", "jurisdiction");

-- CreateIndex
CREATE INDEX "Scheme_isActive_idx" ON "Scheme"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "UserScheme_userId_schemeId_key" ON "UserScheme"("userId", "schemeId");

-- CreateIndex
CREATE UNIQUE INDEX "LegalDoc_title_key" ON "LegalDoc"("title");

-- CreateIndex
CREATE INDEX "LegalDoc_jurisdiction_isActive_idx" ON "LegalDoc"("jurisdiction", "isActive");

-- CreateIndex
CREATE INDEX "LegalDoc_effectiveDate_expiryDate_idx" ON "LegalDoc"("effectiveDate", "expiryDate");

-- CreateIndex
CREATE UNIQUE INDEX "Template_title_key" ON "Template"("title");

-- CreateIndex
CREATE INDEX "Template_category_isActive_idx" ON "Template"("category", "isActive");

-- CreateIndex
CREATE INDEX "File_schemeId_status_idx" ON "File"("schemeId", "status");

-- CreateIndex
CREATE INDEX "File_type_status_idx" ON "File"("type", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Link_fromId_toId_relation_key" ON "Link"("fromId", "toId", "relation");

-- CreateIndex
CREATE INDEX "ESGPlan_userId_status_idx" ON "ESGPlan"("userId", "status");

-- CreateIndex
CREATE INDEX "ESGPlanItem_planId_status_idx" ON "ESGPlanItem"("planId", "status");

-- CreateIndex
CREATE INDEX "ESGPlanItem_pillar_priority_idx" ON "ESGPlanItem"("pillar", "priority");

-- CreateIndex
CREATE INDEX "AuditRecord_userId_auditType_idx" ON "AuditRecord"("userId", "auditType");

-- CreateIndex
CREATE INDEX "AuditRecord_auditDate_idx" ON "AuditRecord"("auditDate");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scheme" ADD CONSTRAINT "Scheme_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserScheme" ADD CONSTRAINT "UserScheme_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserScheme" ADD CONSTRAINT "UserScheme_schemeId_fkey" FOREIGN KEY ("schemeId") REFERENCES "Scheme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_schemeId_fkey" FOREIGN KEY ("schemeId") REFERENCES "Scheme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "Scheme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_toId_fkey" FOREIGN KEY ("toId") REFERENCES "Scheme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ESGPlan" ADD CONSTRAINT "ESGPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ESGPlanItem" ADD CONSTRAINT "ESGPlanItem_planId_fkey" FOREIGN KEY ("planId") REFERENCES "ESGPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ESGPlanItem" ADD CONSTRAINT "ESGPlanItem_schemeId_fkey" FOREIGN KEY ("schemeId") REFERENCES "Scheme"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditRecord" ADD CONSTRAINT "AuditRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;