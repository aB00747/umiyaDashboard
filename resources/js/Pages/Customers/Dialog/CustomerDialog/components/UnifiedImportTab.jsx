import React, { useCallback, useRef, useMemo } from 'react';
import { 
    TableCellsIcon, 
    DocumentTextIcon,
    CloudArrowUpIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { useFileImport } from '../hooks/useFileImport';

/**
 * File type icon mapping
 */
const getFileTypeIcon = (fileType) => {
    switch (fileType) {
        case 'EXCEL':
        case 'CSV':
            return TableCellsIcon;
        case 'PDF':
            return DocumentTextIcon;
        default:
            return CloudArrowUpIcon;
    }
};

/**
 * Progress bar component
 */
const ProgressBar = ({ progress, status }) => {
    const getProgressColor = () => {
        switch (status) {
            case 'error':
                return 'bg-red-500';
            case 'success':
                return 'bg-green-500';
            default:
                return 'bg-blue-500';
        }
    };

    return (
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
                className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
                style={{ width: `${Math.max(progress, 0)}%` }}
            />
        </div>
    );
};

/**
 * File preview component
 */
const FilePreview = ({ preview, onRemove, isProcessing }) => {
    const IconComponent = useMemo(() => 
        getFileTypeIcon(preview?.type), 
        [preview?.type]
    );

    if (!preview) return null;

    return (
        <div className="border-2 border-dashed border-green-300 rounded-lg p-4 bg-green-50">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <IconComponent className="h-8 w-8 text-green-600" />
                    <div>
                        <p className="text-sm font-medium text-gray-900">{preview.name}</p>
                        <p className="text-xs text-gray-500">
                            {preview.sizeFormatted} • {preview.type} • Modified: {preview.lastModified}
                        </p>
                        {preview.description && (
                            <p className="text-xs text-gray-600 mt-1">{preview.description}</p>
                        )}
                    </div>
                </div>
                <button
                    type="button"
                    onClick={onRemove}
                    disabled={isProcessing}
                    className="text-red-600 hover:text-red-800 disabled:text-gray-400"
                >
                    <XMarkIcon className="h-5 w-5" />
                </button>
            </div>
            
            {/* CSV Preview */}
            {preview.csvPreview && (
                <div className="mt-3 p-2 bg-white rounded border text-xs">
                    <p className="font-medium text-gray-700 mb-1">Preview:</p>
                    {preview.csvPreview.map((line) => (
                        <div key={line.id} className="text-gray-600 truncate">
                            {line || '(empty line)'}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

/**
 * Error display component
 */
const ErrorDisplay = ({ errors }) => {
    if (!errors.length) return null;

    return (
        <div className="border border-red-300 rounded-lg p-4 bg-red-50 mb-4">
            <div className="flex items-center space-x-2 mb-2">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
                <p className="text-red-800 font-medium">Validation Errors</p>
            </div>
            <ul className="text-red-700 text-sm space-y-1">
                {errors.map((error, idx) => (
                    <li key={idx}>• {error}</li>
                ))}
            </ul>
        </div>
    );
};

/**
 * Import results component
 */
const ImportResults = ({ results }) => {
    if (!results) return null;

    const { imported = 0, skipped = 0, errors = 0, warnings = [] } = results;

    return (
        <div className="border border-green-300 rounded-lg p-4 bg-green-50 mb-4">
            <div className="flex items-center space-x-2 mb-2">
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
                <p className="text-green-800 font-medium">Import Completed</p>
            </div>
            <div className="text-sm text-green-700 space-y-1">
                <p>✅ Successfully imported: {imported} customers</p>
                {skipped > 0 && <p>⏭️ Skipped: {skipped} records</p>}
                {errors > 0 && <p>❌ Errors: {errors} records</p>}
                {warnings.length > 0 && (
                    <div className="mt-2">
                        <p className="font-medium">Warnings:</p>
                        <ul className="ml-2 space-y-1">
                            {warnings.map((warning) => (
                                <li key={warning.id}>• {warning}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

/**
 * Unified Import Tab Component
 * Handles Excel, CSV, and PDF imports with comprehensive validation and UI
 */
export default function UnifiedImportTab({ onImportSuccess }) {
    const fileInputRef = useRef(null);
    
    const {
        selectedFile,
        importStatus,
        progress,
        validationErrors,
        importResults,
        filePreview,
        isProcessing,
        canProcess,
        hasErrors,
        supportedExtensions,
        supportedFileTypes,
        handleFileSelect,
        processImport,
        downloadTemplate,
        removeFile,
        IMPORT_STATUS
    } = useFileImport({
        supportedTypes: ['EXCEL', 'CSV', 'PDF'],
        onSuccess: onImportSuccess
    });

    // Handle file input change
    const handleFileChange = useCallback(async (e) => {
        const file = e.target.files[0];
        if (file) {
            await handleFileSelect(file);
        }
        // Reset input to allow selecting the same file again
        e.target.value = '';
    }, [handleFileSelect]);

    // Handle drag and drop
    const handleDrop = useCallback(async (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            await handleFileSelect(file);
        }
    }, [handleFileSelect]);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
    }, []);

    // Trigger file input
    const triggerFileInput = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    // Generate accept attribute for file input
    const acceptAttribute = useMemo(() => 
        supportedExtensions.map(ext => `.${ext}`).join(','),
        [supportedExtensions]
    );

    // Handle keydown events for accessibility
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            triggerFileInput();
        }
    }, [triggerFileInput]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Import Customer Data
                </h3>
                <p className="text-sm text-gray-600">
                    Upload Excel (.xlsx, .xls), CSV, or PDF files containing customer information
                </p>
            </div>

            {/* Progress Bar */}
            {(isProcessing || importStatus === IMPORT_STATUS.SUCCESS) && (
                <ProgressBar progress={progress} status={importStatus} />
            )}

            {/* Error Display */}
            <ErrorDisplay errors={validationErrors} />

            {/* Import Results */}
            <ImportResults results={importResults} />

            {/* File Upload Area */}
            <div className="space-y-4">
                {filePreview ? (
                    <FilePreview 
                        preview={filePreview} 
                        onRemove={removeFile}
                        isProcessing={isProcessing}
                    />
                ) : (
                    <div 
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
                        role="button"
                        tabIndex="0"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onKeyDown={handleKeyDown}
                    >
                        <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <div className="space-y-2">
                            <button
                                type="button"
                                onClick={triggerFileInput}
                                disabled={isProcessing}
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 disabled:text-gray-400"
                            >
                                Choose file to upload
                            </button>
                            <p className="text-sm text-gray-500">or drag and drop</p>
                            <p className="text-xs text-gray-400">
                                Supported: {supportedExtensions.map(ext => ext.toUpperCase()).join(', ')}
                                <br />
                                Maximum file size: 25-50MB depending on type
                            </p>
                        </div>
                        
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept={acceptAttribute}
                            onChange={handleFileChange}
                            disabled={isProcessing}
                        />
                    </div>
                )}

                {/* Process Button */}
                {canProcess && (
                    <button
                        type="button"
                        onClick={processImport}
                        disabled={isProcessing || !canProcess}
                        className="w-full inline-flex justify-center items-center py-3 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {isProcessing ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                </svg>
                                {importStatus === IMPORT_STATUS.UPLOADING && 'Uploading...'}
                                {importStatus === IMPORT_STATUS.PROCESSING && 'Processing...'}
                                {importStatus === IMPORT_STATUS.VALIDATING && 'Validating...'}
                            </>
                        ) : (
                            'Import Customers'
                        )}
                    </button>
                )}
            </div>

            {/* Template Downloads */}
            <div className="border-t pt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                    Download Templates
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.entries(supportedFileTypes).map(([type, config]) => (
                        config.templateFormats?.map(format => (
                            <button
                                key={`${type}-${format}`}
                                type="button"
                                onClick={() => downloadTemplate(format)}
                                className="flex items-center justify-center space-x-2 py-2 px-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                            >
                                {React.createElement(getFileTypeIcon(type), { 
                                    className: "h-4 w-4" 
                                })}
                                <span>{format.toUpperCase()} Template</span>
                            </button>
                        ))
                    )).flat()}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    Download template files to see the expected format for customer data
                </p>
            </div>

            {/* Supported File Types Info */}
            <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Supported File Types
                </h4>
                <div className="space-y-2">
                    {Object.entries(supportedFileTypes).map(([type, config]) => {
                        const IconComponent = getFileTypeIcon(type);
                        return (
                            <div key={type} className="flex items-start space-x-2">
                                <IconComponent className="h-4 w-4 text-gray-500 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-700">
                                        {type} ({config.extensions.map(ext => `.${ext}`).join(', ')})
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        {config.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}