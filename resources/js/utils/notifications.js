import toast from 'react-hot-toast';

export const notifications = {
    success: (message, options = {}) => {
        return toast.success(message, {
            duration: 3000,
            position: 'top-right',
            ...options,
        });
    },

    error: (message, options = {}) => {
        return toast.error(message, {
            duration: 4000,
            position: 'top-right',
            ...options,
        });
    },

    warning: (message, options = {}) => {
        return toast(message, {
            icon: '⚠️',
            duration: 3500,
            position: 'top-right',
            style: {
                background: '#f59e0b',
                color: 'white',
            },
            ...options,
        });
    },

    info: (message, options = {}) => {
        return toast(message, {
            icon: 'ℹ️',
            duration: 3000,
            position: 'top-right',
            style: {
                background: '#3b82f6',
                color: 'white',
            },
            ...options,
        });
    },

    loading: (message) => {
        return toast.loading(message);
    },

    dismiss: (toastId) => {
        toast.dismiss(toastId);
    },

    promise: (promise, messages) => {
        return toast.promise(promise, messages);
    },

    // Custom method for API operations
    apiSuccess: (action, entity = 'Item') => {
        const messages = {
            create: `${entity} created successfully!`,
            update: `${entity} updated successfully!`,
            delete: `${entity} deleted successfully!`,
            import: `${entity} imported successfully!`,
        };
        return notifications.success(messages[action] || `${action} completed successfully!`);
    },

    apiError: (action, error, entity = 'Item') => {
        const errorMessage = error?.message || error?.data?.message || 'An unexpected error occurred';
        return notifications.error(`Failed to ${action} ${entity.toLowerCase()}: ${errorMessage}`);
    }
};

// Simple function for backward compatibility
export const showNotification = (message, type = "info") => {
    if (notifications[type]) {
        notifications[type](message);
    } else {
        notifications.info(message);
    }
};