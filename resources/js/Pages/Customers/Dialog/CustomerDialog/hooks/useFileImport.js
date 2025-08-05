import { useState, useCallback, useMemo } from 'react';
import { notifications } from '@/utils/notifications';
import { CUSTOMER_DIALOG } from '@/Constants/Business/customers';
import CustomerAPI from '@/Services/api/CustomerAPI';
import { downloadTemplate as downloadFallbackTemplate } from '@/Services/utils/templateGenerator';

/**
 * File type configurations with validation rules and processing methods
 */
const FILE_TYPES = {
    EXCEL: {
        extensions: ['xlsx', 'xls'],
        mimeTypes: [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel'
        ],
        maxSize: 50 * 1024 * 1024, // 50MB
        icon: 'TableCellsIcon',
        description: 'Excel files containing customer data in structured format',
        templateFormats: ['xlsx', 'csv']
    },
    CSV: {
        extensions: ['csv'],
        mimeTypes: ['text/csv', 'application/csv'],
        maxSize: 25 * 1024 * 1024, // 25MB
        icon: 'TableCellsIcon',
        description: 'Comma-separated values file with customer information',
        templateFormats: ['csv']
    },
    PDF: {
        extensions: ['pdf'],
        mimeTypes: ['application/pdf'],
        maxSize: 25 * 1024 * 1024, // 25MB
        icon: 'DocumentTextIcon',
        description: 'PDF documents with structured customer data',
        templateFormats: ['pdf']
    }
};

/**
 * Import status constants
 */
const IMPORT_STATUS = {
    IDLE: 'idle',
    VALIDATING: 'validating',
    UPLOADING: 'uploading',
    PROCESSING: 'processing', 
    SUCCESS: 'success',
    ERROR: 'error'
};

/**
 * Advanced file import hook with comprehensive validation and processing
 * @param {Object} options - Configuration options
 * @param {Array} options.supportedTypes - Array of supported file types
 * @param {Function} options.onSuccess - Success callback
 * @param {Function} options.onError - Error callback
 * @returns {Object} Import state and handlers
 */
