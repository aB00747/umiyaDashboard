// Pages/Customers/Components/CustomerStatistics.jsx
import React from 'react';
import { UserGroupIcon, CurrencyRupeeIcon, TruckIcon, ChartBarIcon } from '@heroicons/react/24/outline';

export default function CustomerStatistics({ customers }) {
    // Calculate statistics from customer data
    const calculateStatistics = () => {
        if (!customers || customers.length === 0) {
            return {
                totalCustomers: 0,
                activeCustomers: 0,
                activePercent: 0,
                totalRevenue: '₹0',
                totalOrders: 0,
                avgOrderValue: '₹0'
            };
        }

        const totalCustomers = customers.length;
        
        // Handle different status field formats (status, is_active)
        const activeCustomers = customers.filter(c => {
            if (c.status !== undefined) {
                return c.status === 'Active' || c.status === 'active';
            }
            if (c.is_active !== undefined) {
                return c.is_active === true || c.is_active === 1;
            }
            return false;
        }).length;
        
        const activePercent = totalCustomers > 0 
            ? Math.round((activeCustomers / totalCustomers) * 100) 
            : 0;
        
        // Calculate total revenue across all customers
        const totalRevenue = customers.reduce((sum, customer) => {
            // Handle different revenue field formats
            const revenueField = customer.revenue || customer.total_revenue || '0';
            
            if (typeof revenueField === 'number') {
                return sum + revenueField;
            }
  
            if (typeof revenueField === 'string') {
                // Convert currency string to number (remove ₹, commas, and other currency symbols)
                const revenue = parseFloat(revenueField.replace(/[₹,$,]/g, '') || '0');
                return sum + (isNaN(revenue) ? 0 : revenue);
            }
            
            return sum;
        }, 0);
        
        // Format revenue as Indian currency
        const formattedRevenue = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(totalRevenue);
        
        // Calculate total orders across all customers
        const totalOrders = customers.reduce((sum, customer) => {
            const ordersCount = customer.orders || customer.total_orders || customer.order_count || 0;
            return sum + (typeof ordersCount === 'number' ? ordersCount : parseInt(ordersCount) || 0);
        }, 0);
        
        // Calculate average order value
        const avgOrderValue = totalOrders > 0 
            ? new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0
              }).format(totalRevenue / totalOrders)
            : '₹0';
        
        return {
            totalCustomers,
            activeCustomers,
            activePercent,
            totalRevenue: formattedRevenue,
            totalOrders,
            avgOrderValue
        };
    };
    
    const stats = calculateStatistics();
    
    const statItems = [
        {
            name: 'Total Customers',
            value: stats.totalCustomers,
            icon: UserGroupIcon,
            change: `${stats.activePercent}% active`,
            changeType: 'neutral'
        },
        {
            name: 'Total Revenue',
            value: stats.totalRevenue,
            icon: CurrencyRupeeIcon,
            change: 'All time',
            changeType: 'neutral'
        },
        {
            name: 'Total Orders',
            value: stats.totalOrders,
            icon: TruckIcon,
            change: 'All time',
            changeType: 'neutral'
        },
        {
            name: 'Avg. Order Value',
            value: stats.avgOrderValue,
            icon: ChartBarIcon,
            change: 'Per order',
            changeType: 'neutral'
        }
    ];
    
    return (
        <div>
            <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {statItems.map((item) => (
                    <div key={item.name} className="relative overflow-hidden bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">
                        <dt>
                            <div className="absolute bg-indigo-500 rounded-md p-3">
                                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                            </div>
                            <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
                        </dt>
                        <dd className="ml-16 flex items-baseline">
                            <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
                            <p
                                className={`ml-2 flex items-baseline text-sm ${
                                    item.changeType === 'increase' 
                                        ? 'text-green-600' 
                                        : item.changeType === 'decrease'
                                        ? 'text-red-600'
                                        : 'text-gray-500'
                                }`}
                            >
                                {item.change}
                            </p>
                        </dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}