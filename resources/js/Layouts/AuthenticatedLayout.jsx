import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AuthenticatedLayout({ children, currentPage = "dashboard" }) {
    const [activeTab, setActiveTab] = useState(currentPage);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    console.log("activeTab", activeTab);
    
    // When currentPage prop changes, update activeTab
    useEffect(() => {
        setActiveTab(currentPage);
    }, [currentPage]);
    
    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                sidebarOpen={sidebarOpen} 
                setSidebarOpen={setSidebarOpen} 
            />
            
            <div className={`flex-1 ${sidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300 ease-in-out`}>
                <Header 
                    activeTab={activeTab} 
                    notifications={4} 
                />
                
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}