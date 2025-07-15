import { useState, useRef, useCallback } from "react";
import { TableCellsIcon } from "@heroicons/react/24/outline";
import CustomerAPI from "@/Services/api/CustomerAPI";

/**
 * ExcelImportTab
 *
 * A tab for importing customer data from an Excel file.
 *
 * @param {Object} props Component props
 * @param {Function} props.handleExcelUpload Function to handle file upload
 * @returns {ReactElement} The rendered element
 */
export default function ExcelImportTab({ handleExcelUpload, isLoading }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);
    const acceptedFormats = ["xlsx", "xls", "csv", "pdf"];


    /**
     * Returns the file extension of a given filename.
     *
     * @param {string} filename - The filename to extract the extension from
     * @returns {string} The file extension
     */
    function getFileExtension(filename) {
        return filename.split('.').pop();
    }

    /**
     * Handles the download of the customer import template.
     *
     * @param {string} format - The format of the template file. Default is "xlsx".
     */
    const handleDownloadTemplate = useCallback((format = "xlsx") => {
        console.log("template API format", format);
        
        CustomerAPI.downloadTemplate(format);
    }, []);

    // /**
    //  * Handles downloading Excel template specifically.
    //  */
    // const handleDownloadExcelTemplate = useCallback(() => {
    //     handleDownloadTemplate("xlsx");
    // }, [handleDownloadTemplate]);

    // /**
    //  * Handles downloading CSV template specifically.
    //  */
    // const handleDownloadCsvTemplate = useCallback(() => {
    //     handleDownloadTemplate("csv");
    // }, [handleDownloadTemplate]);

    /**
     * Handles file input change event by extracting the first file from the event
     * and updating the selected file state. This allows users to choose an Excel
     * file for import.
     *
     * @param {Object} e - The event object from file input change.
     */
    const handleFileChange = useCallback((e) => {
        const file = e.target.files[0];

        if (!file) return;

        const fileExtension = getFileExtension(file.name);

        if (!acceptedFormats.includes(fileExtension)) {
            alert("Please upload an Excel (.xlsx) or CSV (.csv) file.");
            return;
        }

        if (file) {
            setSelectedFile(file);
        }
    }, []);

    /**
     * Process the selected file by calling the handleExcelUpload function.
     * This will upload the file to the server, and the server will handle the
     * actual import process.
     */
    const handleProcessFile = useCallback(() => {
        if (selectedFile) {
            handleExcelUpload({ target: { files: [selectedFile] } });
        }
    }, [selectedFile, handleExcelUpload]);

    /**
     * Removes the currently selected file by setting it to null.
     */
    const handleRemoveFile = useCallback(() => {
        setSelectedFile(null);
    }, []);

    return (
        <div className="customer-dialog-import">
            <div className="customer-dialog-import-container">
                <TableCellsIcon className="customer-dialog-import-icon" />
                <h3 className="customer-dialog-import-title">
                    Import Customer Data from Excel
                </h3>
                <p className="customer-dialog-import-description">
                    Upload an Excel file (.xlsx, .xls) or CSV file containing
                    customer information.
                </p>

                {/* File upload section */}
                <div className="customer-dialog-import-upload-area">
                    <label
                        htmlFor="excel-file-upload"
                        className="block text-sm font-medium text-gray-700 sr-only"
                    >
                        Choose Excel file
                    </label>
                    <div className="customer-dialog-import-upload-area-container">
                        <div className="customer-dialog-import-upload-area-content">
                            {selectedFile ? (
                                <div className="selected-file">
                                    <div className="file-info">
                                        <svg
                                            className="h-5 w-5 text-green-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        <span>{selectedFile.name}</span>
                                    </div>
                                    <button
                                        type="button"
                                        className="text-red-600 hover:text-red-800"
                                        onClick={handleRemoveFile}
                                        disabled={isLoading}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <svg
                                        className="mx-auto h-12 w-12 text-gray-400"
                                        stroke="currentColor"
                                        fill="none"
                                        viewBox="0 0 48 48"
                                        aria-hidden="true"
                                    >
                                        <path
                                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <div className="flex text-sm text-gray-600">
                                        <label
                                            htmlFor="excel-file-upload"
                                            className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                        >
                                            <span>Upload file</span>
                                            <input
                                                id="excel-file-upload"
                                                name="excel-file-upload"
                                                type="file"
                                                className="sr-only"
                                                accept=".xlsx,.xls,.csv"
                                                onChange={handleFileChange}
                                                ref={fileInputRef}
                                                disabled={isLoading}
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        XLSX, XLS, or CSV up to 10MB
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Template download section */}
                <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700">
                        Need a template?
                    </p>
                    <div className="flex space-x-4 mt-2">
                        <button
                            type="button"
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                            onClick={() =>handleDownloadTemplate("xlsx")}
                        >
                            Download Excel Template
                        </button>

                        <button
                            type="button"
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                            // style={{ marginLeft: "250px" }}
                            onClick={() => handleDownloadTemplate("csv")}
                        >
                            Download CSV Template
                        </button>

                        <button
                            type="button"
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                            // style={{ marginLeft: "250px" }}
                            onClick={() => handleDownloadTemplate("pdf")}
                        >
                            Download PDF Template
                        </button>
                    </div>
                </div>

                {/* Process button - only show if file is selected */}
                {selectedFile && (
                    <div className="mt-4">
                        <button
                            type="button"
                            className={`w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                                isLoading
                                    ? "bg-indigo-400"
                                    : "bg-indigo-600 hover:bg-indigo-700"
                            }`}
                            onClick={handleProcessFile}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="flex items-center">
                                    <svg
                                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                "Process File"
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
