import { useState, useEffect } from "react";
// import { Toaster } from "react-hot-toast"; // Add this import
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AuthenticatedLayout({
    children,
    currentPage = "dashboard",
}) {
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

            {/* Add Toaster component here */}
            {/* <Toaster
                position="top-right"
                reverseOrder={false}
                gutter={8}
                containerClassName=""
                containerStyle={{}}
                toastOptions={{
                    className: "",
                    duration: 4000,
                    style: {
                        background: "#363636",
                        color: "#fff",
                    },
                    success: {
                        duration: 3000,
                        style: {
                            background: "#10b981",
                            color: "white",
                        },
                    },
                    error: {
                        duration: 4000,
                        style: {
                            background: "#ef4444",
                            color: "white",
                        },
                    },
                }}
            /> */}
        </div>
    );
}