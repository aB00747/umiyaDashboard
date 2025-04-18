// Pages/Dashboard/Index.jsx
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
// import StatsCard from './StatsCard';

export default function Pricing({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            currentPage="pricing"
        >
            <Head title="Pricing" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* <StatsCard /> */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">  HJIIIIII</div>
                    {/* Other dashboard components */}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}