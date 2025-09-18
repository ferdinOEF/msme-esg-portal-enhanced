// app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Upload, 
  Download, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Eye,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  FileText,
  BarChart3
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface AdminStats {
  totalSchemes: number;
  activeSchemes: number;
  totalLegalDocs: number;
  totalTemplates: number;
  totalUsers: number;
  totalApplications: number;
  recentActivity: ActivityItem[];
}

interface ActivityItem {
  id: string;
  action: string;
  entity: string;
  entityName: string;
  timestamp: string;
  user: string;
}

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [status, setStatus] = useState<string | undefined>();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);

  // Load admin stats
  useEffect(() => {
    if (adminKey) {
      loadAdminStats();
    }
  }, [adminKey]);

  const loadAdminStats = async () => {
    try {
      const response = await fetch('/api/admin/stats', {
        headers: { 'x-admin-key': adminKey }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleSchemeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const data = Object.fromEntries(formData.entries());
      
      // Process arrays
      const processedData = {
        ...data,
        sector: (data.sector as string).split(',').map(s => s.trim()).filter(Boolean),
        companySize: (data.companySize as string).split(',').map(s => s.trim()).filter(Boolean),
        tags: (data.tags as string).split(',').map(s => s.trim()).filter(Boolean),
        categories: (data.categories as string).split(',').map(s => s.trim()).filter(Boolean),
        pillarE: data.pillarE === 'on',
        pillarS: data.pillarS === 'on',
        pillarG: data.pillarG === 'on',
        applicationFee: data.applicationFee ? Number(data.applicationFee) : null,
        maxBenefitAmount: data.maxBenefitAmount ? Number(data.maxBenefitAmount) : null,
        processingDays: data.processingDays ? Number(data.processingDays) : null,
        priority: Number(data.priority) || 5,
      };

      const response = await fetch('/api/schemes', {
        method: 'POST',
        headers: {
          'x-admin-key': adminKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(processedData)
      });

      if (response.ok) {
        setStatus('✅ Scheme saved successfully');
        (e.target as HTMLFormElement).reset();
        loadAdminStats();
      } else {
        const error = await response.json();
        setStatus(`❌ Error: ${error.error || 'Failed to save scheme'}`);
      }
    } catch (error) {
      setStatus('❌ Error saving scheme');
    } finally {
      setLoading(false);
    }
  };

  const handleLegalDocSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const data = Object.fromEntries(formData.entries());
      
      const processedData = {
        ...data,
        pillarE: data.pillarE === 'on',
        pillarS: data.pillarS === 'on',
        pillarG: data.pillarG === 'on',
        effectiveFrom: data.effectiveFrom ? new Date(data.effectiveFrom as string).toISOString() : null,
        tags: (data.tags as string).split(',').map(s => s.trim()).filter(Boolean).join(',')
      };

      const response = await fetch('/api/legal', {
        method: 'POST',
        headers: {
          'x-admin-key': adminKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(processedData)
      });

      if (response.ok) {
        setStatus('✅ Legal document saved successfully');
        (e.target as HTMLFormElement).reset();
        loadAdminStats();
      } else {
        const error = await response.json();
        setStatus(`❌ Error: ${error.error || 'Failed to save legal document'}`);
      }
    } catch (error) {
      setStatus('❌ Error saving legal document');
    } finally {
      setLoading(false);
    }
  };

  const TabButton = ({ id, label, icon: Icon }: { id: string; label: string; icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        activeTab === id 
          ? 'bg-blue-100 text-blue-700 border border-blue-200' 
          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Admin Key:</label>
            <input
              type="password"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-48"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="Enter admin key"
            />
          </div>
          {adminKey && stats && (
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <CheckCircle size={16} />
              Authenticated
            </div>
          )}
        </div>
      </div>

      {status && (
        <div className={`p-3 rounded-lg text-sm ${
          status.includes('✅') 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {status}
        </div>
      )}

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <FileText size={16} className="text-blue-600" />
              <span className="text-sm text-gray-600">Schemes</span>
            </div>
            <div className="text-2xl font-bold">{stats.totalSchemes}</div>
            <div className="text-xs text-green-600">{stats.activeSchemes} active</div>
          </div>
          
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle size={16} className="text-orange-600" />
              <span className="text-sm text-gray-600">Legal Docs</span>
            </div>
            <div className="text-2xl font-bold">{stats.totalLegalDocs}</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <FileText size={16} className="text-purple-600" />
              <span className="text-sm text-gray-600">Templates</span>
            </div>
            <div className="text-2xl font-bold">{stats.totalTemplates}</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <Users size={16} className="text-green-600" />
              <span className="text-sm text-gray-600">Users</span>
            </div>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 size={16} className="text-indigo-600" />
              <span className="text-sm text-gray-600">Applications</span>
            </div>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <Clock size={16} className="text-gray-600" />
              <span className="text-sm text-gray-600">Recent Activity</span>
            </div>
            <div className="text-2xl font-bold">{stats.recentActivity.length}</div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
        <TabButton id="overview" label="Overview" icon={BarChart3} />
        <TabButton id="schemes" label="Add Scheme" icon={Plus} />
        <TabButton id="legal" label="Add Legal Doc" icon={FileText} />
        <TabButton id="bulk" label="Bulk Import" icon={Upload} />
        <TabButton id="manage" label="Manage Content" icon={Edit} />
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && stats && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {stats.recentActivity.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="text-sm font-medium">{activity.action}</div>
                        <div className="text-xs text-gray-600">{activity.entityName}</div>
                      </div>
                      <div className="text-xs text-gray-500">{activity.timestamp}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setActiveTab('schemes')}
                    className="p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Plus size={20} className="text-blue-600 mb-2" />
                    <div className="font-medium">Add Scheme</div>
                    <div className="text-xs text-gray-600">Create new scheme</div>
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab('legal')}
                    className="p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <FileText size={20} className="text-orange-600 mb-2" />
                    <div className="font-medium">Add Legal Doc</div>
                    <div className="text-xs text-gray-600">Add regulation/guideline</div>
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab('bulk')}
                    className="p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Upload size={20} className="text-green-600 mb-2" />
                    <div className="font-medium">Bulk Import</div>
                    <div className="text-xs text-gray-600">Import CSV data</div>
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab('manage')}
                    className="p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Edit size={20} className="text-purple-600 mb-2" />
                    <div className="font-medium">Manage Content</div>
                    <div className="text-xs text-gray-600">Edit existing content</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'schemes' && (
          <form onSubmit={handleSchemeSubmit} className="bg-white p-6 rounded-xl border border-gray-200 space-y-4">
            <h2 className="text-xl font-semibold mb-4">Add / Update Scheme</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input name="name" className="w-full border border-gray-300 rounded-lg p-2" required />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Short Code</label>
                <input name="shortCode" className="w-full border border-gray-300 rounded-lg p-2" placeholder="ZED, TEAM, etc." />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Type *</label>
                <select name="type" className="w-full border border-gray-300 rounded-lg p-2" required>
                  <option value="SCHEME">Scheme</option>
                  <option value="CERTIFICATION">Certification</option>
                  <option value="FRAMEWORK">Framework</option>
                  <option value="SUBSIDY">Subsidy</option>
                  <option value="GRANT">Grant</option>
                  <option value="LOAN">Loan</option>
                  <option value="INCENTIVE">Incentive</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Authority *</label>
                <input name="authority" className="w-full border border-gray-300 rounded-lg p-2" placeholder="MSME Ministry, SIDBI, etc." required />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Jurisdiction</label>
                <select name="jurisdiction" className="w-full border border-gray-300 rounded-lg p-2">
                  <option value="Central">Central</option>
                  <option value="State">State</option>
                  <option value="Global">Global</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description *</label>
              <textarea name="description" rows={3} className="w-full border border-gray-300 rounded-lg p-2" required></textarea>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Benefits</label>
                <textarea name="benefits" rows={3} className="w-full border border-gray-300 rounded-lg p-2"></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Eligibility</label>
                <textarea name="eligibility" rows={3} className="w-full border border-gray-300 rounded-lg p-2"></textarea>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">ESG Pillars</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="pillarE" className="rounded" />
                  <span>Environmental (E)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="pillarS" className="rounded" />
                  <span>Social (S)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="pillarG" className="rounded" />
                  <span>Governance (G)</span>
                </label>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Sectors (comma-separated)</label>
                <input name="sector" className="w-full border border-gray-300 rounded-lg p-2" placeholder="Manufacturing, Services, Food Processing" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Company Sizes (comma-separated)</label>
                <input name="companySize" className="w-full border border-gray-300 rounded-lg p-2" placeholder="MICRO, SMALL, MEDIUM" />
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Application Fee (₹)</label>
                <input name="applicationFee" type="number" min="0" className="w-full border border-gray-300 rounded-lg p-2" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Max Benefit (₹)</label>
                <input name="maxBenefitAmount" type="number" min="0" className="w-full border border-gray-300 rounded-lg p-2" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Processing Days</label>
                <input name="processingDays" type="number" min="1" className="w-full border border-gray-300 rounded-lg p-2" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Priority (1-10)</label>
                <input name="priority" type="number" min="1" max="10" defaultValue="5" className="w-full border border-gray-300 rounded-lg p-2" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Application Deadline</label>
                <input name="applicationDeadline" type="datetime-local" className="w-full border border-gray-300 rounded-lg p-2" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Documents URL</label>
                <input name="documentsUrl" type="url" className="w-full border border-gray-300 rounded-lg p-2" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
                <input name="tags" className="w-full border border-gray-300 rounded-lg p-2" placeholder="environment, quality, finance" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Categories (comma-separated)</label>
                <input name="categories" className="w-full border border-gray-300 rounded-lg p-2" placeholder="Environmental Compliance, Quality Certification" />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading || !adminKey}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Saving...' : 'Save Scheme'}
            </button>
          </form>
        )}

        {activeTab === 'legal' && (
          <form onSubmit={handleLegalDocSubmit} className="bg-white p-6 rounded-xl border border-gray-200 space-y-4">
            <h2 className="text-xl font-semibold mb-4">Add Legal / Regulatory Document</h2>
            
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input name="title" className="w-full border border-gray-300 rounded-lg p-2" required />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Jurisdiction *</label>
                <select name="jurisdiction" className="w-full border border-gray-300 rounded-lg p-2" required>
                  <option value="Central">Central</option>
                  <option value="State">State</option>
                  <option value="Local">Local</option>
                  <option value="International">International</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Document Type</label>
                <select name="documentType" className="w-full border border-gray-300 rounded-lg p-2">
                  <option value="REGULATION">Regulation</option>
                  <option value="GUIDELINE">Guideline</option>
                  <option value="NOTIFICATION">Notification</option>
                  <option value="CIRCULAR">Circular</option>
                  <option value="AMENDMENT">Amendment</option>
                  <option value="JUDGMENT">Judgment</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Severity</label>
                <select name="severity" className="w-full border border-gray-300 rounded-lg p-2">
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Sector</label>
                <input name="sector" className="w-full border border-gray-300 rounded-lg p-2" placeholder="Manufacturing, Services, All" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Location Tag</label>
                <input name="locationTag" className="w-full border border-gray-300 rounded-lg p-2" placeholder="Goa, Maharashtra, etc." />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Summary</label>
              <textarea name="summary" rows={4} className="w-full border border-gray-300 rounded-lg p-2"></textarea>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">URL</label>
                <input name="url" type="url" className="w-full border border-gray-300 rounded-lg p-2" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Effective From</label>
                <input name="effectiveFrom" type="date" className="w-full border border-gray-300 rounded-lg p-2" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">ESG Relevance</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="pillarE" className="rounded" />
                  <span>Environmental (E)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="pillarS" className="rounded" />
                  <span>Social (S)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="pillarG" className="rounded" />
                  <span>Governance (G)</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
              <input name="tags" className="w-full border border-gray-300 rounded-lg p-2" placeholder="environment, compliance, CPCB" />
            </div>

            <button 
              type="submit" 
              disabled={loading || !adminKey}
              className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Saving...' : 'Save Legal Document'}
            </button>
          </form>
        )}

        {activeTab === 'bulk' && (
          <div className="space-y-6">
            <BulkImportSection 
              title="Bulk Import Schemes (CSV)" 
              endpoint="/api/import/schemes" 
              adminKey={adminKey}
              sampleData="name,shortCode,type,authority,jurisdiction,pillar,sector,tags,description,benefits,eligibility,documentsUrl&#10;ZED Certification,ZED,CERTIFICATION,MSME Ministry,Central,E|S|G,Manufacturing|Services,quality|sustainability,Zero defect zero effect certification,Subsidized certification,Registered MSMEs,https://zed.msme.gov.in"
            />
            
            <BulkImportSection 
              title="Bulk Import Legal Documents (CSV)" 
              endpoint="/api/import/legal" 
              adminKey={adminKey}
              sampleData="title,jurisdiction,sector,locationTag,summary,url,documentType,severity,pillarE,pillarS,pillarG,tags&#10;CPCB Guidelines 2024,Central,Manufacturing,,Updated pollution control guidelines,https://cpcb.nic.in,GUIDELINE,HIGH,true,false,true,environment|compliance|CPCB"
            />
          </div>
        )}

        {activeTab === 'manage' && (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Content Management</h2>
            <p className="text-gray-600 mb-4">Search, edit, and manage existing schemes, legal documents, and templates.</p>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg" 
                    placeholder="Search content..."
                  />
                </div>
              </div>
              <select className="border border-gray-300 rounded-lg px-3 py-2">
                <option value="">All Types</option>
                <option value="schemes">Schemes</option>
                <option value="legal">Legal Documents</option>
                <option value="templates">Templates</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter size={16} />
                Filters
              </button>
            </div>

            {/* Content List Placeholder */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium">ZED Certification</h3>
                  <p className="text-sm text-gray-600">MSME Ministry • Certification • 45 applications</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-600 hover:text-blue-600 rounded">
                    <Eye size={16} />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-green-600 rounded">
                    <Edit size={16} />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-red-600 rounded">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium">CPCB Environmental Guidelines</h3>
                  <p className="text-sm text-gray-600">Central • Legal Document • High Severity</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-600 hover:text-blue-600 rounded">
                    <Eye size={16} />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-green-600 rounded">
                    <Edit size={16} />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-red-600 rounded">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="text-center py-8 text-gray-500">
                <FileText size={48} className="mx-auto mb-2 opacity-50" />
                <p>Content management features coming soon...</p>
                <p className="text-sm">Advanced search, bulk editing, and content analytics</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface BulkImportSectionProps {
  title: string;
  endpoint: string;
  adminKey: string;
  sampleData: string;
}

function BulkImportSection({ title, endpoint, adminKey, sampleData }: BulkImportSectionProps) {
  const [csvData, setCsvData] = useState('');
  const [importStatus, setImportStatus] = useState<string | undefined>();
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = async () => {
    if (!csvData.trim() || !adminKey) return;

    setIsImporting(true);
    setImportStatus(undefined);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'x-admin-key': adminKey,
          'Content-Type': 'text/plain'
        },
        body: csvData
      });

      if (response.ok) {
        const result = await response.json();
        setImportStatus(`✅ Successfully imported ${result.count} records`);
        setCsvData('');
      } else {
        const error = await response.json();
        setImportStatus(`❌ Import failed: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      setImportStatus('❌ Import failed: Network error');
    } finally {
      setIsImporting(false);
    }
  };

  const loadSample = () => {
    setCsvData(sampleData.replace(/&#10;/g, '\n'));
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <button 
          onClick={loadSample}
          className="text-sm text-blue-600 hover:text-blue-700 underline"
        >
          Load Sample Data
        </button>
      </div>
      
      <p className="text-sm text-gray-600 mb-3">
        Paste CSV data with headers. Use pipe (|) or comma (,) to separate multiple values in array fields.
      </p>
      
      <textarea
        value={csvData}
        onChange={(e) => setCsvData(e.target.value)}
        className="w-full h-32 border border-gray-300 rounded-lg p-3 font-mono text-sm"
        placeholder="Paste your CSV data here..."
      />
      
      {importStatus && (
        <div className={`mt-3 p-3 rounded-lg text-sm ${
          importStatus.includes('✅') 
            ? 'bg-green-50 text-green-800 border border-green-200'
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {importStatus}
        </div>
      )}
      
      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={handleImport}
          disabled={!csvData.trim() || !adminKey || isImporting}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Upload size={16} />
          {isImporting ? 'Importing...' : 'Import Data'}
        </button>
        
        <button 
          onClick={() => setCsvData('')}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Clear
        </button>
        
        <div className="text-sm text-gray-500">
          {csvData.trim() ? `${csvData.split('\n').length - 1} rows ready` : 'No data'}
        </div>
      </div>
    </div>
  );
}