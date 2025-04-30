// Pages/Customers/Components/CustomerTable.jsx
import { useState, useEffect } from "react";
import { Mail, ChevronDown, Check } from "lucide-react";

export default function CustomerTable({ customers }) {
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [emailTemplate, setEmailTemplate] = useState("");
    const [emailSubject, setEmailSubject] = useState("");
    const [availableTemplates, setAvailableTemplates] = useState([
        { id: 1, name: "Monthly Newsletter", subject: "Monthly Updates from Umiya Acid", content: "Dear {customerName},\n\nWe hope this email finds you well. Here are our latest updates and offerings for this month...\n\nBest regards,\nUmiya Acid Team" },
        { id: 2, name: "Special Promotion", subject: "Special Discount Offer", content: "Dear {customerName},\n\nWe're pleased to offer you a special discount on our premium products...\n\nRegards,\nUmiya Acid Team" },
        { id: 3, name: "Payment Reminder", subject: "Gentle Payment Reminder", content: "Dear {customerName},\n\nThis is a friendly reminder about your outstanding balance of {outstandingAmount}...\n\nThank you,\nUmiya Acid Team" }
    ]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [emailStatus, setEmailStatus] = useState("");
    const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);

    // Toggle select all customers
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedCustomers([]);
        } else {
            setSelectedCustomers(customers.map(customer => customer.id));
        }
        setSelectAll(!selectAll);
    };

    // Toggle selection of individual customer
    const handleSelectCustomer = (customerId) => {
        setSelectedCustomers(prevSelected => {
            if (prevSelected.includes(customerId)) {
                return prevSelected.filter(id => id !== customerId);
            } else {
                return [...prevSelected, customerId];
            }
        });
    };

    // Update selectAll state when individual selections change
    useEffect(() => {
        if (selectedCustomers.length === customers.length) {
            setSelectAll(true);
        } else {
            setSelectAll(false);
        }
    }, [selectedCustomers, customers]);

    // Handle sending email
    const handleSendEmail = () => {
        // In a real application, this would make an API call to send emails
        const recipientCount = selectedCustomers.length;
        const selectedCustomerDetails = customers.filter(customer => 
            selectedCustomers.includes(customer.id)
        );
        
        console.log("Sending email to:", selectedCustomerDetails);
        console.log("Email subject:", emailSubject);
        console.log("Email content:", emailTemplate);
        
        // Simulate email sending process
        setEmailStatus("sending");
        setTimeout(() => {
            setEmailStatus("success");
            setTimeout(() => {
                setShowEmailModal(false);
                setEmailStatus("");
                setEmailTemplate("");
                setEmailSubject("");
                setSelectedTemplate(null);
            }, 1500);
        }, 2000);
    };

    // Select email template
    const handleSelectTemplate = (template) => {
        setSelectedTemplate(template);
        setEmailSubject(template.subject);
        setEmailTemplate(template.content);
        setShowTemplateDropdown(false);
    };

    // Personalize template for preview
    const personalizeTemplate = (template, customer) => {
        if (!template || !customer) return "";
        
        return template
            .replace("{customerName}", customer.name)
            .replace("{outstandingAmount}", customer.outstanding);
    };

    return (
        <div className="tableContainer">
            <div className="tableHeader">
                <h2 className="tableTitle">Customer Table</h2>
                <button
                    onClick={() => setShowEmailModal(true)}
                    disabled={selectedCustomers.length === 0}
                    className={`button ${
                        selectedCustomers.length === 0 
                            ? "disabledButton" 
                            : "primaryButton"
                    }`}
                >
                    <Mail size={16} className="buttonIcon" />
                    Send Email ({selectedCustomers.length})
                </button>
            </div>

            <div>
                <table className="table">
                    <thead className="tableHead">
                        <tr>
                            <th scope="col" className="tableHeadCell">
                                <div>
                                    <input
                                        type="checkbox"
                                        checked={selectAll}
                                        onChange={handleSelectAll}
                                    />
                                </div>
                            </th>
                            <th scope="col" className="tableHeadCell">
                                Customer
                            </th>
                            <th scope="col" className="tableHeadCell">
                                Contact
                            </th>
                            <th scope="col" className="tableHeadCell">
                                Status
                            </th>
                            <th scope="col" className="tableHeadCell">
                                Outstanding
                            </th>
                            <th scope="col" className="tableHeadCell">
                                Last Order
                            </th>
                        </tr>
                    </thead>
                    <tbody className="tableBody">
                        {customers.map((customer) => (
                            <tr 
                                key={customer.id} 
                                className={`tableRow ${selectedCustomers.includes(customer.id) ? "tableRowSelected" : ""}`}
                            >
                                <td className="tableCell">
                                    <input
                                        type="checkbox"
                                        checked={selectedCustomers.includes(customer.id)}
                                        onChange={() => handleSelectCustomer(customer.id)}
                                    />
                                </td>
                                <td className="tableCell">
                                    <div>
                                        <div className="customerName">
                                            {customer.name}
                                        </div>
                                        <div className="customerCategory">
                                            {customer.category}
                                        </div>
                                    </div>
                                </td>
                                <td className="tableCell">
                                    <div className="contactInfo">{customer.contactPerson}</div>
                                    <div className="contactEmail">{customer.email}</div>
                                </td>
                                <td className="tableCell">
                                    <span className={`statusBadge ${
                                        customer.status === "Active" 
                                            ? "statusActive" 
                                            : "statusInactive"
                                    }`}>
                                        {customer.status}
                                    </span>
                                </td>
                                <td className="tableCell">
                                    {customer.outstanding}
                                </td>
                                <td className="tableCell">
                                    {new Date(customer.lastOrder).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Email Modal */}
            {showEmailModal && (
                <div className="modalOverlay">
                    <div className="modalContent">
                        <h3 className="modalTitle">Send Email to Customers</h3>
                        
                        <div className="formGroup">
                            <label className="formLabel">
                                Selected Recipients
                            </label>
                            <div className="recipientCount">
                                {selectedCustomers.length} customer(s) selected
                            </div>
                        </div>
                        
                        <div className="formGroup">
                            <label className="formLabel">
                                Email Template
                            </label>
                            <div className="dropdown">
                                <button
                                    type="button"
                                    onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
                                    className="dropdownButton"
                                >
                                    <span>
                                        {selectedTemplate ? selectedTemplate.name : "Select a template"}
                                    </span>
                                    <ChevronDown size={16} />
                                </button>
                                
                                {showTemplateDropdown && (
                                    <div className="dropdownMenu">
                                        {availableTemplates.map((template) => (
                                            <div
                                                key={template.id}
                                                onClick={() => handleSelectTemplate(template)}
                                                className="dropdownItem"
                                            >
                                                <span>{template.name}</span>
                                                {selectedTemplate && selectedTemplate.id === template.id && (
                                                    <span className="dropdownItemSelected">
                                                        <Check size={16} />
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="formGroup">
                            <label className="formLabel">
                                Email Subject
                            </label>
                            <input
                                type="text"
                                value={emailSubject}
                                onChange={(e) => setEmailSubject(e.target.value)}
                                className="formControl"
                            />
                        </div>
                        
                        <div className="formGroup">
                            <label className="formLabel">
                                Email Content
                            </label>
                            <textarea
                                value={emailTemplate}
                                onChange={(e) => setEmailTemplate(e.target.value)}
                                rows={6}
                                className="formControl textArea"
                            />
                        </div>
                        
                        {selectedTemplate && selectedCustomers.length > 0 && (
                            <div className="previewSection">
                                <h4 className="previewTitle">Preview:</h4>
                                <p className="previewContent">
                                    {personalizeTemplate(
                                        emailTemplate,
                                        customers.find(c => c.id === selectedCustomers[0])
                                    )}
                                </p>
                            </div>
                        )}
                        
                        <div className="modalFooter">
                            <button
                                type="button"
                                onClick={() => setShowEmailModal(false)}
                                className="secondaryButton"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSendEmail}
                                disabled={!emailSubject || !emailTemplate || emailStatus === "sending"}
                                className={`button ${
                                    !emailSubject || !emailTemplate || emailStatus === "sending"
                                        ? "disabledButton"
                                        : "primaryButton"
                                }`}
                            >
                                {emailStatus === "sending" ? "Sending..." : emailStatus === "success" ? "Sent!" : "Send Email"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}