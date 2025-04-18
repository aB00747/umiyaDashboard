import { useState, useEffect } from "react";
import { Search, Bell, HelpCircle, ChevronDown, LogOut } from "lucide-react";
import { usePage, Link } from '@inertiajs/react';

export default function Header({ activeTab, notifications }) {
    const { auth } = usePage().props;
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const user = auth.user;

    // Format user initials for avatar
    const getInitials = () => {
        if (!user) return "AU";
        const names = user.name.split(' ');
        return names.length > 1 
            ? `${names[0][0]}${names[1][0]}` 
            : `${names[0][0]}`;
    };

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        
        if (query.length > 2) {
            setIsSearching(true);
            try {
                // const response = await fetch(`/api/search-public?q=${encodeURIComponent(query)}`);
                const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                const data = await response.json();
                setSearchResults(data);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setIsSearching(false);
            }
        } else {
            setSearchResults([]);
        }
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-10">
            <div className="px-4 py-3 flex justify-between items-center">
                {/* Page Title */}
                <div className="flex items-center">
                    <h1 className="text-xl font-semibold text-gray-800">
                        {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                    </h1>
                </div>
                
                {/* Right Side Tools */}
                <div className="flex items-center space-x-4">
                    {/* Search Bar */}
                    {/* <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            onChange={handleSearch}
                            className="border rounded-md py-2 px-3 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
                        />
                        <Search
                            className="absolute right-3 top-2.5 text-gray-400"
                            size={18}
                        />
                    </div> */}

                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearch}
                            placeholder="Search..."
                            className="border rounded-md py-2 px-3 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
                        />
                        <div className="absolute right-3 top-2.5 text-gray-400">
                            {isSearching ? (
                                <div className="animate-spin h-5 w-5 border-2 border-gray-500 rounded-full border-t-transparent"></div>
                            ) : (
                                <Search size={18} />
                            )}
                        </div>
                        
                        {/* Search Results Dropdown */}
                        {searchResults.length > 0 && (
                            <div className="absolute top-full mt-1 w-full bg-white border rounded-md shadow-lg z-20 max-h-60 overflow-y-auto">
                                {searchResults.map((result) => (
                                    <Link
                                        key={result.id}
                                        href={result.url}
                                        className="block px-4 py-2 hover:bg-gray-100 border-b last:border-0"
                                    >
                                        <div className="font-medium">{result.title}</div>
                                        <div className="text-sm text-gray-500">{result.type}</div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {/* Notifications */}
                    <div className="relative">
                        <button className="p-2 rounded-full hover:bg-gray-100 relative">
                            <Bell size={20} className="text-gray-600" />
                            {notifications > 0 && (
                                <span className="absolute top-0 right-0 h-5 w-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">
                                    {notifications}
                                </span>
                            )}
                        </button>
                    </div>
                    
                    {/* Help */}
                    <div className="relative">
                        <button className="p-2 rounded-full hover:bg-gray-100">
                            <HelpCircle size={20} className="text-gray-600" />
                        </button>
                    </div>
                    
                    {/* User Profile */}
                    <div className="relative border-l pl-4">
                        <button 
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center focus:outline-none"
                        >
                            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                                {getInitials()}
                            </div>
                            <ChevronDown size={16} className="ml-1 text-gray-600" />
                        </button>
                        
                        {/* Dropdown Menu */}
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-xl z-20">
                                <div className="px-4 py-2 text-sm text-gray-700 border-b">
                                    <p className="font-semibold">{user?.name}</p>
                                    <p className="text-xs text-gray-500">{user?.email}</p>
                                </div>
                                <Link 
                                    href={route('profile.edit')} 
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Profile Settings
                                </Link>
                                <Link 
                                    href={route('logout')} 
                                    method="post" 
                                    as="button" 
                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                >
                                    <div className="flex items-center">
                                        <LogOut size={16} className="mr-2" />
                                        Logout
                                    </div>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}