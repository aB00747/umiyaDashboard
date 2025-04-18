// Pages/Dashboard/Index.jsx
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
// import StatsCard from './StatsCard';

export default function Customers({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            currentPage="customers"
        >
            <Head title="customers" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* <StatsCard /> */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">  Customers</div>
                    {/* Other dashboard components */}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}