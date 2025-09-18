// prisma/seed.mjs
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Sample users
const users = [
  {
    email: 'admin@msme-esg.gov.in',
    name: 'System Administrator',
    role: 'SUPER_ADMIN',
    organization: 'MSME Ministry',
    expertise: ['ESG', 'Compliance', 'Government Schemes']
  },
  {
    email: 'consultant@esgpartners.com',
    name: 'ESG Consultant',
    role: 'CONSULTANT',
    organization: 'ESG Partners India',
    expertise: ['Environmental Compliance', 'Social Auditing', 'Governance']
  }
];

// Enhanced schemes with better categorization
const schemes = [
  {
    name: 'MSME Sustainable (ZED) Certification',
    shortCode: 'ZED',
    type: 'CERTIFICATION',
    authority: 'MSME Ministry',
    jurisdiction: 'Central',
    description: 'ZED 2.0 certification for MSMEs with Bronze/Silver/Gold levels focusing on zero defects and zero effects.',
    benefits: 'Up to 80% subsidy on certification costs, handholding support, market access, priority in government procurement.',
    eligibility: 'All registered MSMEs as per Udyam Registration. Manufacturing and service enterprises eligible.',
    documentsUrl: 'https://zed.msme.gov.in',
    sector: ['Manufacturing', 'Services', 'Food Processing', 'Textiles'],
    companySize: ['MICRO', 'SMALL', 'MEDIUM'],
    pillarE: true,
    pillarS: true,
    pillarG: true,
    applicationFee: 0,
    processingDays: 90,
    maxBenefitAmount: 500000,
    priority: 10,
    popularity: 150
  },
  {
    name: 'Technology and Quality Up-gradation Support (TEQUP)',
    shortCode: 'TEQUP',
    type: 'SCHEME',
    authority: 'MSME Ministry',
    jurisdiction: 'Central',
    description: 'Support for technology upgradation and quality certification for MSMEs.',
    benefits: 'Credit linked capital subsidy up to Rs. 1 crore, technology support, quality certification assistance.',
    eligibility: 'Manufacturing MSMEs, existing units for expansion/modernization.',
    documentsUrl: 'https://msme.gov.in/tequp',
    sector: ['Manufacturing', 'Engineering', 'Auto Components'],
    companySize: ['SMALL', 'MEDIUM'],
    pillarE: true,
    pillarS: false,
    pillarG: true,
    applicationFee: 10000,
    processingDays: 120,
    maxBenefitAmount: 10000000,
    priority: 8,
    popularity: 80
  },
  {
    name: 'Credit Guarantee Scheme (CGS)',
    shortCode: 'CGS',
    type: 'SCHEME',
    authority: 'SIDBI/CGTMSE',
    jurisdiction: 'Central',
    description: 'Collateral-free credit guarantee for MSMEs to access institutional finance.',
    benefits: 'Credit guarantee up to Rs. 5 crores, no collateral required, reduced documentation.',
    eligibility: 'All MSMEs, new and existing enterprises, manufacturing and service sectors.',
    documentsUrl: 'https://cgtmse.in',
    sector: ['All Sectors'],
    companySize: ['MICRO', 'SMALL', 'MEDIUM'],
    pillarE: false,
    pillarS: true,
    pillarG: true,
    applicationFee: 0,
    processingDays: 30,
    maxBenefitAmount: 50000000,
    priority: 9,
    popularity: 200
  },
  {
    name: 'Goa Investment Promotion and Facilitation Board Incentives',
    shortCode: 'GIPFB',
    type: 'INCENTIVE',
    authority: 'Government of Goa',
    jurisdiction: 'State',
    description: 'Comprehensive investment incentives for industries in Goa including capital subsidy, power subsidy, and tax benefits.',
    benefits: 'Capital investment subsidy up to 25%, power subsidy, land lease concessions, tax exemptions.',
    eligibility: 'New industrial units, expansion projects, MSMEs and large industries.',
    documentsUrl: 'https://gipfb.goa.gov.in',
    sector: ['Manufacturing', 'IT/ITES', 'Tourism', 'Food Processing'],
    companySize: ['MICRO', 'SMALL', 'MEDIUM', 'LARGE'],
    pillarE: true,
    pillarS: true,
    pillarG: false,
    applicationFee: 25000,
    processingDays: 180,
    maxBenefitAmount: 25000000,
    priority: 7,
    popularity: 45
  }
];

