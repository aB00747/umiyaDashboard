import { useState, useEffect, useCallback } from 'react';
import { customersAPI } from '../../api/customers';
import { formatDate } from '../../utils/format';
import { classNames } from '../../utils/format';
import toast from 'react-hot-toast';
import {
  Plus, Search, Upload, Download, RefreshCw, Edit2, Trash2, X,
  ChevronLeft, ChevronRight, Eye, Users, UserCheck, UserX, Building2,
} from 'lucide-react';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ is_active: '', customer_type: '', page: 1 });
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [activeTab, setActiveTab] = useState('manual');
  const [importFile, setImportFile] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: filters.page, search };
      if (filters.is_active !== '') params.is_active = filters.is_active;
      if (filters.customer_type) params.customer_type = filters.customer_type;
      const { data } = await customersAPI.list(params);
      setCustomers(data.results || data);
      setTotalPages(Math.ceil((data.count || 0) / 20) || 1);
    } catch {
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  }, [filters, search]);

  useEffect(() => { loadCustomers(); }, [loadCustomers]);

  function emptyForm() {
    return {
      first_name: '', last_name: '', company_name: '', email: '', phone: '',
      alternate_phone: '', address_line1: '', address_line2: '', city: '', state: '',
      state_code: '', country: 'India', country_code: 'IN', pin_code: '',
      gstin: '', pan: '', customer_type: '', is_active: true,
    };
  }

  function openCreate() {
    setForm(emptyForm());
    setDialogMode('create');
    setActiveTab('manual');
    setDialogOpen(true);
  }

  function openEdit(customer) {
    setForm({ ...customer });
    setDialogMode('edit');
    setActiveTab('manual');
    setDialogOpen(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (dialogMode === 'create') {
        await customersAPI.create(form);
        toast.success('Customer created');
      } else {
        await customersAPI.update(form.id, form);
        toast.success('Customer updated');
      }
      setDialogOpen(false);
      loadCustomers();
    } catch (err) {
      const msg = err.response?.data;
      if (msg && typeof msg === 'object') {
        toast.error(Object.values(msg).flat().join(', '));
      } else {
        toast.error('Save failed');
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this customer?')) return;
    try {
      await customersAPI.delete(id);
      toast.success('Customer deleted');
      setSelected(null);
      loadCustomers();
    } catch {
      toast.error('Delete failed');
    }
  }

  async function handleImport() {
    if (!importFile) return;
    setSaving(true);
    try {
      const { data } = await customersAPI.import(importFile);
      toast.success(data.message || `${data.created} customers imported`);
      setDialogOpen(false);
      setImportFile(null);
      loadCustomers();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Import failed');
    } finally {
      setSaving(false);
    }
  }

  async function handleExport() {
    try {
      const { data } = await customersAPI.export();
      const url = window.URL.createObjectURL(new Blob([data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'customers.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error('Export failed');
    }
  }

  async function handleTemplateDownload() {
    try {
      const { data } = await customersAPI.exportTemplate('xlsx');
      const url = window.URL.createObjectURL(new Blob([data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'customer_template.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error('Download failed');
    }
  }

  const stats = {
    total: customers.length,
    active: customers.filter((c) => c.is_active).length,
    inactive: customers.filter((c) => !c.is_active).length,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <div className="flex items-center gap-2">
          <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="h-4 w-4" /> Export
          </button>
          <button onClick={openCreate} className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">
            <Plus className="h-4 w-4" /> Add Customer
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: stats.total, icon: Users, color: 'text-indigo-600 bg-indigo-50' },
          { label: 'Active', value: stats.active, icon: UserCheck, color: 'text-green-600 bg-green-50' },
          { label: 'Inactive', value: stats.inactive, icon: UserX, color: 'text-red-600 bg-red-50' },
          { label: 'Companies', value: customers.filter((c) => c.company_name).length, icon: Building2, color: 'text-blue-600 bg-blue-50' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-3">
            <div className={`p-2 rounded-lg ${s.color}`}><s.icon className="h-5 w-5" /></div>
            <div>
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className="text-lg font-bold text-gray-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setFilters({ ...filters, page: 1 }); }}
            />
          </div>
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={filters.is_active}
            onChange={(e) => setFilters({ ...filters, is_active: e.target.value, page: 1 })}
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={filters.customer_type}
            onChange={(e) => setFilters({ ...filters, customer_type: e.target.value, page: 1 })}
          >
            <option value="">All Types</option>
            <option value="Retail">Retail</option>
            <option value="Wholesale">Wholesale</option>
            <option value="Distributor">Distributor</option>
            <option value="Industrial">Industrial</option>
          </select>
          <button onClick={loadCustomers} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Company</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Phone</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">City</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="py-10 text-center"><div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600" /></td></tr>
              ) : customers.length === 0 ? (
                <tr><td colSpan={7} className="py-10 text-center text-gray-500">No customers found</td></tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer" onClick={() => setSelected(c)}>
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">{c.full_name}</p>
                      <p className="text-xs text-gray-500">{c.email}</p>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{c.company_name || '-'}</td>
                    <td className="py-3 px-4 text-gray-600">{c.phone || '-'}</td>
                    <td className="py-3 px-4 text-gray-600">{c.city || '-'}</td>
                    <td className="py-3 px-4">
                      {c.customer_type && (
                        <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">{c.customer_type}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={classNames('inline-flex px-2 py-0.5 rounded-full text-xs font-medium', c.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700')}>
                        {c.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button onClick={(e) => { e.stopPropagation(); openEdit(c); }} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(c.id); }} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <p className="text-sm text-gray-500">Page {filters.page} of {totalPages}</p>
          <div className="flex gap-2">
            <button disabled={filters.page <= 1} onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
              className="p-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button disabled={filters.page >= totalPages} onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
              className="p-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl border-l border-gray-200 z-40 overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Customer Details</h3>
            <button onClick={() => setSelected(null)} className="p-1 hover:bg-gray-100 rounded"><X className="h-5 w-5" /></button>
          </div>
          <div className="p-4 space-y-4">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mb-2">
                <span className="text-xl font-bold text-indigo-600">{selected.first_name?.[0]}{selected.last_name?.[0]}</span>
              </div>
              <h4 className="font-semibold text-gray-900">{selected.full_name}</h4>
              <p className="text-sm text-gray-500">{selected.company_name}</p>
            </div>
            {[
              ['Email', selected.email],
              ['Phone', selected.phone],
              ['Type', selected.customer_type],
              ['City', selected.city],
              ['State', selected.state],
              ['GSTIN', selected.gstin],
              ['PAN', selected.pan],
              ['Created', formatDate(selected.created_at)],
            ].map(([label, val]) => val && (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-gray-500">{label}</span>
                <span className="text-gray-900 font-medium">{val}</span>
              </div>
            ))}
            <div className="flex gap-2 pt-2">
              <button onClick={() => openEdit(selected)} className="flex-1 px-3 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">Edit</button>
              <button onClick={() => handleDelete(selected.id)} className="px-3 py-2 border border-red-300 text-red-600 text-sm rounded-lg hover:bg-red-50">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Dialog */}
      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {dialogMode === 'create' ? 'Add Customer' : 'Edit Customer'}
              </h3>
              <button onClick={() => setDialogOpen(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tabs */}
            {dialogMode === 'create' && (
              <div className="flex border-b border-gray-200 px-5">
                {['manual', 'excel'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={classNames(
                      'px-4 py-3 text-sm font-medium border-b-2 -mb-px capitalize',
                      activeTab === tab ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                    )}
                  >
                    {tab === 'excel' ? 'Excel Import' : 'Manual Entry'}
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'manual' ? (
              <form onSubmit={handleSave} className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="First Name *" value={form.first_name} onChange={(v) => setForm({ ...form, first_name: v })} required />
                  <FormField label="Last Name" value={form.last_name} onChange={(v) => setForm({ ...form, last_name: v })} />
                  <FormField label="Company Name" value={form.company_name} onChange={(v) => setForm({ ...form, company_name: v })} />
                  <FormField label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
                  <FormField label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
                  <FormField label="Alt. Phone" value={form.alternate_phone} onChange={(v) => setForm({ ...form, alternate_phone: v })} />
                </div>
                <FormField label="Address Line 1" value={form.address_line1} onChange={(v) => setForm({ ...form, address_line1: v })} />
                <FormField label="Address Line 2" value={form.address_line2} onChange={(v) => setForm({ ...form, address_line2: v })} />
                <div className="grid grid-cols-3 gap-4">
                  <FormField label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
                  <FormField label="State" value={form.state} onChange={(v) => setForm({ ...form, state: v })} />
                  <FormField label="PIN Code" value={form.pin_code} onChange={(v) => setForm({ ...form, pin_code: v })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="GSTIN" value={form.gstin} onChange={(v) => setForm({ ...form, gstin: v })} />
                  <FormField label="PAN" value={form.pan} onChange={(v) => setForm({ ...form, pan: v })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer Type</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={form.customer_type}
                      onChange={(e) => setForm({ ...form, customer_type: e.target.value })}
                    >
                      <option value="">Select Type</option>
                      <option value="Retail">Retail</option>
                      <option value="Wholesale">Wholesale</option>
                      <option value="Distributor">Distributor</option>
                      <option value="Industrial">Industrial</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      checked={form.is_active}
                      onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label className="text-sm text-gray-700">Active</label>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setDialogOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
                  <button type="submit" disabled={saving} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50">
                    {saving ? 'Saving...' : dialogMode === 'create' ? 'Create' : 'Update'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-5 space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-2">Upload Excel or CSV file</p>
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={(e) => setImportFile(e.target.files[0])}
                    className="text-sm"
                  />
                </div>
                <button
                  onClick={handleTemplateDownload}
                  className="text-sm text-indigo-600 hover:text-indigo-800 underline"
                >
                  Download template file
                </button>
                <div className="flex justify-end gap-3">
                  <button onClick={() => setDialogOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
                  <button
                    onClick={handleImport}
                    disabled={!importFile || saving}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {saving ? 'Importing...' : 'Import'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function FormField({ label, value, onChange, type = 'text', required = false }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
