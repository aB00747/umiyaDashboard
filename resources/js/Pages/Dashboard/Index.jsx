// resources/js/Pages/Dashboard.jsx
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import StatsCard from './Components/StatsCard';
import ProductionChart from './Components/ProductionChart';
import RevenueChart from './Components/RevenueChart';
import InventoryStatus from './Components/InventoryStatus';
import RecentOrders from './Components/RecentOrders';
import QualityMetrics from './Components/QualityMetrics';

export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            currentPage="dashboard"
        >
            <Head title="Dashboard" />
            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">Umiya Acid & Chemical Dashboard</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Welcome to your operational overview. View key metrics, production trends, and inventory status.
                        </p>
                    </div>
                    
                    {/* Stats Cards */}
                    <StatsCard />
                    
                    {/* Production Chart */}
                    <ProductionChart />
                    
                    {/* Recent Orders */}
                    <RecentOrders />
                    
                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
                        {/* Revenue Chart */}
                        <RevenueChart />
                        
                        {/* Quality Metrics */}
                        <QualityMetrics />
                    </div>
                    
                    {/* Inventory Status */}
                    <InventoryStatus />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}