// Enhanced legal documents
const legalDocs = [
  {
    title: 'Central Pollution Control Board - Comprehensive Environmental Compliance Guidelines for MSMEs',
    jurisdiction: 'Central',
    sector: 'All Manufacturing',
    locationTag: null,
    summary: 'Comprehensive guidelines covering air, water, and waste management compliance requirements for micro, small, and medium manufacturing enterprises.',
    url: 'https://cpcb.nic.in/msme-guidelines',
    documentType: 'GUIDELINE',
    severity: 'HIGH',
    pillarE: true,
    pillarS: false,
    pillarG: true,
    tags: 'environment,compliance,manufacturing,pollution,CPCB'
  },
  {
    title: 'Goa State Pollution Control Board - Consent to Operate Procedures and Requirements',
    jurisdiction: 'State',
    sector: 'Manufacturing',
    locationTag: 'Goa',
    summary: 'Detailed procedures for obtaining Consent to Establish (CTE) and Consent to Operate (CTO) in Goa, including timelines, documentation, and renewal processes.',
    url: 'https://gspcb.goa.gov.in/consent-procedures',
    documentType: 'REGULATION',
    severity: 'CRITICAL',
    pillarE: true,
    pillarS: false,
    pillarG: true,
    tags: 'consent,goa,GSPCB,CTO,CTE,state'
  },
  {
    title: 'Ministry of Labour - Occupational Safety and Health Guidelines for Small Industries',
    jurisdiction: 'Central',
    sector: 'All Industries',
    locationTag: null,
    summary: 'Safety protocols, worker protection measures, and compliance requirements under various labor laws for small and medium enterprises.',
    url: 'https://labour.gov.in/osh-guidelines',
    documentType: 'GUIDELINE',
    severity: 'HIGH',
    pillarE: false,
    pillarS: true,
    pillarG: true,
    tags: 'safety,labor,OSH,worker protection,compliance'
  },
  {
    title: 'Corporate Social Responsibility Rules Amendment 2021',
    jurisdiction: 'Central',
    sector: 'Corporate',
    locationTag: null,
    summary: 'Updated CSR compliance requirements including spending thresholds, approved activities, and reporting formats under Companies Act.',
    url: 'https://mca.gov.in/csr-rules-2021',
    documentType: 'AMENDMENT',
    severity: 'MEDIUM',
    pillarE: false,
    pillarS: true,
    pillarG: true,
    tags: 'CSR,corporate,social responsibility,MCA,companies act'
  }
];

// Enhanced templates
const templates = [
  {
    title: 'Environmental Compliance Checklist for Manufacturing MSMEs',
    category: 'CHECKLIST',
    description: 'Comprehensive checklist covering all environmental compliance requirements for manufacturing enterprises.',
    contentMd: `# Environmental Compliance Checklist

## Statutory Consents & Approvals
- [ ] Consent to Establish (CTE) - Valid and current
- [ ] Consent to Operate (CTO) - Valid and current  
- [ ] Environmental Clearance (if required)
- [ ] Hazardous Waste Authorization (if applicable)

## Air Pollution Control
- [ ] Stack emission monitoring reports
- [ ] Ambient air quality monitoring (if required)
- [ ] Pollution control equipment maintenance records
- [ ] Fuel quality certificates

## Water Pollution Control  
- [ ] Effluent discharge monitoring reports
- [ ] Water consumption records
- [ ] Groundwater extraction permits (if applicable)
- [ ] Rainwater harvesting compliance

## Waste Management
- [ ] Solid waste segregation and disposal records
- [ ] Hazardous waste manifests and disposal certificates
- [ ] E-waste compliance (if applicable)
- [ ] Plastic waste management compliance

## Records and Documentation
- [ ] Environmental monitoring register
- [ ] Complaint register maintenance
- [ ] Annual environmental statement filing
- [ ] Pollution control equipment log books

## Emergency Preparedness
- [ ] Emergency response plan
- [ ] Spill control measures
- [ ] Fire safety compliance
- [ ] Worker safety training records`,
    version: '2.1',
    tags: 'environment,compliance,checklist,manufacturing'
  },
  {
    title: 'ZED Certification Readiness Assessment Template',
    category: 'AUDIT',
    description: 'Self-assessment template for MSMEs preparing for ZED certification application.',
    contentMd: `# ZED Certification Readiness Assessment

## Quality Management (25 points)
- [ ] Quality policy documented and communicated
- [ ] Quality objectives set and monitored
- [ ] Customer complaints tracking system
- [ ] Supplier quality management process
- [ ] Internal quality audits conducted

## Environment Management (20 points)
- [ ] Environmental policy in place
- [ ] Resource consumption monitoring
- [ ] Waste reduction initiatives
- [ ] Energy conservation measures
- [ ] Environmental legal compliance

## Safety & Health (15 points)
- [ ] Safety policy and procedures
- [ ] Accident reporting system
- [ ] Personal protective equipment usage
- [ ] Safety training programs
- [ ] Health surveillance of workers

## Productivity & Efficiency (15 points)
- [ ] Production planning system
- [ ] Inventory management
- [ ] Equipment maintenance schedules
- [ ] Skill development programs
- [ ] Performance measurement system

## Financial Management (10 points)
- [ ] Cost accounting system
- [ ] Budget planning and control
- [ ] Financial reporting regularity
- [ ] Investment appraisal process

## Innovation (10 points)
- [ ] Innovation policy and process
- [ ] Employee suggestion schemes
- [ ] Technology upgradation plans
- [ ] Research and development activities

## Documentation (5 points)
- [ ] Standard operating procedures
- [ ] Work instructions available
- [ ] Record maintenance system
- [ ] Document control process

**Scoring:**
- 80-100 points: Ready for Gold certification
- 60-79 points: Ready for Silver certification  
- 40-59 points: Ready for Bronze certification
- <40 points: Need significant improvements`,
    version: '1.5',
    tags: 'ZED,certification,assessment,quality'
  }
];

