// lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

// Utility function to combine classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency for Indian Rupees
export function formatCurrency(amount: number, compact = true): string {
  if (compact) {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount}`;
  }
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format dates consistently
export function formatDate(date: Date | string, format: 'short' | 'long' | 'relative' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  switch (format) {
    case 'short':
      return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    case 'long':
      return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    case 'relative':
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - d.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return d < now ? 'Yesterday' : 'Tomorrow';
      if (diffDays < 7) return `${diffDays} days ${d < now ? 'ago' : 'away'}`;
      if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ${d < now ? 'ago' : 'away'}`;
      if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ${d < now ? 'ago' : 'away'}`;
      return `${Math.ceil(diffDays / 365)} years ${d < now ? 'ago' : 'away'}`;
    default:
      return d.toISOString();
  }
}

// Get pillar color
export function getPillarColor(pillar: 'E' | 'S' | 'G'): string {
  switch (pillar) {
    case 'E': return 'bg-green-100 text-green-800';
    case 'S': return 'bg-blue-100 text-blue-800';
    case 'G': return 'bg-purple-100 text-purple-800';
  }
}

// Get priority color
export function getPriorityColor(priority: number | string): string {
  const p = typeof priority === 'string' ? priority.toUpperCase() : priority;
  
  if (typeof p === 'number') {
    if (p >= 8) return 'bg-red-100 text-red-800';
    if (p >= 6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  }
  
  switch (p) {
    case 'URGENT': return 'bg-red-100 text-red-800';
    case 'HIGH': return 'bg-orange-100 text-orange-800';
    case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
    case 'LOW': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

// Get status color
export function getStatusColor(status: string): string {
  switch (status.toUpperCase()) {
    case 'ACTIVE':
    case 'COMPLETED':
    case 'APPROVED':
      return 'bg-green-100 text-green-800';
    case 'PENDING':
    case 'IN_PROGRESS':
    case 'UNDER_REVIEW':
      return 'bg-yellow-100 text-yellow-800';
    case 'DRAFT':
    case 'INTERESTED':
      return 'bg-blue-100 text-blue-800';
    case 'BLOCKED':
    case 'ON_HOLD':
      return 'bg-orange-100 text-orange-800';
    case 'CANCELLED':
    case 'REJECTED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

// Validation schemas
export const emailSchema = z.string().email('Invalid email address');
export const phoneSchema = z.string().regex(/^[+]?[1-9][\d\s\-\(\)]{8,15}$/, 'Invalid phone number');
export const urlSchema = z.string().url('Invalid URL').or(z.literal(''));
export const udyamSchema = z.string().regex(/^UDYAM-[A-Z]{2}-\d{2}-\d{7}$/, 'Invalid Udyam number format');

// Generate slug from text
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Truncate text
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
}

// Deep merge objects
export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target };
  
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key] as T[Extract<keyof T, string>];
    }
  }
  
  return result;
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
}

// Generate random ID
export function generateId(length = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Parse CSV safely
export function parseCSV(csvText: string): string[][] {
  const lines = csvText.trim().split('\n');
  const result: string[][] = [];
  
  for (const line of lines) {
    const cells: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"' && (i === 0 || line[i - 1] === ',')) {
        inQuotes = true;
      } else if (char === '"' && inQuotes && (i === line.length - 1 || line[i + 1] === ',')) {
        inQuotes = false;
      } else if (char === ',' && !inQuotes) {
        cells.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    cells.push(current.trim());
    result.push(cells);
  }
  
  return result;
}

// Validate file type
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.some(type => {
    if (type.startsWith('.')) {
      return file.name.toLowerCase().endsWith(type.toLowerCase());
    }
    return file.type.toLowerCase().includes(type.toLowerCase());
  });
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Calculate ESG score
export function calculateESGScore(
  environmentalScore: number,
  socialScore: number,
  governanceScore: number,
  weights = { E: 0.4, S: 0.3, G: 0.3 }
): {
  overall: number;
  grade: string;
  breakdown: { E: number; S: number; G: number };
} {
  const overall = Math.round(
    environmentalScore * weights.E +
    socialScore * weights.S +
    governanceScore * weights.G
  );
  
  let grade = 'F';
  if (overall >= 90) grade = 'A+';
  else if (overall >= 80) grade = 'A';
  else if (overall >= 70) grade = 'B';
  else if (overall >= 60) grade = 'C';
  else if (overall >= 50) grade = 'D';
  
  return {
    overall,
    grade,
    breakdown: {
      E: Math.round(environmentalScore),
      S: Math.round(socialScore),
      G: Math.round(governanceScore)
    }
  };
}

// Extract tags from text
export function extractTags(text: string, separator = ','): string[] {
  return text
    .split(separator)
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0)
    .map(tag => tag.toLowerCase())
    .filter((tag, index, arr) => arr.indexOf(tag) === index); // Remove duplicates
}

// Generate color from string (for consistent colors)
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const colors = [
    'bg-red-100 text-red-800',
    'bg-yellow-100 text-yellow-800',
    'bg-green-100 text-green-800',
    'bg-blue-100 text-blue-800',
    'bg-indigo-100 text-indigo-800',
    'bg-purple-100 text-purple-800',
    'bg-pink-100 text-pink-800',
    'bg-orange-100 text-orange-800'
  ];
  
  return colors[Math.abs(hash) % colors.length];
}

// Search and highlight
export function highlightText(text: string, query: string): string {
  if (!query) return text;
  
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
}

// Progress calculation
export function calculateProgress(completed: number, total: number): {
  percentage: number;
  color: string;
  label: string;
} {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  
  let color = 'bg-gray-200';
  let label = 'Not started';
  
  if (percentage > 0) {
    label = `${percentage}% complete`;
    if (percentage >= 100) {
      color = 'bg-green-500';
      label = 'Complete';
    } else if (percentage >= 75) {
      color = 'bg-green-400';
    } else if (percentage >= 50) {
      color = 'bg-yellow-400';
    } else if (percentage >= 25) {
      color = 'bg-orange-400';
    } else {
      color = 'bg-red-400';
    }
  }
  
  return { percentage, color, label };
}

// API Error handler
export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export function handleAPIError(error: any): APIError {
  if (error instanceof APIError) return error;
  
  if (error.response) {
    return new APIError(
      error.response.data?.message || 'An error occurred',
      error.response.status,
      error.response.data?.code
    );
  }
  
  return new APIError('Network error', 500, 'NETWORK_ERROR');
}

// Local storage helpers
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  
  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  },
  
  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  }
};

// Async retry utility
export async function retry<T>(
  fn: () => Promise<T>,
  attempts = 3,
  delay = 1000
): Promise<T> {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === attempts - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Retry failed');
}

// Export all utility functions
export {
  clsx,
  twMerge
};