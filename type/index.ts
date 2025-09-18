// types/index.ts

import { 
  Scheme, 
  LegalDoc, 
  Template, 
  User, 
  Company, 
  ESGPlan, 
  ESGPlanItem,
  UserFavorite,
  UserApplication,
  File,
  SchemeLink,
  AuditLog
} from '@prisma/client';

// Enhanced types with relations
export interface SchemeWithRelations extends Scheme {
  tags: { name: string }[];
  categories: { name: string }[];
  creator?: { name: string; email: string };
  linksFrom: SchemeLink[];
  linksTo: SchemeLink[];
  files: File[];
  favorites: UserFavorite[];
  applications: UserApplication[];
  _count: {
    favorites: number;
    applications: number;
    files: number;
  };
}

export interface ESGPlanWithRelations extends ESGPlan {
  company: Company;
  creator: User;
  assignee?: User;
  items: ESGPlanItemWithScheme[];
}

export interface ESGPlanItemWithScheme extends ESGPlanItem {
  scheme?: Scheme;
}

export interface UserWithRelations extends User {
  favorites: (UserFavorite & { scheme: Scheme })[];
  applications: (UserApplication & { scheme: Scheme; company: Company })[];
  createdSchemes: Scheme[];
}

export interface CompanyWithPlans extends Company {
  esgPlans: ESGPlan[];
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  filters?: Record<string, any>;
}

export interface SchemesResponse extends PaginatedResponse<SchemeWithRelations> {}

export interface AdminStats {
  totalSchemes: number;
  activeSchemes: number;
  totalLegalDocs: number;
  totalTemplates: number;
  totalUsers: number;
  totalApplications: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  entityName: string;
  timestamp: string;
  user: string;
  ipAddress?: string;
}

// Form Types
export interface SchemeFormData {
  name: string;
  shortCode?: string;
  type: SchemeType;
  authority: string;
  jurisdiction: string;
  description: string;
  benefits?: string;
  eligibility?: string;
  documentsUrl?: string;
  sector: string[];
  companySize: CompanySize[];
  pillarE: boolean;
  pillarS: boolean;
  pillarG: boolean;
  applicationDeadline?: string;
  processingDays?: number;
  applicationFee?: number;
  maxBenefitAmount?: number;
  priority: number;
  tags: string[];
  categories: string[];
}

export interface LegalDocFormData {
  title: string;
  jurisdiction: string;
  sector?: string;
  locationTag?: string;
  summary?: string;
  url?: string;
  documentType: DocumentType;
  severity: Severity;
  effectiveFrom?: string;
  pillarE: boolean;
  pillarS: boolean;
  pillarG: boolean;
  tags: string;
}

