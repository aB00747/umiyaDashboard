import { useState, useEffect } from 'react';
import { reportsAPI } from '../../api/reports';
import { formatCurrency } from '../../utils/format';
import { classNames } from '../../utils/format';
import toast from 'react-hot-toast';
import { BarChart2, ShoppingCart, Package, TrendingUp } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
const TABS = ['sales', 'inventory'];

export default function Reports() {
  const [tab, setTab] = useState('sales');
  const [salesData, setSalesData] = useState(null);
  const [inventoryData, setInventoryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [salesRes, invRes] = await Promise.all([
          reportsAPI.sales(),
          reportsAPI.inventory(),
        ]);
        setSalesData(salesRes.data);
        setInventoryData(invRes.data);
      } catch {
        toast.error('Failed to load reports');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" /></div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={classNames(
              'flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md transition-colors capitalize',
              tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            )}
          >
            {t === 'sales' ? <ShoppingCart className="h-4 w-4" /> : <Package className="h-4 w-4" />}
            {t}
          </button>
        ))}
      </div>

      {tab === 'sales' && salesData && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard label="Total Revenue" value={formatCurrency(salesData.total_revenue)} icon={TrendingUp} color="bg-green-500" />
            <StatCard label="Total Orders" value={salesData.total_orders} icon={ShoppingCart} color="bg-indigo-500" />
            <StatCard label="Avg Order Value" value={formatCurrency(salesData.avg_order_value)} icon={BarChart2} color="bg-blue-500" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders by Status</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData.by_status}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Status</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={salesData.by_payment} cx="50%" cy="50%" outerRadius={100} dataKey="count" label={({ payment_status, count }) => `${payment_status}: ${count}`}>
                    {(salesData.by_payment || []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Customers</h3>
              <div className="space-y-2">
                {(salesData.top_customers || []).map((c, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
                    <div>
                      <span className="font-medium text-gray-900">{c.customer__first_name} {c.customer__last_name}</span>
                      {c.customer__company_name && <span className="text-gray-500 ml-1">({c.customer__company_name})</span>}
                    </div>
                    <div className="text-right">
                      <span className="font-medium text-gray-900">{formatCurrency(c.total)}</span>
                      <span className="text-xs text-gray-500 ml-2">({c.order_count} orders)</span>
                    </div>
                  </div>
                ))}
                {(!salesData.top_customers || salesData.top_customers.length === 0) && (
                  <p className="text-sm text-gray-500 text-center py-4">No data yet</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
              <div className="space-y-2">
                {(salesData.top_products || []).map((p, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
                    <span className="font-medium text-gray-900">{p.chemical__chemical_name}</span>
                    <div className="text-right">
                      <span className="font-medium text-gray-900">{formatCurrency(p.total_value)}</span>
                      <span className="text-xs text-gray-500 ml-2">(Qty: {p.total_qty})</span>
                    </div>
                  </div>
                ))}
                {(!salesData.top_products || salesData.top_products.length === 0) && (
                  <p className="text-sm text-gray-500 text-center py-4">No data yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'inventory' && inventoryData && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <StatCard label="Total Chemicals" value={inventoryData.total_chemicals} icon={Package} color="bg-indigo-500" />
            <StatCard label="Categories" value={inventoryData.total_categories} icon={BarChart2} color="bg-blue-500" />
            <StatCard label="Low Stock" value={inventoryData.low_stock_count} icon={TrendingUp} color="bg-red-500" />
            <StatCard label="Inventory Value" value={formatCurrency(inventoryData.total_inventory_value)} icon={TrendingUp} color="bg-green-500" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">By Category</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={inventoryData.by_category}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category__name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#4f46e5" name="Items" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="total_quantity" fill="#10b981" name="Total Qty" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Low Stock Items</h3>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {(inventoryData.low_stock_items || []).map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-red-50 rounded-lg text-sm border border-red-100">
                    <div>
                      <p className="font-medium text-gray-900">{item.chemical_name}</p>
                      <p className="text-xs text-gray-500">{item.chemical_code} - Min: {item.min_quantity} {item.unit}</p>
                    </div>
                    <span className="font-bold text-red-600">{item.quantity} {item.unit}</span>
                  </div>
                ))}
                {(!inventoryData.low_stock_items || inventoryData.low_stock_items.length === 0) && (
                  <p className="text-sm text-gray-500 text-center py-4">All stock levels healthy</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
      <div className={`${color} p-3 rounded-lg`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
