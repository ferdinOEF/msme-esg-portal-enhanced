import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting enhanced seed...')

  // Create a demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
      role: 'CONSULTANT',
    },
  })

  // Create categories
  const categories = [
    {
      name: 'Environmental Compliance',
      description: 'Environmental regulations and certifications',
      color: '#10b981',
      icon: '🌱',
    },
    {
      name: 'Quality Management',
      description: 'Quality standards and certifications',
      color: '#3b82f6',
      icon: '⭐',
    },
    {
      name: 'Financial Incentives',
      description: 'Government subsidies and financial support',
      color: '#f59e0b',
      icon: '💰',
    },
    {
      name: 'Social Compliance',
      description: 'Labor and social responsibility standards',
      color: '#8b5cf6',
      icon: '👥',
    },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: cat,
      create: cat,
    })
  }

  const envCategory = await prisma.category.findUnique({ where: { name: 'Environmental Compliance' } })
  const qualityCategory = await prisma.category.findUnique({ where: { name: 'Quality Management' } })
  const financeCategory = await prisma.category.findUnique({ where: { name: 'Financial Incentives' } })

  // Enhanced schemes data
  const schemes = [
    {
      name: 'MSME Sustainable (ZED) Certification',
      shortCode: 'ZED',
      type: 'CERTIFICATION',
      categoryId: envCategory?.id,
      authority: 'Ministry of MSME',
      jurisdiction: 'CENTRAL',
      pillar: 'E,S,G',
      tags: 'central,scheme,quality,sustainability,msme',
      description: 'Zero Defect Zero Effect (ZED) certification for MSMEs with Bronze, Silver, and Gold levels focusing on quality and environmental impact.',
      benefits: 'Subsidy on certification costs, handholding support, priority in government tenders, improved market access',
      eligibility: 'Registered MSMEs as per Udyam registration; support varies by category and turnover',
      documentsUrl: 'https://zed.msme.gov.in',
      priority: 'HIGH',
      isActive: true,
    },
    {
      name: 'SIDBI 4E – End to End Energy Efficiency',
      shortCode: 'SIDBI-4E',
      type: 'SCHEME',
      categoryId: financeCategory?.id,
      authority: 'SIDBI',
      jurisdiction: 'CENTRAL',
      pillar: 'E',
      tags: 'energy-efficiency,finance,loan,central,sidbi',
      description: 'Comprehensive financing solution for MSMEs implementing energy efficiency measures and clean technology upgrades.',
      benefits: 'Low interest financing up to ₹10 crores, technical support, DPR preparation assistance, subsidy linkage',
      eligibility: 'MSMEs with viable energy efficiency projects as per SIDBI guidelines',
      documentsUrl: 'https://www.sidbi.in',
      priority: 'MEDIUM',
      isActive: true,
    },
    {
      name: 'BIS Product Certification (ISI)',
      shortCode: 'BIS-ISI',
      type: 'CERTIFICATION',
      categoryId: qualityCategory?.id,
      authority: 'Bureau of Indian Standards',
      jurisdiction: 'CENTRAL',
      pillar: 'G,Q',
      tags: 'quality,standards,certification,central,bis,isi',
      description: 'Bureau of Indian Standards certification (ISI mark) for specified products ensuring quality and safety standards.',
      benefits: 'Market credibility, regulatory compliance, consumer trust, export facilitation',
      eligibility: 'Manufacturers in notified product categories with adequate testing facilities',
      documentsUrl: 'https://bis.gov.in',
      priority: 'MEDIUM',
      isActive: true,
    },
    {
      name: 'Goa – SPICE Circular Economy Subsidy',
      shortCode: 'SPICE-GOA',
      type: 'SUBSIDY',
      categoryId: envCategory?.id,
      authority: 'Government of Goa',
      jurisdiction: 'STATE',
      pillar: 'E',
      tags: 'state,goa,circular-economy,subsidy,waste-management',
      description: 'State-level incentive for circular economy initiatives, waste reduction, and resource efficiency projects.',
      benefits: 'Capital subsidy up to 50%, technical assistance, recognition awards, priority clearances',
      eligibility: 'MSMEs registered in Goa implementing circular economy practices',
      documentsUrl: 'https://goa.gov.in',
      priority: 'HIGH',
      isActive: true,
    },
    {
      name: 'ISO 14001 Environmental Management',
      shortCode: 'ISO-14001',
      type: 'CERTIFICATION',
      categoryId: envCategory?.id,
      authority: 'International Organization for Standardization',
      jurisdiction: 'INTERNATIONAL',
      pillar: 'E',
      tags: 'iso,environment,international,ems,certification',
      description: 'International standard for Environmental Management Systems (EMS) helping organizations improve environmental performance.',
      benefits: 'Global recognition, improved environmental performance, cost savings, regulatory compliance',
      eligibility: 'Any organization committed to environmental management system implementation',
      documentsUrl: 'https://www.iso.org',
      priority: 'MEDIUM',
      isActive: true,
    },
    {
      name: 'TEAM (Technology & Energy Assessment)',
      shortCode: 'TEAM',
      type: 'SCHEME',
      categoryId: envCategory?.id,
      authority: 'Ministry of MSME',
      jurisdiction: 'CENTRAL',
      pillar: 'E',
      tags: 'energy,audit,manufacturing,assessment,msme',
      description: 'Technology and Energy Assessment for MSMEs to identify energy saving opportunities and technology upgrades.',
      benefits: 'Subsidized energy audits, technology recommendations, implementation support',
      eligibility: 'Manufacturing MSMEs with minimum energy consumption as per guidelines',
      documentsUrl: 'https://msme.gov.in',
      priority: 'MEDIUM',
      isActive: true,
    },
  ]

  for (const scheme of schemes) {
    await prisma.scheme.upsert({
      where: { name: scheme.name },
      update: scheme,
      create: scheme,
    })
  }

  // Create scheme links
  const zed = await prisma.scheme.findUnique({ where: { name: 'MSME Sustainable (ZED) Certification' } })
  const sidbi = await prisma.scheme.findUnique({ where: { name: 'SIDBI 4E – End to End Energy Efficiency' } })
  const team = await prisma.scheme.findUnique({ where: { name: 'TEAM (Technology & Energy Assessment)' } })

  if (zed && sidbi) {
    await prisma.link.upsert({
      where: { fromId_toId_relation: { fromId: team?.id || '', toId: sidbi.id, relation: 'SUPPORTS' } },
      update: {},
      create: { fromId: team?.id || '', toId: sidbi.id, relation: 'SUPPORTS' },
    }).catch(() => {}) // Ignore if already exists
  }

  // Enhanced legal documents
  const legalDocs = [
    {
      title: 'CPCB Guidelines for MSMEs - Environmental Compliance 2024',
      jurisdiction: 'CPCB',
      sector: 'Manufacturing',
      locationTag: null,
      summary: 'Comprehensive guidelines for MSMEs covering air, water, and waste management compliance under environmental acts.',
      url: 'https://cpcb.nic.in',
      tags: 'cpcb,guidelines,environment,compliance,msme',
      priority: 'HIGH',
      effectiveDate: new Date('2024-01-01'),
      isActive: true,
    },
    {
      title: 'GSPCB Consent to Operate (CTO) – Goa State Rules',
      jurisdiction: 'STATE',
      sector: 'All Sectors',
      locationTag: 'Goa',
      summary: 'State-specific consent to operate requirements under Air and Water Acts for industrial units in Goa.',
      url: 'https://goa.gov.in/gspcb',
      tags: 'state,goa,cto,consent,gspcb',
      priority: 'CRITICAL',
      effectiveDate: new Date('2023-06-01'),
      isActive: true,
    },
    {
      title: 'NGT Order on Plastic Waste Management - 2024',
      jurisdiction: 'NGT',
      sector: 'Packaging',
      locationTag: null,
      summary: 'National Green Tribunal order on plastic waste management and extended producer responsibility.',
      url: 'https://greentribunal.gov.in',
      tags: 'ngt,plastic,waste,epr,packaging',
      priority: 'HIGH',
      effectiveDate: new Date('2024-03-15'),
      expiryDate: new Date('2026-03-15'),
      isActive: true,
    },
  ]

  for (const doc of legalDocs) {
    await prisma.legalDoc.upsert({
      where: { title: doc.title },
      update: doc,
      create: doc,
    })
  }

  // Enhanced templates
  const templates = [
    {
      title: 'Environmental Compliance Checklist - Manufacturing',
      category: 'CHECKLIST',
      contentMd: `# Environmental Compliance Checklist for Manufacturing MSMEs

## Statutory Clearances
- [ ] Consent to Establish (CTE) - Valid and current
- [ ] Consent to Operate (CTO) - Air Act compliance
- [ ] Water Act clearance - Effluent treatment compliance
- [ ] Hazardous Waste Authorization (if applicable)

## Monitoring & Records
- [ ] Environmental monitoring reports - Monthly/Quarterly
- [ ] Waste generation records - Daily logs
- [ ] Water consumption and discharge records
- [ ] Air emission monitoring data

## Compliance Actions
- [ ] Environmental Management Plan implementation
- [ ] Pollution control equipment maintenance
- [ ] Staff training on environmental procedures
- [ ] Emergency response plan updated`,
      tags: 'checklist,compliance,environment,manufacturing',
      version: '2.0',
      isActive: true,
    },
    {
      title: 'OSH & Fire Safety Monthly Audit Template',
      category: 'AUDIT',
      contentMd: `# Occupational Safety & Health (OSH) Monthly Audit

## Fire Safety Compliance
- [ ] Fire NOC validity check
- [ ] Fire extinguisher inspection and refilling
- [ ] Emergency evacuation drill records
- [ ] Fire alarm system testing

## Worker Safety
- [ ] PPE availability and usage monitoring
- [ ] Safety training completion records
- [ ] Accident/incident reporting logs
- [ ] First aid kit maintenance

## Scoring
- Total items: 8
- Compliant items: ___
- Compliance percentage: ___%
- Action items: ___`,
      tags: 'safety,osh,fire,audit,monthly',
      version: '1.5',
      isActive: true,
    },
    {
      title: 'ESG Policy Template for MSMEs',
      category: 'POLICY',
      contentMd: `# Environmental, Social & Governance (ESG) Policy

## Environmental Commitments
- Minimize environmental impact through efficient resource use
- Comply with all applicable environmental regulations
- Implement waste reduction and recycling programs
- Monitor and report environmental performance

## Social Responsibilities
- Ensure safe and healthy working conditions
- Promote diversity and inclusion in workplace
- Support local community development initiatives
- Maintain ethical business practices

## Governance Framework
- Maintain transparent business operations
- Ensure regulatory compliance across all operations
- Implement robust risk management systems
- Regular stakeholder engagement and reporting`,
      tags: 'policy,esg,governance,template',
      version: '1.0',
      isActive: true,
    },
  ]

  for (const template of templates) {
    await prisma.template.upsert({
      where: { title: template.title },
      update: template,
      create: template,
    })
  }

  // Create sample user schemes (favorites and applications)
  const sampleUserSchemes = [
    { schemeId: zed?.id, status: 'APPLIED', isFavorite: true, appliedAt: new Date() },
    { schemeId: sidbi?.id, status: 'INTERESTED', isFavorite: true },
    { schemeId: team?.id, status: 'COMPLETED', isFavorite: false, completedAt: new Date() },
  ]

  for (const userScheme of sampleUserSchemes) {
    if (userScheme.schemeId) {
      await prisma.userScheme.upsert({
        where: { userId_schemeId: { userId: user.id, schemeId: userScheme.schemeId } },
        update: userScheme,
        create: { userId: user.id, ...userScheme },
      })
    }
  }

  // Create sample ESG plan
  const esgPlan = await prisma.eSGPlan.create({
    data: {
      userId: user.id,
      name: 'ABC Manufacturing ESG Roadmap 2024',
      description: 'Comprehensive ESG implementation plan for manufacturing MSME',
      companyName: 'ABC Manufacturing Pvt Ltd',
      sector: 'Metal Fabrication',
      size: 'SMALL',
      state: 'Goa',
      udyamNumber: 'UDYAM-GA-03-0123456',
      turnoverCr: 8.5,
      status: 'ACTIVE',
      targetDate: new Date('2024-12-31'),
    },
  })

  // Create ESG plan items
  const planItems = [
    {
      title: 'Obtain ZED Certification',
      description: 'Apply for Bronze level ZED certification',
      pillar: 'ENVIRONMENTAL',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      dueDate: new Date('2024-06-30'),
      schemeId: zed?.id,
      order: 1,
    },
    {
      title: 'Energy Efficiency Assessment',
      description: 'Conduct comprehensive energy audit',
      pillar: 'ENVIRONMENTAL',
      priority: 'MEDIUM',
      status: 'PENDING',
      dueDate: new Date('2024-04-30'),
      schemeId: team?.id,
      order: 2,
    },
    {
      title: 'Worker Safety Training Program',
      description: 'Implement monthly safety training for all workers',
      pillar: 'SOCIAL',
      priority: 'HIGH',
      status: 'PENDING',
      dueDate: new Date('2024-03-31'),
      order: 3,
    },
  ]

  for (const item of planItems) {
    await prisma.eSGPlanItem.create({
      data: { planId: esgPlan.id, ...item },
    })
  }

  // Create sample files
  if (zed) {
    await prisma.file.create({
      data: {
        schemeId: zed.id,
        name: 'ZED Certification Guidelines 2024',
        originalName: 'zed-guidelines-2024.pdf',
        url: 'https://zed.msme.gov.in/guidelines.pdf',
        type: 'GUIDELINE',
        status: 'UPLOADED',
        mimeType: 'application/pdf',
        uploadedById: user.id,
      },
    })
  }

  console.log('✅ Enhanced seed completed successfully!')
  console.log(`👤 Demo user created: ${user.email}`)
  console.log(`📊 Created ${schemes.length} schemes, ${legalDocs.length} legal docs, ${templates.length} templates`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })