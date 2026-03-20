import { useState, useEffect, useCallback } from 'react';
import { ordersAPI } from '../../api/orders';
import { customersAPI } from '../../api/customers';
import { chemicalsAPI } from '../../api/inventory';
import { formatCurrency, formatDate, classNames } from '../../utils/format';
import toast from 'react-hot-toast';
import { Plus, X, Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  processing: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
  shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

const paymentColors = {
  unpaid: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  partial: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  paid: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  refunded: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', payment_status: '', page: 1 });
  const [totalPages, setTotalPages] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewOrder, setViewOrder] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [chemicals, setChemicals] = useState([]);
  const [form, setForm] = useState({ customer: '', order_date: new Date().toISOString().slice(0, 10), expected_delivery_date: '', notes: '', items: [{ chemical: '', quantity: 1, unit_price: 0 }] });
  const [saving, setSaving] = useState(false);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: filters.page };
      if (filters.status) params.status = filters.status;
      if (filters.payment_status) params.payment_status = filters.payment_status;
      const { data } = await ordersAPI.list(params);
      setOrders(data.results || data);
      setTotalPages(Math.ceil((data.count || 0) / 20) || 1);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  async function openCreate() {
    try {
      const [custRes, chemRes] = await Promise.all([
        customersAPI.list({ page_size: 200 }),
        chemicalsAPI.list({ page_size: 200 }),
      ]);
      setCustomers(custRes.data.results || custRes.data || []);
      setChemicals(chemRes.data.results || chemRes.data || []);
      setForm({ customer: '', order_date: new Date().toISOString().slice(0, 10), expected_delivery_date: '', notes: '', discount_amount: 0, items: [{ chemical: '', quantity: 1, unit_price: 0 }] });
      setDialogOpen(true);
    } catch {
      toast.error('Failed to load form data');
    }
  }

  async function viewDetails(id) {
    try {
      const { data } = await ordersAPI.get(id);
      setViewOrder(data);
    } catch {
      toast.error('Failed to load order');
    }
  }

  function addItem() {
    setForm({ ...form, items: [...form.items, { chemical: '', quantity: 1, unit_price: 0 }] });
  }

  function removeItem(i) {
    setForm({ ...form, items: form.items.filter((_, idx) => idx !== i) });
  }

  function updateItem(i, field, value) {
    const items = [...form.items];
    items[i] = { ...items[i], [field]: value };
    if (field === 'chemical') {
      const chem = chemicals.find((c) => c.id === parseInt(value));
      if (chem) items[i].unit_price = chem.selling_price;
    }
    setForm({ ...form, items });
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.items.some((i) => i.chemical)) {
      toast.error('Add at least one item');
      return;
    }
    setSaving(true);
    try {
      await ordersAPI.create({
        ...form,
        items: form.items.filter((i) => i.chemical).map((i) => ({
          chemical: parseInt(i.chemical),
          quantity: parseFloat(i.quantity),
          unit_price: parseFloat(i.unit_price),
        })),
      });
      toast.success('Order created');
      setDialogOpen(false);
      loadOrders();
    } catch (err) {
      toast.error(err.response?.data ? JSON.stringify(err.response.data) : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(id, status) {
    try {
      await ordersAPI.updateStatus(id, status);
      toast.success('Status updated');
      loadOrders();
      if (viewOrder?.id === id) viewDetails(id);
    } catch {
      toast.error('Update failed');
    }
  }

  const subtotal = form.items.reduce((sum, i) => sum + (parseFloat(i.quantity) || 0) * (parseFloat(i.unit_price) || 0), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Orders</h1>
        <button onClick={openCreate} className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">
          <Plus className="h-4 w-4" /> Create Order
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 flex flex-wrap gap-3">
        <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}>
          <option value="">All Status</option>
          {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={filters.payment_status} onChange={(e) => setFilters({ ...filters, payment_status: e.target.value, page: 1 })}>
          <option value="">All Payment</option>
          {['unpaid', 'partial', 'paid', 'refunded'].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Order #</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Customer</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Date</th>
              <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Amount</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Status</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Payment</th>
              <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="py-10 text-center"><div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600" /></td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={7} className="py-10 text-center text-gray-500 dark:text-gray-400">No orders found</td></tr>
            ) : orders.map((o) => (
              <tr key={o.id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{o.order_number}</td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{o.customer_name}</td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{formatDate(o.order_date)}</td>
                <td className="py-3 px-4 text-right font-medium text-gray-900 dark:text-white">{formatCurrency(o.total_amount)}</td>
                <td className="py-3 px-4"><span className={classNames('px-2 py-0.5 rounded-full text-xs font-medium', statusColors[o.status])}>{o.status}</span></td>
                <td className="py-3 px-4"><span className={classNames('px-2 py-0.5 rounded-full text-xs font-medium', paymentColors[o.payment_status])}>{o.payment_status}</span></td>
                <td className="py-3 px-4 text-right">
                  <button onClick={() => viewDetails(o.id)} className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded"><Eye className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Page {filters.page} of {totalPages}</p>
          <div className="flex gap-2">
            <button disabled={filters.page <= 1} onClick={() => setFilters({ ...filters, page: filters.page - 1 })} className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"><ChevronLeft className="h-4 w-4" /></button>
            <button disabled={filters.page >= totalPages} onClick={() => setFilters({ ...filters, page: filters.page + 1 })} className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      {/* View Detail Panel */}
      {viewOrder && (
        <div className="fixed inset-y-0 right-0 w-[480px] bg-white dark:bg-gray-800 shadow-xl border-l border-gray-200 dark:border-gray-700 z-40 overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">{viewOrder.order_number}</h3>
            <button onClick={() => setViewOrder(null)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"><X className="h-5 w-5 text-gray-500 dark:text-gray-400" /></button>
          </div>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-500 dark:text-gray-400">Customer:</span> <span className="font-medium text-gray-900 dark:text-white">{viewOrder.customer_name}</span></div>
              <div><span className="text-gray-500 dark:text-gray-400">Date:</span> <span className="font-medium text-gray-900 dark:text-white">{formatDate(viewOrder.order_date)}</span></div>
              <div><span className="text-gray-500 dark:text-gray-400">Total:</span> <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(viewOrder.total_amount)}</span></div>
              <div><span className="text-gray-500 dark:text-gray-400">Tax:</span> <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(viewOrder.tax_amount)}</span></div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Update Status</label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={viewOrder.status} onChange={(e) => updateStatus(viewOrder.id, e.target.value)}>
                {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Items</h4>
              <div className="space-y-2">
                {(viewOrder.items || []).map((item) => (
                  <div key={item.id} className="flex justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{item.chemical_name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Qty: {item.quantity} x {formatCurrency(item.unit_price)}</p>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(item.total_price)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Dialog */}
      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Create Order</h3>
              <button onClick={() => setDialogOpen(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"><X className="h-5 w-5 text-gray-500 dark:text-gray-400" /></button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="customer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Customer *</label>
                  <select required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })}>
                    <option value="">Select Customer</option>
                    {customers.map((c) => <option key={c.id} value={c.id}>{c.full_name} {c.company_name ? `(${c.company_name})` : ''}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="orderDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Order Date</label>
                  <input type="date" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={form.order_date} onChange={(e) => setForm({ ...form, order_date: e.target.value })} />
                </div>
                <div>
                  <label htmlFor="deliveryDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expected Delivery Date</label>
                  <input type="date" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={form.expected_delivery_date} onChange={(e) => setForm({ ...form, expected_delivery_date: e.target.value })} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Order Items</h4>
                  <button type="button" onClick={addItem} className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">+ Add Item</button>
                </div>
                <div className="space-y-2">
                  {form.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <select className="flex-1 px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={item.chemical} onChange={(e) => updateItem(i, 'chemical', e.target.value)}>
                        <option value="">Select Chemical</option>
                        {chemicals.map((c) => <option key={c.id} value={c.id}>{c.chemical_name} ({formatCurrency(c.selling_price)})</option>)}
                      </select>
                      <input type="number" min="0.01" step="any" placeholder="Qty" className="w-20 px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={item.quantity} onChange={(e) => updateItem(i, 'quantity', e.target.value)} />
                      <input type="number" min="0" step="any" placeholder="Price" className="w-28 px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={item.unit_price} onChange={(e) => updateItem(i, 'unit_price', e.target.value)} />
                      <span className="w-28 text-sm font-medium text-right text-gray-900 dark:text-white">{formatCurrency((parseFloat(item.quantity) || 0) * (parseFloat(item.unit_price) || 0))}</span>
                      {form.items.length > 1 && (
                        <button type="button" onClick={() => removeItem(i)} className="p-1 text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="text-right mt-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Subtotal: </span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(subtotal)}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                <textarea className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setDialogOpen(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">Cancel</button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50">
                  {saving ? 'Creating...' : 'Create Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