// Sample companies
const companies = [
  {
    name: 'Green Manufacturing Pvt Ltd',
    udyamNumber: 'UDYAM-GJ-03-0123456',
    sector: 'Food Processing',
    size: 'SMALL',
    state: 'Goa',
    city: 'Panaji',
    turnoverCr: 8.5,
    employees: 45,
    contactPerson: 'Ramesh Kumar',
    contactEmail: 'ramesh@greenmanufacturing.com',
    contactPhone: '+91-9876543210'
  },
  {
    name: 'Sustainable Textiles LLP',
    udyamNumber: 'UDYAM-GJ-01-0789012',
    sector: 'Textiles',
    size: 'MEDIUM',
    state: 'Goa',
    city: 'Margao',
    turnoverCr: 18.2,
    employees: 120,
    contactPerson: 'Priya Sharma',
    contactEmail: 'priya@sustextiles.com',
    contactPhone: '+91-9876543211'
  }
];

// Tags and categories
const tags = [
  'environment', 'social', 'governance', 'quality', 'safety', 'energy',
  'waste', 'water', 'emission', 'compliance', 'certification', 'subsidy',
  'finance', 'technology', 'innovation', 'manufacturing', 'services',
  'food processing', 'textiles', 'chemicals', 'pharmaceuticals'
];

const categories = [
  'Environmental Compliance', 'Quality Certification', 'Financial Support',
  'Technology Upgradation', 'Skill Development', 'Market Access',
  'Export Promotion', 'Green Finance', 'Social Compliance'
];