export interface CompanyFormData {
  name: string;
  udyamNumber?: string;
  sector: string;
  size: CompanySize;
  state: string;
  city?: string;
  address?: string;
  turnoverCr?: number;
  employees?: number;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface ESGPlanFormData {
  title: string;
  description?: string;
  companyId: string;
  assignedTo?: string;
  startDate: string;
  targetDate: string;
  status: PlanStatus;
}

export interface ESGPlanItemFormData {
  title: string;
  description?: string;
  schemeId?: string;
  dueDate?: string;
  priority: Priority;
  status: ItemStatus;
}

// Filter and Search Types
export interface SchemeFilters {
  search?: string;
  type?: SchemeType;
  jurisdiction?: string;
  sector?: string;
  companySize?: CompanySize;
  pillars?: ('E' | 'S' | 'G')[];
  tags?: string[];
  categories?: string[];
  sortBy?: 'priority' | 'popularity' | 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface LegalDocFilters {
  search?: string;
  jurisdiction?: string;
  sector?: string;
  documentType?: DocumentType;
  severity?: Severity;
  pillars?: ('E' | 'S' | 'G')[];
  locationTag?: string;
}

// Recommendation Types
export interface RecommendationInput {
  sector: string;
  size: CompanySize;
  state?: string;
  udyam?: string;
  turnoverCr?: number;
  compliance: string[];
}

export interface RecommendationOutput {
  mandatory: string[];
  optional: string[];
  schemes: string[];
  actions30: string[];
  actions60: string[];
  actions90: string[];
  priority: number;
  estimatedTimeline: number;
  estimatedCost?: number;
}

// Dashboard and Analytics Types
export interface DashboardStats {
  totalCompanies: number;
  activePlans: number;
  completedPlans: number;
  overdueTasks: number;
  upcomingDeadlines: number;
  favoriteSchemes: number;
}

export interface ComplianceStatus {
  environmental: {
    completed: number;
    pending: number;
    overdue: number;
  };
  social: {
    completed: number;
    pending: number;
    overdue: number;
  };
  governance: {
    completed: number;
    pending: number;
    overdue: number;
  };
}

// Utility Types
export type SchemeType = 'SCHEME' | 'CERTIFICATION' | 'FRAMEWORK' | 'SUBSIDY' | 'GRANT' | 'LOAN' | 'INCENTIVE';
export type CompanySize = 'MICRO' | 'SMALL' | 'MEDIUM' | 'LARGE';
export type DocumentType = 'REGULATION' | 'GUIDELINE' | 'NOTIFICATION' | 'CIRCULAR' | 'AMENDMENT' | 'JUDGMENT';
export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type PlanStatus = 'DRAFT' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
export type ItemStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED' | 'CANCELLED';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type ApplicationStatus = 'INTERESTED' | 'APPLIED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'CONSULTANT' | 'VIEWER';

// Component Props Types
export interface SchemeCardProps {
  scheme: SchemeWithRelations;
  userId?: string;
  onFavoriteChange?: (schemeId: string, isFavorite: boolean) => void;
  onApplicationUpdate?: (schemeId: string, status: ApplicationStatus) => void;
}

export interface FilterBarProps {
  filters: SchemeFilters;
  onFiltersChange: (filters: SchemeFilters) => void;
  availableTags: string[];
  availableCategories: string[];
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPageNumbers?: boolean;
}

// State Management Types (for Zustand stores)
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

export interface SchemeState {
  schemes: SchemeWithRelations[];
  favorites: string[];
  applications: Record<string, ApplicationStatus>;
  filters: SchemeFilters;
  isLoading: boolean;
  error: string | null;
  fetchSchemes: (filters?: SchemeFilters) => Promise<void>;
  toggleFavorite: (schemeId: string) => Promise<void>;
  updateApplication: (schemeId: string, status: ApplicationStatus) => Promise<void>;
  updateFilters: (filters: Partial<SchemeFilters>) => void;
  clearError: () => void;
}

export interface CompanyState {
  companies: Company[];
  currentCompany: CompanyWithPlans | null;
  isLoading: boolean;
  error: string | null;
  fetchCompanies: () => Promise<void>;
  createCompany: (data: CompanyFormData) => Promise<Company>;
  updateCompany: (id: string, data: Partial<CompanyFormData>) => Promise<Company>;
  setCurrentCompany: (company: CompanyWithPlans) => void;
  clearError: () => void;
}

export interface PlanState {
  plans: ESGPlanWithRelations[];
  currentPlan: ESGPlanWithRelations | null;
  isLoading: boolean;
  error: string | null;
  fetchPlans: (companyId?: string) => Promise<void>;
  createPlan: (data: ESGPlanFormData) => Promise<ESGPlan>;
  updatePlan: (id: string, data: Partial<ESGPlanFormData>) => Promise<ESGPlan>;
  addPlanItem: (planId: string, data: ESGPlanItemFormData) => Promise<ESGPlanItem>;
  updatePlanItem: (itemId: string, data: Partial<ESGPlanItemFormData>) => Promise<ESGPlanItem>;
  deletePlanItem: (itemId: string) => Promise<void>;
  setCurrentPlan: (plan: ESGPlanWithRelations) => void;
  clearError: () => void;
}

// Export all types for easy importing
export type {
  Scheme,
  LegalDoc,
  Template,
  User,
  Company,
  ESGPlan,
  ESGPlanItem,
  UserFavorite,
  UserApplication,
  File,
  SchemeLink,
  AuditLog
};