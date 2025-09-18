// app/api/schemes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const schemeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  shortCode: z.string().optional(),
  type: z.enum(['SCHEME', 'CERTIFICATION', 'FRAMEWORK', 'SUBSIDY', 'GRANT', 'LOAN', 'INCENTIVE']),
  authority: z.string().min(1, 'Authority is required'),
  jurisdiction: z.string().default('Central'),
  description: z.string().min(1, 'Description is required'),
  benefits: z.string().optional(),
  eligibility: z.string().optional(),
  documentsUrl: z.string().url().optional().or(z.literal('')),
  sector: z.array(z.string()).default([]),
  companySize: z.array(z.enum(['MICRO', 'SMALL', 'MEDIUM', 'LARGE'])).default([]),
  pillarE: z.boolean().default(false),
  pillarS: z.boolean().default(false),
  pillarG: z.boolean().default(false),
  applicationDeadline: z.string().datetime().optional(),
  processingDays: z.number().int().positive().optional(),
  applicationFee: z.number().nonnegative().optional(),
  maxBenefitAmount: z.number().nonnegative().optional(),
  priority: z.number().int().min(0).max(10).default(5),
  tags: z.array(z.string()).default([]),
  categories: z.array(z.string()).default([]),
});

function validateAdminKey(req: NextRequest): boolean {
  const key = req.headers.get('x-admin-key') || '';
  return !!key && !!process.env.ADMIN_KEY && key === process.env.ADMIN_KEY;
}

// GET - Fetch schemes with advanced filtering
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type');
    const jurisdiction = searchParams.get('jurisdiction');
    const sector = searchParams.get('sector');
    const companySize = searchParams.get('companySize');
    const pillars = searchParams.get('pillars')?.split(',') || [];
    const tags = searchParams.get('tags')?.split(',') || [];
    const sortBy = searchParams.get('sortBy') || 'priority';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build where clause
    const where: any = {
      isActive: true,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { shortCode: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { authority: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (type) where.type = type;
    if (jurisdiction) where.jurisdiction = jurisdiction;
    if (sector) where.sector = { has: sector };
    if (companySize) where.companySize = { has: companySize };

    // Pillar filters
    if (pillars.includes('E')) where.pillarE = true;
    if (pillars.includes('S')) where.pillarS = true;
    if (pillars.includes('G')) where.pillarG = true;

    // Tag filter
    if (tags.length > 0) {
      where.tags = {
        some: {
          name: { in: tags }
        }
      };
    }

    // Build orderBy
    const orderBy: any = {};
    if (sortBy === 'popularity') {
      orderBy.popularity = sortOrder;
    } else if (sortBy === 'name') {
      orderBy.name = sortOrder;
    } else if (sortBy === 'createdAt') {
      orderBy.createdAt = sortOrder;
    } else {
      orderBy.priority = sortOrder;
    }

    // Execute queries
    const [schemes, totalCount] = await Promise.all([
      prisma.scheme.findMany({
        where,
        include: {
          tags: {
            select: { name: true }
          },
          categories: {
            select: { name: true }
          },
          creator: {
            select: { name: true, email: true }
          },
          _count: {
            select: {
              favorites: true,
              applications: true,
              files: true
            }
          }
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.scheme.count({ where })
    ]);

    // Transform data for response
    const transformedSchemes = schemes.map(scheme => ({
      ...scheme,
      tags: scheme.tags.map(t => t.name),
      categories: scheme.categories.map(c => c.name),
      stats: {
        favoriteCount: scheme._count.favorites,
        applicationCount: scheme._count.applications,
        fileCount: scheme._count.files
      }
    }));

    return NextResponse.json({
      schemes: transformedSchemes,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      },
      filters: {
        search,
        type,
        jurisdiction,
        sector,
        companySize,
        pillars,
        tags
      }
    });
  } catch (error) {
    console.error('Error fetching schemes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schemes' },
      { status: 500 }
    );
  }
}

// POST - Create or update scheme
export async function POST(req: NextRequest) {
  try {
    if (!validateAdminKey(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = schemeSchema.parse(body);

    // Handle tags and categories
    const { tags, categories, ...schemeData } = validatedData;
    
    // Convert date strings to Date objects
    if (validatedData.applicationDeadline) {
      schemeData.applicationDeadline = new Date(validatedData.applicationDeadline);
    }

    // Check if scheme exists
    const existingScheme = await prisma.scheme.findUnique({
      where: { name: validatedData.name }
    });

    let scheme;

    if (existingScheme) {
      // Update existing scheme
      scheme = await prisma.scheme.update({
        where: { name: validatedData.name },
        data: {
          ...schemeData,
          updatedAt: new Date()
        },
        include: {
          tags: true,
          categories: true
        }
      });
    } else {
      // Create new scheme
      scheme = await prisma.scheme.create({
        data: schemeData,
        include: {
          tags: true,
          categories: true
        }
      });
    }

    // Handle tags
    if (tags && tags.length > 0) {
      // Create tags if they don't exist
      for (const tagName of tags) {
        await prisma.schemeTag.upsert({
          where: { name: tagName },
          update: {},
          create: { name: tagName }
        });
      }

      // Get all tags
      const tagRecords = await prisma.schemeTag.findMany({
        where: { name: { in: tags } }
      });

      // Update scheme tags
      await prisma.scheme.update({
        where: { id: scheme.id },
        data: {
          tags: {
            set: tagRecords.map(tag => ({ id: tag.id }))
          }
        }
      });
    }

    // Handle categories
    if (categories && categories.length > 0) {
      // Create categories if they don't exist
      for (const categoryName of categories) {
        await prisma.schemeCategory.upsert({
          where: { name: categoryName },
          update: {},
          create: { name: categoryName }
        });
      }

      // Get all categories
      const categoryRecords = await prisma.schemeCategory.findMany({
        where: { name: { in: categories } }
      });

      // Update scheme categories
      await prisma.scheme.update({
        where: { id: scheme.id },
        data: {
          categories: {
            set: categoryRecords.map(cat => ({ id: cat.id }))
          }
        }
      });
    }

    // Increment popularity for updates
    if (existingScheme) {
      await prisma.scheme.update({
        where: { id: scheme.id },
        data: { popularity: { increment: 1 } }
      });
    }

    // Fetch final scheme with relations
    const finalScheme = await prisma.scheme.findUnique({
      where: { id: scheme.id },
      include: {
        tags: { select: { name: true } },
        categories: { select: { name: true } },
        creator: { select: { name: true } }
      }
    });

    return NextResponse.json({
      success: true,
      scheme: {
        ...finalScheme,
        tags: finalScheme?.tags.map(t => t.name) || [],
        categories: finalScheme?.categories.map(c => c.name) || []
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating/updating scheme:', error);
    return NextResponse.json(
      { error: 'Failed to save scheme' },
      { status: 500 }
    );
  }
}

// DELETE - Soft delete scheme
export async function DELETE(req: NextRequest) {
  try {
    if (!validateAdminKey(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = req.nextUrl;
    const schemeId = searchParams.get('id');

    if (!schemeId) {
      return NextResponse.json(
        { error: 'Scheme ID is required' },
        { status: 400 }
      );
    }

    // Soft delete by setting isActive to false
    const scheme = await prisma.scheme.update({
      where: { id: schemeId },
      data: {
        isActive: false,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Scheme deactivated successfully',
      scheme
    });

  } catch (error) {
    console.error('Error deleting scheme:', error);
    return NextResponse.json(
      { error: 'Failed to delete scheme' },
      { status: 500 }
    );
  }
}