async function main() {
  console.log('🌱 Starting comprehensive seed...');

  // Create users first
  for (const userData of users) {
    await prisma.user.upsert({
      where: { email: userData.email },
      update: userData,
      create: userData
    });
  }
  console.log(`✅ Seeded ${users.length} users`);

  // Create tags
  for (const tagName of tags) {
    await prisma.schemeTag.upsert({
      where: { name: tagName },
      update: {},
      create: { name: tagName }
    });
  }
  console.log(`✅ Seeded ${tags.length} tags`);

  // Create categories  
  for (const categoryName of categories) {
    await prisma.schemeCategory.upsert({
      where: { name: categoryName },
      update: {},
      create: { name: categoryName }
    });
  }
  console.log(`✅ Seeded ${categories.length} categories`);

  // Create schemes
  const adminUser = await prisma.user.findUnique({
    where: { email: 'admin@msme-esg.gov.in' }
  });

  for (const schemeData of schemes) {
    const scheme = await prisma.scheme.upsert({
      where: { name: schemeData.name },
      update: {
        ...schemeData,
        createdBy: adminUser?.id
      },
      create: {
        ...schemeData,
        createdBy: adminUser?.id
      }
    });

    // Add some sample tags to schemes
    const schemeTags = await prisma.schemeTag.findMany({
      where: {
        name: {
          in: ['environment', 'quality', 'finance', 'compliance']
        }
      }
    });

    if (schemeTags.length > 0) {
      await prisma.scheme.update({
        where: { id: scheme.id },
        data: {
          tags: {
            connect: schemeTags.slice(0, 2).map(tag => ({ id: tag.id }))
          }
        }
      });
    }
  }
  console.log(`✅ Seeded ${schemes.length} schemes`);

  // Create companies
  for (const companyData of companies) {
    await prisma.company.upsert({
      where: { udyamNumber: companyData.udyamNumber },
      update: companyData,
      create: companyData
    });
  }
  console.log(`✅ Seeded ${companies.length} companies`);

  // Create legal documents
  for (const docData of legalDocs) {
    await prisma.legalDoc.upsert({
      where: { title: docData.title },
      update: docData,
      create: docData
    });
  }
  console.log(`✅ Seeded ${legalDocs.length} legal documents`);

  // Create templates
  for (const templateData of templates) {
    await prisma.template.upsert({
      where: { title: templateData.title },
      update: templateData,
      create: templateData
    });
  }
  console.log(`✅ Seeded ${templates.length} templates`);

  // Create sample scheme links
  const allSchemes = await prisma.scheme.findMany();
  if (allSchemes.length >= 2) {
    const zedScheme = allSchemes.find(s => s.shortCode === 'ZED');
    const tequpScheme = allSchemes.find(s => s.shortCode === 'TEQUP');
    
    if (zedScheme && tequpScheme) {
      await prisma.schemeLink.upsert({
        where: {
          fromId_toId_relation: {
            fromId: zedScheme.id,
            toId: tequpScheme.id,
            relation: 'COMPLEMENT'
          }
        },
        update: {
          notes: 'ZED certification complements technology upgradation under TEQUP'
        },
        create: {
          fromId: zedScheme.id,
          toId: tequpScheme.id,
          relation: 'COMPLEMENT',
          notes: 'ZED certification complements technology upgradation under TEQUP'
        }
      });
    }
  }

  // Create sample ESG plan
  const consultant = await prisma.user.findUnique({
    where: { email: 'consultant@esgpartners.com' }
  });
  const sampleCompany = await prisma.company.findFirst();
  
  if (consultant && sampleCompany) {
    const esgPlan = await prisma.eSGPlan.create({
      data: {
        title: 'ESG Compliance Roadmap 2024-25',
        description: 'Comprehensive ESG implementation plan for achieving ZED certification and environmental compliance',
        companyId: sampleCompany.id,
        createdBy: consultant.id,
        startDate: new Date(),
        targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        status: 'ACTIVE'
      }
    });

    // Add sample plan items
    const zedScheme = await prisma.scheme.findFirst({
      where: { shortCode: 'ZED' }
    });

    if (zedScheme) {
      await prisma.eSGPlanItem.createMany({
        data: [
          {
            title: 'Complete ZED Certification Application',
            description: 'Prepare and submit ZED certification application with all required documentation',
            planId: esgPlan.id,
            schemeId: zedScheme.id,
            dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            status: 'PENDING',
            priority: 'HIGH',
            order: 1
          },
          {
            title: 'Environmental Compliance Audit',
            description: 'Conduct comprehensive environmental compliance audit and address gaps',
            planId: esgPlan.id,
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            status: 'IN_PROGRESS',
            priority: 'URGENT',
            order: 2
          },
          {
            title: 'Worker Safety Training Program',
            description: 'Implement comprehensive safety training program for all employees',
            planId: esgPlan.id,
            dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
            status: 'PENDING',
            priority: 'HIGH',
            order: 3
          }
        ]
      });
    }
  }

  console.log('🎉 Comprehensive seed completed successfully!');
  console.log(`
📊 Summary:
- ${users.length} Users created
- ${tags.length} Tags created
- ${categories.length} Categories created
- ${schemes.length} Schemes created
- ${companies.length} Companies created
- ${legalDocs.length} Legal documents created
- ${templates.length} Templates created
- 1 ESG Plan with 3 items created
- 1 Scheme link created
  `);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });