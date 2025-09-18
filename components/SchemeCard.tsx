// components/SchemeCard.tsx
'use client';

import { useState, useCallback } from "react";
import { 
  Download, 
  Upload, 
  Star, 
  CheckCircle, 
  ChevronDown, 
  ChevronUp,
  Calendar,
  Clock,
  IndianRupee,
  Users,
  Building,
  AlertCircle,
  ExternalLink,
  Heart,
  FileText,
  Target
} from "lucide-react";
import { formatDistanceToNow, format } from 'date-fns';

interface SchemeStats {
  favoriteCount: number;
  applicationCount: number;
  fileCount: number;
}

interface Scheme {
  id: string;
  name: string;
  shortCode?: string | null;
  type: string;
  authority: string;
  jurisdiction: string;
  pillar?: string | null;
  pillarE: boolean;
  pillarS: boolean;
  pillarG: boolean;
  description: string;
  benefits?: string | null;
  eligibility?: string | null;
  documentsUrl?: string | null;
  applicationDeadline?: string | null;
  processingDays?: number | null;
  applicationFee?: number | null;
  maxBenefitAmount?: number | null;
  priority: number;
  sector: string[];
  companySize: string[];
  tags: string[];
  categories: string[];
  stats?: SchemeStats;
  createdAt: string;
  updatedAt: string;
}

interface SchemeCardProps {
  scheme: Scheme;
  userId?: string;
  onFavoriteChange?: (schemeId: string, isFavorite: boolean) => void;
  onApplicationUpdate?: (schemeId: string, status: string) => void;
}

