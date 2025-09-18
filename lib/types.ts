import type { 
  Scheme, 
  Category, 
  LegalDoc, 
  Template, 
  File, 
  User, 
  UserScheme, 
  ESGPlan, 
  ESGPlanItem,
  AuditRecord,
  SchemeType,
  Jurisdiction,
  Priority,
  ApplicationStatus,
  FileType,
  FileStatus,
  TemplateCategory,
  CompanySize,
  PlanStatus,
  ESGPillar,
  ItemStatus,
  AuditType,
  AuditStatus,
  Role
} from '@prisma/client'

// Extended types with relations
export type SchemeWithRelations = Scheme & {
  category?: Category | null
  files?: File[]
  userSchemes?: UserScheme[]
  linksFrom?: Array<{ to: Scheme; relation: string }>
  linksTo?: Array<{ from: Scheme; relation: string }>
}

export type UserSchemeWithRelations = UserScheme & {
  scheme: Scheme
  user: User
}

export type ESGPlanWithItems = ESGPlan & {
  items: (ESGPlanItem & { scheme?: Scheme | null })[]
  user: User
}

export type FileWithRelations = File & {
  scheme?: Scheme | null
  uploadedBy?: User | null
}

// Form input types
export type SchemeFormData = {
  name: string
  shortCode?: string
  type: SchemeType
  categoryId?: string
  authority?: string
  jurisdiction: Jurisdiction
  pillar?: string
  tags: string
  description?: string
  benefits?: string
  eligibility?: string
  documentsUrl?: string
  priority: Priority
}

export type CompanyInput = {
  name: string
  sector: string
  size: CompanySize
  state: string
  udyamNumber?: string
  turnoverCr?: number
  compliance: string[]
}

export type RecommendationResult = {
  mandatory: string[]
  optional: string[]
  schemes: string[]
  actions30: string[]
  actions60: string[]
  actions90: string[]
  timeline: Array<{
    phase: string
    duration: string
    items: string[]
  }>
}

// API response types
export type ApiResponse<T = any> = {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export type PaginatedResponse<T> = ApiResponse<{
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}>

// Filter types
export type SchemeFilters = {
  search?: string
  type?: SchemeType[]
  jurisdiction?: Jurisdiction[]
  pillar?: string[]
  category?: string[]
  priority?: Priority[]
  isActive?: boolean
}

export type LegalDocFilters = {
  search?: string
  jurisdiction?: Jurisdiction[]
  sector?: string[]
  locationTag?: string[]
  isActive?: boolean
}

// Dashboard stats
export type DashboardStats = {
  totalSchemes: number
  activeSchemes: number
  userFavorites: number
  appliedSchemes: number
  completedSchemes: number
  activePlans: number
  pendingAudits: number
  recentActivity: Array<{
    id: string
    type: 'scheme' | 'plan' | 'audit' | 'document'
    title: string
    timestamp: Date
    status?: string
  }>
}

export {
  type Scheme,
  type Category,
  type LegalDoc,
  type Template,
  type File,
  type User,
  type UserScheme,
  type ESGPlan,
  type ESGPlanItem,
  type AuditRecord,
  SchemeType,
  Jurisdiction,
  Priority,
  ApplicationStatus,
  FileType,
  FileStatus,
  TemplateCategory,
  CompanySize,
  PlanStatus,
  ESGPillar,
  ItemStatus,
  AuditType,
  AuditStatus,
  Role
}