export const useFileImport = ({
    supportedTypes = ['EXCEL', 'CSV', 'PDF'],
    onSuccess,
    onError
} = {}) => {
    // State management
    const [selectedFile, setSelectedFile] = useState(null);
    const [importStatus, setImportStatus] = useState(IMPORT_STATUS.IDLE);
    const [progress, setProgress] = useState(0);
    const [validationErrors, setValidationErrors] = useState([]);
    const [importResults, setImportResults] = useState(null);
    const [filePreview, setFilePreview] = useState(null);

    // Memoized supported file configurations
    const supportedFileTypes = useMemo(() => 
        supportedTypes.reduce((acc, type) => {
            if (FILE_TYPES[type]) {
                acc[type] = FILE_TYPES[type];
            }
            return acc;
        }, {}), 
        [supportedTypes]
    );

    // Get all supported extensions
    const supportedExtensions = useMemo(() => 
        Object.values(supportedFileTypes).flatMap(type => type.extensions),
        [supportedFileTypes]
    );

    // Get all supported MIME types
    const supportedMimeTypes = useMemo(() => 
        Object.values(supportedFileTypes).flatMap(type => type.mimeTypes),
        [supportedFileTypes]
    );

    /**
     * Validate file against all rules
     */
    const validateFile = useCallback((file) => {
        const errors = [];
        
        if (!file) {
            errors.push('No file selected');
            return errors;
        }

        // Extension validation
        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (!supportedExtensions.includes(fileExtension)) {
            errors.push(`Unsupported file type. Supported: ${supportedExtensions.join(', ')}`);
        }

        // MIME type validation
        if (!supportedMimeTypes.includes(file.type)) {
            errors.push(`Invalid file format detected`);
        }

        // Size validation
        const fileType = Object.entries(supportedFileTypes).find(([_, config]) => 
            config.extensions.includes(fileExtension)
        );
        
        if (fileType && file.size > fileType[1].maxSize) {
            const maxSizeMB = (fileType[1].maxSize / (1024 * 1024)).toFixed(1);
            errors.push(`File too large. Maximum size: ${maxSizeMB}MB`);
        }

        // Name validation
        if (file.name.length > 255) {
            errors.push('Filename too long (max 255 characters)');
        }

        // Basic security checks
        const dangerousExtensions = ['exe', 'bat', 'cmd', 'scr', 'vbs', 'js'];
        if (dangerousExtensions.includes(fileExtension)) {
            errors.push('File type not allowed for security reasons');
        }

        return errors;
    }, [supportedExtensions, supportedMimeTypes, supportedFileTypes]);

    /**
     * Detect file type from file object
     */
    const detectFileType = useCallback((file) => {
        if (!file) return null;
        
        const extension = file.name.split('.').pop().toLowerCase();
        
        return Object.entries(supportedFileTypes).find(([_, config]) => 
            config.extensions.includes(extension)
        )?.[0] || null;
    }, [supportedFileTypes]);

    /**
     * Generate file preview information
     */
    const generatePreview = useCallback(async (file) => {
        if (!file) return null;

        const fileType = detectFileType(file);
        const preview = {
            name: file.name,
            size: file.size,
            sizeFormatted: (file.size / 1024).toFixed(1) + ' KB',
            type: fileType,
            lastModified: new Date(file.lastModified).toLocaleDateString(),
            icon: supportedFileTypes[fileType]?.icon,
            description: supportedFileTypes[fileType]?.description
        };

        // For CSV files, try to read first few lines
        if (fileType === 'CSV') {
            try {
                const text = await file.slice(0, 1024).text();
                const lines = text.split('\n').slice(0, 5);
                preview.csvPreview = lines;
            } catch (error) {
                console.warn('Could not generate CSV preview:', error);
            }
        }

        return preview;
    }, [detectFileType, supportedFileTypes]);

    /**
     * Handle file selection with validation and preview
     */
    const handleFileSelect = useCallback(async (file) => {
        setImportStatus(IMPORT_STATUS.VALIDATING);
        setProgress(10);

        const errors = validateFile(file);
        setValidationErrors(errors);

        if (errors.length > 0) {
            setImportStatus(IMPORT_STATUS.ERROR);
            setProgress(0);
            notifications.error(`File validation failed: ${errors[0]}`);
            return false;
        }

        try {
            const preview = await generatePreview(file);
            setFilePreview(preview);
            setSelectedFile(file);
            setImportStatus(IMPORT_STATUS.IDLE);
            setProgress(0);
            
            notifications.success('File validated successfully');
            return true;
        } catch (error) {
            setImportStatus(IMPORT_STATUS.ERROR);
            setProgress(0);
            notifications.error('Failed to process file preview');
            return false;
        }
    }, [validateFile, generatePreview]);

    /**
     * Process the import based on file type
     */
    const processImport = useCallback(async () => {
        if (!selectedFile) {
            notifications.error('No file selected');
            return;
        }

        const fileType = detectFileType(selectedFile);
        setImportStatus(IMPORT_STATUS.UPLOADING);
        setProgress(20);

        let loadingToast;
        try {
            loadingToast = notifications.loading(`Importing customers from ${fileType}...`);
            
            let result;
            switch (fileType) {
                case 'EXCEL':
                case 'CSV':
                    setImportStatus(IMPORT_STATUS.PROCESSING);
                    setProgress(60);
                    result = await CustomerAPI.importCustomers(selectedFile);
                    break;
                    
                case 'PDF':
                    setImportStatus(IMPORT_STATUS.PROCESSING);
                    setProgress(60);
                    // For now, show not implemented message
                    throw new Error('PDF import functionality is not yet implemented');
                    // Future: result = await CustomerAPI.importCustomersPDF(selectedFile);
                    
                default:
                    throw new Error(`Unsupported file type: ${fileType}`);
            }

            setProgress(100);
            setImportStatus(IMPORT_STATUS.SUCCESS);
            setImportResults(result);

            notifications.dismiss(loadingToast);
            
            const importedCount = result.imported || 0;
            const skippedCount = result.skipped || 0;
            const errorCount = result.errors || 0;

            let message = `Successfully imported ${importedCount} customer${importedCount !== 1 ? 's' : ''}`;
            if (skippedCount > 0) message += `, skipped ${skippedCount}`;
            if (errorCount > 0) message += `, ${errorCount} errors`;

            notifications.success(message, { duration: 6000 });

            // Call success callback
            onSuccess?.(result);

            return result;
        } catch (error) {
            console.error('Import error:', error);
            
            if (loadingToast) {
                notifications.dismiss(loadingToast);
            }
            
            setImportStatus(IMPORT_STATUS.ERROR);
            setProgress(0);
            
            const errorMessage = error.message || 'Unknown import error';
            notifications.error(`Import failed: ${errorMessage}`);
            
            // Call error callback
            onError?.(error);
            
            throw error;
        }
    }, [selectedFile, detectFileType, onSuccess, onError]);

    /**
     * Download template for specific format with fallback support
     */
    const downloadTemplate = useCallback(async (format = 'xlsx') => {
        let loadingToast;
        
        try {
            loadingToast = notifications.loading(`Generating ${format.toUpperCase()} template...`);
            
            // Try server template first
            const result = await CustomerAPI.downloadTemplate(format);
            
            notifications.dismiss(loadingToast);
            
            // Show success message with file details
            const sizeInKB = result.size ? (result.size / 1024).toFixed(1) : 'unknown';
            notifications.success(
                `Template downloaded: ${result.filename} (${sizeInKB} KB)`,
                { duration: 4000 }
            );
            
            return result;
        } catch (error) {
            console.error('Server template download failed:', error);
            
            if (loadingToast) {
                notifications.dismiss(loadingToast);
            }
            
            // Try fallback client-side template generation
            try {
                notifications.info('Using fallback template generator...', { duration: 2000 });
                
                const fallbackResult = downloadFallbackTemplate(format);
                
                notifications.success(
                    `Fallback template generated: ${fallbackResult.filename}`,
                    { duration: 4000 }
                );
                
                return fallbackResult;
            } catch (fallbackError) {
                console.error('Fallback template generation failed:', fallbackError);
                
                // Provide specific error messages
                let errorMessage = 'Failed to download template';
                
                if (error.message.includes('Template not found')) {
                    errorMessage = 'Template not available. Using fallback failed - please contact support';
                } else if (error.message.includes('Server error')) {
                    errorMessage = 'Server error and fallback failed. Please try again later';
                } else if (error.message.includes('Access denied')) {
                    errorMessage = 'Access denied. Please check your permissions';
                } else if (error.message.includes('timed out')) {
                    errorMessage = 'Template generation timed out and fallback failed';
                } else if (error.message.includes('Invalid format')) {
                    errorMessage = `${error.message}. Supported formats: CSV, Excel`;
                } else if (error.message) {
                    errorMessage = `${error.message}. Fallback also failed`;
                }
                
                notifications.error(errorMessage, { duration: 8000 });
                throw new Error(errorMessage);
            }
        }
    }, []);

    /**
     * Reset import state
     */
    const resetImport = useCallback(() => {
        setSelectedFile(null);
        setImportStatus(IMPORT_STATUS.IDLE);
        setProgress(0);
        setValidationErrors([]);
        setImportResults(null);
        setFilePreview(null);
    }, []);

    /**
     * Remove selected file
     */
    const removeFile = useCallback(() => {
        setSelectedFile(null);
        setFilePreview(null);
        setValidationErrors([]);
        setImportResults(null);
        if (importStatus !== IMPORT_STATUS.PROCESSING) {
            setImportStatus(IMPORT_STATUS.IDLE);
            setProgress(0);
        }
    }, [importStatus]);

    // Computed properties
    const isProcessing = importStatus === IMPORT_STATUS.PROCESSING || 
                        importStatus === IMPORT_STATUS.UPLOADING || 
                        importStatus === IMPORT_STATUS.VALIDATING;
    
    const canProcess = selectedFile && 
                      importStatus === IMPORT_STATUS.IDLE && 
                      validationErrors.length === 0;

    const hasErrors = validationErrors.length > 0 || importStatus === IMPORT_STATUS.ERROR;

    return {
        // State
        selectedFile,
        importStatus,
        progress,
        validationErrors,
        importResults,
        filePreview,
        
        // Computed
        isProcessing,
        canProcess,
        hasErrors,
        supportedExtensions,
        supportedFileTypes,
        
        // Actions
        handleFileSelect,
        processImport,
        downloadTemplate,
        resetImport,
        removeFile,
        detectFileType,
        
        // Constants
        IMPORT_STATUS,
        FILE_TYPES
    };
};