export default function SchemeCard({ 
  scheme, 
  userId,
  onFavoriteChange,
  onApplicationUpdate 
}: SchemeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<string>('INTERESTED');
  const [isLoading, setIsLoading] = useState(false);

  const handleFavoriteToggle = useCallback(async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/users/favorites', {
        method: isFavorite ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schemeId: scheme.id })
      });

      if (response.ok) {
        const newFavoriteState = !isFavorite;
        setIsFavorite(newFavoriteState);
        onFavoriteChange?.(scheme.id, newFavoriteState);
      }
    } catch (error) {
      console.error('Error updating favorite:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, scheme.id, isFavorite, onFavoriteChange]);

  const handleApplicationUpdate = useCallback(async (newStatus: string) => {
    if (!userId) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/users/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          schemeId: scheme.id, 
          status: newStatus 
        })
      });

      if (response.ok) {
        setApplicationStatus(newStatus);
        onApplicationUpdate?.(scheme.id, newStatus);
      }
    } catch (error) {
      console.error('Error updating application:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, scheme.id, onApplicationUpdate]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // TODO: Implement file upload to API
    console.log(`Uploading ${files.length} file(s) for scheme ${scheme.id}`);
    e.target.value = ''; // Reset input
  }, [scheme.id]);

  const getPillarBadges = () => {
    const pillars = [];
    if (scheme.pillarE) pillars.push('E');
    if (scheme.pillarS) pillars.push('S');
    if (scheme.pillarG) pillars.push('G');
    return pillars;
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return 'bg-red-100 text-red-800';
    if (priority >= 6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'SCHEME': 'bg-blue-100 text-blue-800',
      'CERTIFICATION': 'bg-purple-100 text-purple-800',
      'FRAMEWORK': 'bg-indigo-100 text-indigo-800',
      'SUBSIDY': 'bg-green-100 text-green-800',
      'GRANT': 'bg-emerald-100 text-emerald-800',
      'LOAN': 'bg-orange-100 text-orange-800',
      'INCENTIVE': 'bg-pink-100 text-pink-800',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount}`;
  };

  const isDeadlineApproaching = scheme.applicationDeadline ? 
    new Date(scheme.applicationDeadline) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : false;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 truncate">
                {scheme.name}
              </h3>
              {scheme.shortCode && (
                <span className="text-sm text-gray-500 font-medium">
                  ({scheme.shortCode})
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <span className={`px-2 py-1 rounded-full ${getTypeColor(scheme.type)}`}>
                {scheme.type}
              </span>
              <span>•</span>
              <span>{scheme.authority}</span>
              <span>•</span>
              <span>{scheme.jurisdiction}</span>
            </div>

            {/* ESG Pillars */}
            <div className="flex items-center gap-1 mb-2">
              {getPillarBadges().map(pillar => (
                <span 
                  key={pillar}
                  className="w-6 h-6 rounded-full bg-green-100 text-green-800 text-xs font-bold flex items-center justify-center"
                  title={`${pillar === 'E' ? 'Environmental' : pillar === 'S' ? 'Social' : 'Governance'} focus`}
                >
                  {pillar}
                </span>
              ))}
              <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${getPriorityColor(scheme.priority)}`}>
                Priority {scheme.priority}/10
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          {userId && (
            <div className="flex flex-col gap-1">
              <button
                onClick={handleFavoriteToggle}
                disabled={isLoading}
                className={`p-2 rounded-lg transition-colors ${
                  isFavorite 
                    ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
              
              <select
                value={applicationStatus}
                onChange={(e) => handleApplicationUpdate(e.target.value)}
                disabled={isLoading}
                className="text-xs border rounded px-2 py-1"
                title="Application status"
              >
                <option value="INTERESTED">Interested</option>
                <option value="APPLIED">Applied</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          )}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
          {scheme.applicationDeadline && (
            <div className={`flex items-center gap-1 text-xs ${isDeadlineApproaching ? 'text-red-600' : 'text-gray-600'}`}>
              <Calendar size={12} />
              <span>Due: {format(new Date(scheme.applicationDeadline), 'MMM dd')}</span>
              {isDeadlineApproaching && <AlertCircle size={12} />}
            </div>
          )}
          
          {scheme.processingDays && (
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <Clock size={12} />
              <span>{scheme.processingDays} days</span>
            </div>
          )}
          
          {scheme.maxBenefitAmount && (
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <IndianRupee size={12} />
              <span>Up to {formatCurrency(scheme.maxBenefitAmount)}</span>
            </div>
          )}
          
          {scheme.stats && (
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <Target size={12} />
              <span>{scheme.stats.applicationCount} applied</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-sm text-gray-700 line-clamp-2 mb-3">
          {scheme.description}
        </p>

        {/* Sectors and Company Sizes */}
        <div className="flex flex-wrap gap-1 mb-3">
          {scheme.sector.slice(0, 3).map(sector => (
            <span key={sector} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
              {sector}
            </span>
          ))}
          {scheme.sector.length > 3 && (
            <span className="text-xs text-gray-500">+{scheme.sector.length - 3} more</span>
          )}
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {scheme.companySize.map(size => (
            <span key={size} className="text-xs bg-gray-50 text-gray-700 px-2 py-1 rounded">
              <Users size={10} className="inline mr-1" />
              {size}
            </span>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {scheme.tags.slice(0, 4).map(tag => (
            <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              #{tag}
            </span>
          ))}
          {scheme.tags.length > 4 && (
            <span className="text-xs text-gray-500">+{scheme.tags.length - 4} more</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mb-3">
          {scheme.documentsUrl && (
            <a
              href={scheme.documentsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <ExternalLink size={12} />
              Official Docs
            </a>
          )}
          
          <button className="inline-flex items-center gap-1 text-xs px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
            <Download size={12} />
            Download ({scheme.stats?.fileCount || 0})
          </button>
          
          <label className="inline-flex items-center gap-1 text-xs px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer">
            <Upload size={12} />
            Upload Docs
            <input 
              type="file" 
              multiple 
              className="hidden" 
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png"
            />
          </label>
        </div>

        {/* Expand/Collapse */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-1 text-xs text-gray-600 hover:text-gray-800 py-2 border-t border-gray-100"
        >
          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {isExpanded ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50">
          <div className="grid md:grid-cols-2 gap-4 pt-4">
            <div>
              <h4 className="font-medium text-sm text-gray-900 mb-2">Benefits</h4>
              <p className="text-xs text-gray-700">{scheme.benefits || 'Not specified'}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-gray-900 mb-2">Eligibility</h4>
              <p className="text-xs text-gray-700">{scheme.eligibility || 'Not specified'}</p>
            </div>
          </div>
          
          {(scheme.applicationFee !== null || scheme.applicationDeadline) && (
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              {scheme.applicationFee !== null && (
                <div>
                  <h4 className="font-medium text-sm text-gray-900 mb-1">Application Fee</h4>
                  <p className="text-xs text-gray-700">
                    {scheme.applicationFee === 0 ? 'Free' : formatCurrency(scheme.applicationFee)}
                  </p>
                </div>
              )}
              {scheme.applicationDeadline && (
                <div>
                  <h4 className="font-medium text-sm text-gray-900 mb-1">Application Deadline</h4>
                  <p className="text-xs text-gray-700">
                    {format(new Date(scheme.applicationDeadline), 'PPP')}
                    <span className="text-gray-500 ml-1">
                      ({formatDistanceToNow(new Date(scheme.applicationDeadline), { addSuffix: true })})
                    </span>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Categories */}
          {scheme.categories.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-sm text-gray-900 mb-2">Categories</h4>
              <div className="flex flex-wrap gap-1">
                {scheme.categories.map(category => (
                  <span key={category} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded">
                    {category}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          {scheme.stats && (
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold text-gray-900">{scheme.stats.favoriteCount}</div>
                  <div className="text-xs text-gray-500">Favorites</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900">{scheme.stats.applicationCount}</div>
                  <div className="text-xs text-gray-500">Applications</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900">{scheme.stats.fileCount}</div>
                  <div className="text-xs text-gray-500">Documents</div>
                </div>
              </div>
            </div>
          )}

          {/* Last Updated */}
          <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-500">
            Last updated: {formatDistanceToNow(new Date(scheme.updatedAt), { addSuffix: true })}
          </div>
        </div>
      )}
    </div>
  );
}