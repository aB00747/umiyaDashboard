import { useState, useEffect } from 'react';
import { categoriesAPI, chemicalsAPI, vendorsAPI, stockEntriesAPI } from '../../api/inventory';
import { formatCurrency } from '../../utils/format';
import { classNames } from '../../utils/format';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, Package, Layers, Truck, ClipboardList, AlertTriangle } from 'lucide-react';

const TABS = [
  { key: 'chemicals', label: 'Chemicals', icon: Package },
  { key: 'categories', label: 'Categories', icon: Layers },
  { key: 'vendors', label: 'Vendors', icon: Truck },
  { key: 'stock', label: 'Stock Entries', icon: ClipboardList },
];

export default function Inventory() {
  const [tab, setTab] = useState('chemicals');
  const [chemicals, setChemicals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [stockEntries, setStockEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [form, setForm] = useState({});
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const [catRes, chemRes, vendRes, stockRes] = await Promise.all([
        categoriesAPI.list(),
        chemicalsAPI.list({ page_size: 100 }),
        vendorsAPI.list({ page_size: 100 }),
        stockEntriesAPI.list({ page_size: 100 }),
      ]);
      setCategories(catRes.data.results || catRes.data || []);
      setChemicals(chemRes.data.results || chemRes.data || []);
      setVendors(vendRes.data.results || vendRes.data || []);
      setStockEntries(stockRes.data.results || stockRes.data || []);
    } catch {
      toast.error('Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  }

  function openDialog(type, item = null) {
    setDialogType(type);
    setEditId(item?.id || null);
    if (type === 'chemical') {
      setForm(item || { chemical_name: '', chemical_code: '', category: '', description: '', unit: 'KG', quantity: 0, min_quantity: 0, purchase_price: 0, selling_price: 0, gst_percentage: 18 });
    } else if (type === 'category') {
      setForm(item || { name: '', description: '' });
    } else if (type === 'vendor') {
      setForm(item || { vendor_name: '', contact_person: '', phone: '', email: '', address: '', gstin: '' });
    } else if (type === 'stock') {
      setForm(item || { chemical: '', entry_type: 'purchase', quantity: 0, rate: 0, vendor: '', reference_note: '' });
    }
    setDialogOpen(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const api = { chemical: chemicalsAPI, category: categoriesAPI, vendor: vendorsAPI, stock: stockEntriesAPI }[dialogType];
      if (editId) {
        await api.update(editId, form);
        toast.success('Updated successfully');
      } else {
        await api.create(form);
        toast.success('Created successfully');
      }
      setDialogOpen(false);
      loadAll();
    } catch (err) {
      toast.error(err.response?.data ? Object.values(err.response.data).flat().join(', ') : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(type, id) {
    if (!confirm('Delete this item?')) return;
    try {
      const api = { chemicals: chemicalsAPI, categories: categoriesAPI, vendors: vendorsAPI, stock: stockEntriesAPI }[type];
      await api.delete(id);
      toast.success('Deleted');
      loadAll();
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
        <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
        <button
          onClick={() => openDialog(tab === 'stock' ? 'stock' : tab === 'chemicals' ? 'chemical' : tab === 'categories' ? 'category' : 'vendor')}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" /> Add {tab === 'stock' ? 'Stock Entry' : tab.slice(0, -1)}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={classNames(
              'flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md transition-colors',
              tab === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            )}
          >
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {tab === 'chemicals' && (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Code</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Category</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">Qty</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">Price</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {chemicals.map((c) => (
                <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {c.is_low_stock && <AlertTriangle className="h-4 w-4 text-red-500" />}
                      <span className="font-medium text-gray-900">{c.chemical_name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{c.chemical_code}</td>
                  <td className="py-3 px-4 text-gray-600">{c.category_name || '-'}</td>
                  <td className="py-3 px-4 text-right text-gray-900">{c.quantity} {c.unit}</td>
                  <td className="py-3 px-4 text-right text-gray-900">{formatCurrency(c.selling_price)}</td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => openDialog('chemical', c)} className="p-1.5 text-gray-400 hover:text-indigo-600 rounded"><Edit2 className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete('chemicals', c.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
              {chemicals.length === 0 && <tr><td colSpan={6} className="py-10 text-center text-gray-500">No chemicals</td></tr>}
            </tbody>
          </table>
        )}

        {tab === 'categories' && (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Description</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{c.name}</td>
                  <td className="py-3 px-4 text-gray-600">{c.description || '-'}</td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => openDialog('category', c)} className="p-1.5 text-gray-400 hover:text-indigo-600 rounded"><Edit2 className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete('categories', c.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && <tr><td colSpan={3} className="py-10 text-center text-gray-500">No categories</td></tr>}
            </tbody>
          </table>
        )}

        {tab === 'vendors' && (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Contact</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Phone</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">GSTIN</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((v) => (
                <tr key={v.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{v.vendor_name}</td>
                  <td className="py-3 px-4 text-gray-600">{v.contact_person || '-'}</td>
                  <td className="py-3 px-4 text-gray-600">{v.phone || '-'}</td>
                  <td className="py-3 px-4 text-gray-600">{v.gstin || '-'}</td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => openDialog('vendor', v)} className="p-1.5 text-gray-400 hover:text-indigo-600 rounded"><Edit2 className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete('vendors', v.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
              {vendors.length === 0 && <tr><td colSpan={5} className="py-10 text-center text-gray-500">No vendors</td></tr>}
            </tbody>
          </table>
        )}

        {tab === 'stock' && (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Chemical</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Type</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">Qty</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">Rate</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Vendor</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stockEntries.map((s) => (
                <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{s.chemical_name}</td>
                  <td className="py-3 px-4">
                    <span className={classNames('px-2 py-0.5 rounded-full text-xs font-medium',
                      s.entry_type === 'purchase' ? 'bg-green-50 text-green-700' :
                      s.entry_type === 'sale' ? 'bg-blue-50 text-blue-700' : 'bg-yellow-50 text-yellow-700'
                    )}>{s.entry_type}</span>
                  </td>
                  <td className="py-3 px-4 text-right text-gray-900">{s.quantity}</td>
                  <td className="py-3 px-4 text-right text-gray-900">{s.rate ? formatCurrency(s.rate) : '-'}</td>
                  <td className="py-3 px-4 text-gray-600">{s.vendor_name || '-'}</td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => handleDelete('stock', s.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
              {stockEntries.length === 0 && <tr><td colSpan={6} className="py-10 text-center text-gray-500">No stock entries</td></tr>}
            </tbody>
          </table>
        )}
      </div>

      {/* Dialog */}
      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto m-4">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editId ? 'Edit' : 'Add'} {dialogType.charAt(0).toUpperCase() + dialogType.slice(1)}
              </h3>
              <button onClick={() => setDialogOpen(false)} className="p-1 hover:bg-gray-100 rounded"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              {dialogType === 'chemical' && (
                <>
                  <Field label="Chemical Name *" value={form.chemical_name} onChange={(v) => setForm({ ...form, chemical_name: v })} required />
                  <Field label="Code *" value={form.chemical_code} onChange={(v) => setForm({ ...form, chemical_code: v })} required />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" value={form.category || ''} onChange={(e) => setForm({ ...form, category: e.target.value || null })}>
                      <option value="">None</option>
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <Field label="Unit" value={form.unit} onChange={(v) => setForm({ ...form, unit: v })} />
                    <Field label="Quantity" type="number" value={form.quantity} onChange={(v) => setForm({ ...form, quantity: v })} />
                    <Field label="Min Qty" type="number" value={form.min_quantity} onChange={(v) => setForm({ ...form, min_quantity: v })} />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <Field label="Purchase Price" type="number" value={form.purchase_price} onChange={(v) => setForm({ ...form, purchase_price: v })} />
                    <Field label="Selling Price" type="number" value={form.selling_price} onChange={(v) => setForm({ ...form, selling_price: v })} />
                    <Field label="GST %" type="number" value={form.gst_percentage} onChange={(v) => setForm({ ...form, gst_percentage: v })} />
                  </div>
                </>
              )}
              {dialogType === 'category' && (
                <>
                  <Field label="Name *" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
                  <Field label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
                </>
              )}
              {dialogType === 'vendor' && (
                <>
                  <Field label="Vendor Name *" value={form.vendor_name} onChange={(v) => setForm({ ...form, vendor_name: v })} required />
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Contact Person" value={form.contact_person} onChange={(v) => setForm({ ...form, contact_person: v })} />
                    <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
                  </div>
                  <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
                  <Field label="Address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} />
                  <Field label="GSTIN" value={form.gstin} onChange={(v) => setForm({ ...form, gstin: v })} />
                </>
              )}
              {dialogType === 'stock' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chemical *</label>
                    <select required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" value={form.chemical} onChange={(e) => setForm({ ...form, chemical: e.target.value })}>
                      <option value="">Select Chemical</option>
                      {chemicals.map((c) => <option key={c.id} value={c.id}>{c.chemical_name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                    <select required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" value={form.entry_type} onChange={(e) => setForm({ ...form, entry_type: e.target.value })}>
                      <option value="purchase">Purchase</option>
                      <option value="sale">Sale</option>
                      <option value="adjustment">Adjustment</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Quantity *" type="number" value={form.quantity} onChange={(v) => setForm({ ...form, quantity: v })} required />
                    <Field label="Rate" type="number" value={form.rate} onChange={(v) => setForm({ ...form, rate: v })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" value={form.vendor || ''} onChange={(e) => setForm({ ...form, vendor: e.target.value || null })}>
                      <option value="">None</option>
                      {vendors.map((v) => <option key={v.id} value={v.id}>{v.vendor_name}</option>)}
                    </select>
                  </div>
                  <Field label="Reference Note" value={form.reference_note} onChange={(v) => setForm({ ...form, reference_note: v })} />
                </>
              )}
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setDialogOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50">
                  {saving ? 'Saving...' : editId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', required = false }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input type={type} required={required} step={type === 'number' ? 'any' : undefined}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
