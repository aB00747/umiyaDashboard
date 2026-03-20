import { useState, useEffect, useCallback } from 'react';
import { deliveriesAPI } from '../../api/deliveries';
import { ordersAPI } from '../../api/orders';
import { formatDate, classNames } from '../../utils/format';
import toast from 'react-hot-toast';
import { Plus, X, Edit2, Truck } from 'lucide-react';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  in_transit: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export default function Deliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ order: '', delivery_date: '', address: '', vehicle_number: '', driver_name: '', driver_phone: '', status: 'pending', tracking_number: '', notes: '' });
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');

  const loadDeliveries = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const { data } = await deliveriesAPI.list(params);
      setDeliveries(data.results || data || []);
    } catch {
      toast.error('Failed to load deliveries');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { loadDeliveries(); }, [loadDeliveries]);

  async function openDialog(delivery = null) {
    try {
      const { data } = await ordersAPI.list({ page_size: 200 });
      setOrders(data.results || data || []);
    } catch { /* ignore */ }
    if (delivery) {
      setForm({ ...delivery });
      setEditId(delivery.id);
    } else {
      setForm({ order: '', delivery_date: '', address: '', vehicle_number: '', driver_name: '', driver_phone: '', status: 'pending', tracking_number: '', notes: '' });
      setEditId(null);
    }
    setDialogOpen(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await deliveriesAPI.update(editId, form);
        toast.success('Delivery updated');
      } else {
        await deliveriesAPI.create(form);
        toast.success('Delivery created');
      }
      setDialogOpen(false);
      loadDeliveries();
    } catch (err) {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Deliveries</h1>
        <button onClick={() => openDialog()} className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">
          <Plus className="h-4 w-4" /> Add Delivery
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in_transit">In Transit</option>
          <option value="delivered">Delivered</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {deliveries.map((d) => (
          <div key={d.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                <span className="font-semibold text-gray-900 dark:text-white">{d.order_number || `Order #${d.order}`}</span>
              </div>
              <span className={classNames('px-2 py-0.5 rounded-full text-xs font-medium', statusColors[d.status])}>{d.status.replace('_', ' ')}</span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              {d.tracking_number && <p>Tracking: <span className="font-medium text-gray-900 dark:text-white">{d.tracking_number}</span></p>}
              {d.driver_name && <p>Driver: {d.driver_name} {d.driver_phone && `(${d.driver_phone})`}</p>}
              {d.vehicle_number && <p>Vehicle: {d.vehicle_number}</p>}
              {d.delivery_date && <p>Date: {formatDate(d.delivery_date)}</p>}
            </div>
            <button onClick={() => openDialog(d)} className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1">
              <Edit2 className="h-3.5 w-3.5" /> Edit
            </button>
          </div>
        ))}
        {deliveries.length === 0 && (
          <div className="col-span-full text-center py-10 text-gray-500 dark:text-gray-400">No deliveries found</div>
        )}
      </div>

      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto m-4">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{editId ? 'Edit' : 'Add'} Delivery</h3>
              <button onClick={() => setDialogOpen(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"><X className="h-5 w-5 text-gray-500 dark:text-gray-400" /></button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Order *</label>
                <select required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })}>
                  <option value="">Select Order</option>
                  {orders.map((o) => <option key={o.id} value={o.id}>{o.order_number} - {o.customer_name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Delivery Date</label>
                  <input type="date" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={form.delivery_date || ''} onChange={(e) => setForm({ ...form, delivery_date: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    <option value="pending">Pending</option>
                    <option value="in_transit">In Transit</option>
                    <option value="delivered">Delivered</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vehicle Number</label><input type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={form.vehicle_number} onChange={(e) => setForm({ ...form, vehicle_number: e.target.value })} /></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tracking Number</label><input type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={form.tracking_number} onChange={(e) => setForm({ ...form, tracking_number: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Driver Name</label><input type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={form.driver_name} onChange={(e) => setForm({ ...form, driver_name: e.target.value })} /></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Driver Phone</label><input type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={form.driver_phone} onChange={(e) => setForm({ ...form, driver_phone: e.target.value })} /></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label><textarea className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setDialogOpen(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">Cancel</button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50">{saving ? 'Saving...' : editId ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
