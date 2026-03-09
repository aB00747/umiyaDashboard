import { useState, useEffect } from 'react';
import { documentsAPI } from '../../api/documents';
import { formatDateTime, classNames } from '../../utils/format';
import toast from 'react-hot-toast';
import { Plus, X, Trash2, Upload, FileText, Download, File } from 'lucide-react';

const categoryColors = {
  invoice: 'bg-blue-50 text-blue-700',
  report: 'bg-green-50 text-green-700',
  certificate: 'bg-purple-50 text-purple-700',
  contract: 'bg-orange-50 text-orange-700',
  other: 'bg-gray-50 text-gray-700',
};

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({ title: '', category: 'other', description: '' });
  const [saving, setSaving] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => { loadDocuments(); }, []);

  async function loadDocuments() {
    setLoading(true);
    try {
      const params = {};
      if (categoryFilter) params.category = categoryFilter;
      const { data } = await documentsAPI.list(params);
      setDocuments(data.results || data || []);
    } catch {
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadDocuments(); }, [categoryFilter]);

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) return toast.error('Please select a file');
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', form.title || file.name);
      formData.append('category', form.category);
      formData.append('description', form.description);
      await documentsAPI.upload(formData);
      toast.success('Document uploaded');
      setUploadOpen(false);
      setFile(null);
      setForm({ title: '', category: 'other', description: '' });
      loadDocuments();
    } catch {
      toast.error('Upload failed');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this document?')) return;
    try {
      await documentsAPI.delete(id);
      toast.success('Document deleted');
      loadDocuments();
    } catch {
      toast.error('Delete failed');
    }
  }

  if (loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
        <button onClick={() => setUploadOpen(true)} className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">
          <Upload className="h-4 w-4" /> Upload
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="">All Categories</option>
          <option value="invoice">Invoice</option>
          <option value="report">Report</option>
          <option value="certificate">Certificate</option>
          <option value="contract">Contract</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <div key={doc.id} className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <FileText className="h-6 w-6 text-indigo-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{doc.title}</p>
                  <p className="text-xs text-gray-500">{formatDateTime(doc.created_at)}</p>
                </div>
              </div>
              <span className={classNames('px-2 py-0.5 rounded-full text-xs font-medium', categoryColors[doc.category] || categoryColors.other)}>
                {doc.category}
              </span>
            </div>
            {doc.description && <p className="text-sm text-gray-600">{doc.description}</p>}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">By: {doc.uploaded_by_name || 'Unknown'}</span>
              <div className="flex gap-1">
                {doc.file_url && (
                  <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded">
                    <Download className="h-4 w-4" />
                  </a>
                )}
                <button onClick={() => handleDelete(doc.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {documents.length === 0 && (
          <div className="col-span-full text-center py-10 text-gray-500">
            <File className="h-10 w-10 text-gray-300 mx-auto mb-2" />
            <p>No documents uploaded yet</p>
          </div>
        )}
      </div>

      {/* Upload Dialog */}
      {uploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md m-4">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Upload Document</h3>
              <button onClick={() => setUploadOpen(false)} className="p-1 hover:bg-gray-100 rounded"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleUpload} className="p-5 space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <input type="file" onChange={(e) => setFile(e.target.files[0])} className="text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Document title (optional)" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  <option value="invoice">Invoice</option>
                  <option value="report">Report</option>
                  <option value="certificate">Certificate</option>
                  <option value="contract">Contract</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setUploadOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saving || !file} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50">
                  {saving ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
