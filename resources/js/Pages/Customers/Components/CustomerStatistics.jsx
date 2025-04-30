// Pages/Customers/Components/CustomerStatistics.jsx
import React from 'react';
import { UserGroupIcon, CurrencyRupeeIcon, TruckIcon, ChartBarIcon } from '@heroicons/react/24/outline';

export default function CustomerStatistics({ customers }) {
    // Calculate statistics from customer data
    const calculateStatistics = () => {
        const totalCustomers = customers.length;
        
        const activeCustomers = customers.filter(c => c.status === 'Active').length;
        const activePercent = totalCustomers > 0 
            ? Math.round((activeCustomers / totalCustomers) * 100) 
            : 0;
        
        // Calculate total revenue across all customers
        const totalRevenue = customers.reduce((sum, customer) => {
            // Convert currency string to number (remove ₹ and commas)
            const revenue = parseFloat(customer.revenue.replace(/[₹,]/g, ''));
            return sum + revenue;
        }, 0);
        
        // Format revenue as Indian currency
        const formattedRevenue = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(totalRevenue);
        
        // Calculate total orders across all customers
        const totalOrders = customers.reduce((sum, customer) => sum + customer.orders, 0);
        
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