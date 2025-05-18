import react from "react";

import { DocumentTextIcon } from "@heroicons/react/24/outline";

/**
 * PdfImportTab
 *
 * A tab for importing customer data from a PDF file.
 *
 * @param {Object} props Component props
 * @param {Function} props.handlePdfUpload Function to handle file upload
 * @returns {ReactElement} The rendered element
 */
export default function PdfImportTab({ handlePdfUpload }) {
    return (
        <>
            <div className="customer-dialog-import">
                <div className="customer-dialog-import-container">
                    <DocumentTextIcon className="customer-dialog-import-icon" />
                    <h3 className="customer-dialog-import-title">
                        Import Customer Data from PDF
                    </h3>
                    <p className="customer-dialog-import-description">
                        Upload a PDF file containing customer information.
                    </p>
                    <div className="customer-dialog-import-upload-area">
                        <label
                            htmlFor="pdf-file-upload"
                            className="block text-sm font-medium text-gray-700 sr-only"
                        >
                            Choose PDF file
                        </label>
                        <div className="customer-dialog-import-upload-area-container">
                            <div className="customer-dialog-import-upload-area-content">
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
                                        htmlFor="pdf-file-upload"
                                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                    >
                                        <span>Upload PDF file</span>
                                        <input
                                            id="pdf-file-upload"
                                            name="pdf-file-upload"
                                            type="file"
                                            className="sr-only"
                                            accept=".pdf"
                                            onChange={handlePdfUpload}
                                        />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">
                                    PDF up to 10MB
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="customer-dialog-import-help-text">
                        <p>
                            PDF processing extracts customer information from
                            structured PDF documents. For best results, ensure
                            text is selectable and not an image scan.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
