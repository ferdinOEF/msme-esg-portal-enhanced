import { prisma } from './db'
import type { 
  SchemeFilters, 
  LegalDocFilters, 
  SchemeWithRelations,
  PaginatedResponse,
  DashboardStats
} from './types'
import { Prisma } from '@prisma/client'

// Scheme utilities
export async function getSchemes(
  filters: SchemeFilters = {},
  page = 1,
  limit = 20,
  userId?: string
) {
  const where: Prisma.SchemeWhereInput = {
    isActive: filters.isActive ?? true,
  }

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
      { tags: { contains: filters.search, mode: 'insensitive' } },
      { shortCode: { contains: filters.search, mode: 'insensitive' } },
    ]
  }

  if (filters.type?.length) {
    where.type = { in: filters.type }
  }

  if (filters.jurisdiction?.length) {
    where.jurisdiction = { in: filters.jurisdiction }
  }

  if (filters.pillar?.length) {
    where.OR = filters.pillar.map(pillar => ({
      pillar: { contains: pillar, mode: 'insensitive' }
    }))
  }

  if (filters.category?.length) {
    where.categoryId = { in: filters.category }
  }

  if (filters.priority?.length) {
    where.priority = { in: filters.priority }
  }

  const [schemes, total] = await Promise.all([
    prisma.scheme.findMany({
      where,
      include: {
        category: true,
        files: {
          where: { status: 'UPLOADED' },
          select: { id: true, name: true, type: true, url: true }
        },
        userSchemes: userId ? {
          where: { userId },
          select: { status: true, isFavorite: true, appliedAt: true, completedAt: true }
        } : false,
        _count: {
          select: { files: true, userSchemes: true }
        }
      },
      orderBy: [
        { priority: 'desc' },
        { updatedAt: 'desc' }
      ],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.scheme.count({ where })
  ])

  return {
    items: schemes,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  }
}

export async function getSchemeById(id: string, userId?: string): Promise<SchemeWithRelations | null> {
  return prisma.scheme.findUnique({
    where: { id },
    include: {
      category: true,
      files: {
        where: { status: 'UPLOADED' },
        include: { uploadedBy: { select: { name: true, email: true } } }
      },
      userSchemes: userId ? {
        where: { userId },
        select: { status: true, isFavorite: true, notes: true, appliedAt: true, completedAt: true }
      } : false,
      linksFrom: {
        include: { to: { select: { id: true, name: true, shortCode: true } } }
      },
      linksTo: {
        include: { from: { select: { id: true, name: true, shortCode: true } } }
      }
    }
  })
}

// Legal document utilities
export async function getLegalDocs(
  filters: LegalDocFilters = {},
  page = 1,
  limit = 20
) {
  const where: Prisma.LegalDocWhereInput = {
    isActive: filters.isActive ?? true,
  }

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { summary: { contains: filters.search, mode: 'insensitive' } },
      { tags: { contains: filters.search, mode: 'insensitive' } },
    ]
  }

  if (filters.jurisdiction?.length) {
    where.jurisdiction = { in: filters.jurisdiction }
  }

  if (filters.sector?.length) {
    where.sector = { in: filters.sector }
  }

  if (filters.locationTag?.length) {
    where.locationTag = { in: filters.locationTag }
  }

  const [docs, total] = await Promise.all([
    prisma.legalDoc.findMany({
      where,
      orderBy: [
        { priority: 'desc' },
        { effectiveDate: 'desc' },
        { createdAt: 'desc' }
      ],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.legalDoc.count({ where })
  ])

  return {
    items: docs,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  }
}

// Category utilities
export async function getCategories() {
  return prisma.category.findMany({
    include: {
      children: true,
      _count: { select: { schemes: true } }
    },
    orderBy: { name: 'asc' }
  })
}

// Dashboard utilities
export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const [
    totalSchemes,
    activeSchemes,
    userStats,
    activePlans,
    pendingAudits,
    recentActivity
  ] = await Promise.all([
    prisma.scheme.count(),
    prisma.scheme.count({ where: { isActive: true } }),
    prisma.userScheme.groupBy({
      by: ['status'],
      where: { userId },
      _count: { status: true }
    }),
    prisma.eSGPlan.count({
      where: { userId, status: 'ACTIVE' }
    }),
    prisma.auditRecord.count({
      where: { userId, status: { in: ['DRAFT', 'SCHEDULED'] } }
    }),
    // Recent activity - simplified for now
    prisma.userScheme.findMany({
      where: { userId },
      include: { scheme: { select: { name: true } } },
      orderBy: { updatedAt: 'desc' },
      take: 10
    })
  ])

  const userFavorites = userStats.find(s => s.status === 'INTERESTED')?._count.status || 0
  const appliedSchemes = userStats.find(s => s.status === 'APPLIED')?._count.status || 0
  const completedSchemes = userStats.find(s => s.status === 'COMPLETED')?._count.status || 0

  return {
    totalSchemes,
    activeSchemes,
    userFavorites,
    appliedSchemes,
    completedSchemes,
    activePlans,
    pendingAudits,
    recentActivity: recentActivity.map(activity => ({
      id: activity.id,
      type: 'scheme' as const,
      title: activity.scheme.name,
      timestamp: activity.updatedAt,
      status: activity.status
    }))
  }
}

// File utilities
export async function getFilesByScheme(schemeId: string) {
  return prisma.file.findMany({
    where: { schemeId, status: 'UPLOADED' },
    include: {
      uploadedBy: { select: { name: true, email: true } }
    },
    orderBy: { createdAt: 'desc' }
  })
}

// Search utilities
export async function globalSearch(query: string, limit = 10) {
  const [schemes, legalDocs, templates] = await Promise.all([
    prisma.scheme.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { tags: { contains: query, mode: 'insensitive' } }
        ]
      },
      select: { id: true, name: true, shortCode: true, type: true },
      take: limit
    }),
    prisma.legalDoc.findMany({
      where: {
        isActive: true,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { summary: { contains: query, mode: 'insensitive' } },
          { tags: { contains: query, mode: 'insensitive' } }
        ]
      },
      select: { id: true, title: true, jurisdiction: true },
      take: limit
    }),
    prisma.template.findMany({
      where: {
        isActive: true,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { contentMd: { contains: query, mode: 'insensitive' } },
          { tags: { contains: query, mode: 'insensitive' } }
        ]
      },
      select: { id: true, title: true, category: true },
      take: limit
    })
  ])

  return {
    schemes: schemes.map(s => ({ ...s, resultType: 'scheme' })),
    legalDocs: legalDocs.map(d => ({ ...d, resultType: 'legal' })),
    templates: templates.map(t => ({ ...t, resultType: 'template' }))
  }
}