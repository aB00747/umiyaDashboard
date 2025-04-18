// components/Helpers/componentRegistry.js
import { lazy } from 'react';

// Auth components
// const Auth = lazy(() => import('../../Pages/Auth/Index'));

// Customer components
const Customers = lazy(() => import('../../Pages/Customers/Index'));

// Dashboard components
// const Dashboard = lazy(() => import('../../Pages/Dashboard'));
// const StatsCard = lazy(() => import('../../Pages/Dashboard/StatsCard'));

// Document components
const Documents = lazy(() => import('../../Pages/Documents/Index'));

// Inventory components
const Inventory = lazy(() => import('../../Pages/Inventory/Index'));

// Messaging components
const Messaging = lazy(() => import('../../Pages/Messaging/Index'));

// Orders components
const Orders = lazy(() => import('../../Pages/Orders/Index'));

// Pricing components
const Pricing = lazy(() => import('../../Pages/Pricing/Index'));

// Component registry
const componentRegistry = {
    // Main navigation tabs
    // dashboard: Dashboard,
    customers: Customers,
    documents: Documents,
    inventory: Inventory,
    messaging: Messaging,
    orders: Orders,
    pricing: Pricing,
    
    // Sub-components
    // statscard: StatsCard,
};


export default componentRegistry;