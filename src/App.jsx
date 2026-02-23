
import React, { useState, useEffect, useCallback } from 'react';

// --- DUMMY DATA ---
const generateId = () => Math.random().toString(36).substr(2, 9);
const getRandomDate = () => new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
const getRandomFutureDate = () => new Date(Date.now() + Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];

const dummyCustomers = [
    { customerId: 'CUST001', name: 'Alice Wonderland', email: 'alice@example.com', phone: '555-1234' },
    { customerId: 'CUST002', name: 'Bob The Builder', email: 'bob@example.com', phone: '555-5678' },
    { customerId: 'CUST003', name: 'Charlie Chaplin', email: 'charlie@example.com', phone: '555-9012' },
    { customerId: 'CUST004', name: 'Diana Prince', email: 'diana@example.com', phone: '555-3456' },
    { customerId: 'CUST005', name: 'Eve Harrington', email: 'eve@example.com', phone: '555-7890' },
];

const dummyContracts = [
    {
        contractId: 'VSC001', vehicleVIN: 'VIN001ABC', planName: 'Platinum Plus', customerName: 'Alice Wonderland', customerId: 'CUST001',
        startDate: '2022-01-15', endDate: '2025-01-15', status: 'ACTIVE', premium: 2500, dealer: 'AutoWorld Motors', mileageAtSale: 5000,
        coverageTier: 'Elite', deductible: 100, paymentFrequency: 'Annual', contractType: 'New',
        workflowHistory: [
            { stage: 'Initiated', date: '2022-01-10', user: 'Dealer1', note: 'Contract created by dealer.' },
            { stage: 'Underwriting', date: '2022-01-12', user: 'UnderwriterA', note: 'Pending review.' },
            { stage: 'Approved', date: '2022-01-14', user: 'UnderwriterA', note: 'Approved for Platinum Plus.' },
            { stage: 'Activated', date: '2022-01-15', user: 'System', note: 'Contract is active.' },
        ],
        auditLogs: [
            { timestamp: '2022-01-10 10:00', user: 'Dealer1', action: 'Created Contract VSC001', details: 'Initial contract details entered.' },
            { timestamp: '2022-01-14 11:30', user: 'UnderwriterA', action: 'Approved Contract VSC001', details: 'Contract approved after risk assessment.' },
        ]
    },
    {
        contractId: 'VSC002', vehicleVIN: 'VIN002DEF', planName: 'Gold Standard', customerName: 'Bob The Builder', customerId: 'CUST002',
        startDate: '2021-06-01', endDate: '2024-06-01', status: 'PENDING', premium: 1800, dealer: 'City Auto Sales', mileageAtSale: 25000,
        coverageTier: 'Standard', deductible: 200, paymentFrequency: 'Monthly', contractType: 'Used',
        workflowHistory: [
            { stage: 'Initiated', date: '2021-05-25', user: 'Dealer2', note: 'Contract created.' },
            { stage: 'Underwriting', date: '2021-05-28', user: 'UnderwriterB', note: 'Awaiting additional documents.' },
        ],
        auditLogs: [
            { timestamp: '2021-05-25 09:00', user: 'Dealer2', action: 'Created Contract VSC002', details: 'Used vehicle VSC.' },
        ]
    },
    {
        contractId: 'VSC003', vehicleVIN: 'VIN003GHI', planName: 'Basic Care', customerName: 'Charlie Chaplin', customerId: 'CUST003',
        startDate: '2020-03-10', endDate: '2023-03-10', status: 'EXPIRED', premium: 1000, dealer: 'Grand Motors', mileageAtSale: 80000,
        coverageTier: 'Basic', deductible: 500, paymentFrequency: 'One-time', contractType: 'Used',
        workflowHistory: [
            { stage: 'Initiated', date: '2020-03-01', user: 'Dealer3', note: 'Basic coverage.' },
            { stage: 'Approved', date: '2020-03-08', user: 'UnderwriterC', note: 'Approved.' },
            { stage: 'Activated', date: '2020-03-10', user: 'System', note: 'Contract active.' },
            { stage: 'Expired', date: '2023-03-10', user: 'System', note: 'Contract term ended.' },
        ],
        auditLogs: [
            { timestamp: '2020-03-01 14:00', user: 'Dealer3', action: 'Created Contract VSC003', details: 'Basic care plan.' },
            { timestamp: '2023-03-10 23:59', user: 'System', action: 'Expired Contract VSC003', details: 'Contract reached end date.' },
        ]
    },
    {
        contractId: 'VSC004', vehicleVIN: 'VIN004JKL', planName: 'Premium Shield', customerName: 'Diana Prince', customerId: 'CUST004',
        startDate: '2023-05-20', endDate: '2026-05-20', status: 'ACTIVE', premium: 3000, dealer: 'Elite Auto Group', mileageAtSale: 1000,
        coverageTier: 'Premium', deductible: 50, paymentFrequency: 'Quarterly', contractType: 'New',
        workflowHistory: [
            { stage: 'Initiated', date: '2023-05-15', user: 'Dealer4', note: 'New contract created.' },
            { stage: 'Underwriting', date: '2023-05-16', user: 'UnderwriterD', note: 'Expedited review.' },
            { stage: 'Approved', date: '2023-05-18', user: 'UnderwriterD', note: 'Approved with full coverage.' },
            { stage: 'Activated', date: '2023-05-20', user: 'System', note: 'Contract is active.' },
        ],
        auditLogs: [
            { timestamp: '2023-05-15 09:30', user: 'Dealer4', action: 'Created Contract VSC004', details: 'Premium plan for new vehicle.' },
        ]
    },
    {
        contractId: 'VSC005', vehicleVIN: 'VIN005MNO', planName: 'Roadside Assist', customerName: 'Eve Harrington', customerId: 'CUST005',
        startDate: '2023-10-01', endDate: '2024-10-01', status: 'CANCELLED', premium: 500, dealer: 'Swift Rides', mileageAtSale: 30000,
        coverageTier: 'Basic', deductible: 0, paymentFrequency: 'Annual', contractType: 'Add-on',
        workflowHistory: [
            { stage: 'Initiated', date: '2023-09-25', user: 'Dealer5', note: 'Add-on for existing vehicle.' },
            { stage: 'Approved', date: '2023-09-28', user: 'UnderwriterE', note: 'Approved.' },
            { stage: 'Activated', date: '2023-10-01', user: 'System', note: 'Contract active.' },
            { stage: 'Cancellation_Requested', date: '2023-10-10', user: 'Eve Harrington', note: 'Customer requested cancellation.' },
            { stage: 'Cancelled', date: '2023-10-15', user: 'CSR1', note: 'Contract officially cancelled with prorated refund.' },
        ],
        auditLogs: [
            { timestamp: '2023-09-25 15:00', user: 'Dealer5', action: 'Created Contract VSC005', details: 'Roadside assistance plan.' },
            { timestamp: '2023-10-10 10:00', user: 'Eve Harrington', action: 'Requested Cancellation VSC005', details: 'Customer initiated cancellation from portal.' },
            { timestamp: '2023-10-15 11:00', user: 'CSR1', action: 'Cancelled Contract VSC005', details: 'Processed customer cancellation.' },
        ]
    },
    {
        contractId: 'VSC006', vehicleVIN: 'VIN006PQR', planName: 'Ultimate Protection', customerName: 'Alice Wonderland', customerId: 'CUST001',
        startDate: '2023-11-01', endDate: '2026-11-01', status: 'ACTIVE', premium: 4000, dealer: 'Lux Auto', mileageAtSale: 100,
        coverageTier: 'Ultimate', deductible: 0, paymentFrequency: 'Annual', contractType: 'New',
        workflowHistory: [
            { stage: 'Initiated', date: '2023-10-25', user: 'DealerA', note: 'New Ultimate contract.' },
            { stage: 'Underwriting', date: '2023-10-26', user: 'UnderwriterF', note: 'Awaiting premium payment.' },
            { stage: 'Approved', date: '2023-10-30', user: 'UnderwriterF', note: 'Approved after payment.' },
            { stage: 'Activated', date: '2023-11-01', user: 'System', note: 'Contract is active.' },
        ],
        auditLogs: [
            { timestamp: '2023-10-25 12:00', user: 'DealerA', action: 'Created Contract VSC006', details: 'Luxury vehicle protection.' },
        ]
    },
];

const dummyClaims = [
    {
        claimId: 'CLAIM001', contractId: 'VSC001', claimDate: '2023-03-01', issueDescription: 'Engine knocking noise',
        status: 'APPROVED', amountRequested: 1500, amountApproved: 1200, repairShop: 'Certified Auto',
        workflowHistory: [
            { stage: 'Submitted', date: '2023-03-01', user: 'Alice Wonderland', note: 'Claim submitted via portal.' },
            { stage: 'Under Review', date: '2023-03-02', user: 'CSR1', note: 'Assigned to adjuster.' },
            { stage: 'AI Review', date: '2023-03-03', user: 'AI System', note: 'No fraud detected.' },
            { stage: 'Approved', date: '2023-03-07', user: 'AdjusterX', note: 'Approved for partial amount.' },
            { stage: 'Paid', date: '2023-03-10', user: 'Finance', note: 'Payment issued.' },
        ],
        auditLogs: [
            { timestamp: '2023-03-01 10:00', user: 'Alice Wonderland', action: 'Submitted Claim CLAIM001', details: 'Engine issue.' },
            { timestamp: '2023-03-07 14:00', user: 'AdjusterX', action: 'Approved Claim CLAIM001', details: 'Approved for $1200.' },
        ],
        sla: { targetDate: '2023-03-08', status: 'MET' }
    },
    {
        claimId: 'CLAIM002', contractId: 'VSC002', claimDate: '2023-08-10', issueDescription: 'Transmission slipping',
        status: 'UNDER_REVIEW', amountRequested: 3000, amountApproved: null, repairShop: 'Transmission Experts',
        workflowHistory: [
            { stage: 'Submitted', date: '2023-08-10', user: 'Bob The Builder', note: 'Transmission issue reported.' },
            { stage: 'Under Review', date: '2023-08-11', user: 'CSR2', note: 'Awaiting repair shop estimate.' },
        ],
        auditLogs: [
            { timestamp: '2023-08-10 11:30', user: 'Bob The Builder', action: 'Submitted Claim CLAIM002', details: 'Transmission slipping.' },
        ],
        sla: { targetDate: '2023-08-17', status: 'PENDING' }
    },
    {
        claimId: 'CLAIM003', contractId: 'VSC001', claimDate: '2023-09-01', issueDescription: 'Brake system malfunction',
        status: 'REJECTED', amountRequested: 800, amountApproved: 0, repairShop: 'Local Garage',
        workflowHistory: [
            { stage: 'Submitted', date: '2023-09-01', user: 'Alice Wonderland', note: 'Brake issue.' },
            { stage: 'Under Review', date: '2023-09-02', user: 'CSR1', note: 'Initial review.' },
            { stage: 'AI Review', date: '2023-09-03', user: 'AI System', note: 'Flagged for potential fraud (unusual claim frequency).' },
            { stage: 'Rejected', date: '2023-09-08', user: 'AdjusterY', note: 'Rejected due to policy exclusion (wear and tear).' },
        ],
        auditLogs: [
            { timestamp: '2023-09-01 14:00', user: 'Alice Wonderland', action: 'Submitted Claim CLAIM003', details: 'Brake issue.' },
            { timestamp: '2023-09-03 09:00', user: 'AI System', action: 'AI Fraud Check', details: 'Flagged for review.' },
            { timestamp: '2023-09-08 16:00', user: 'AdjusterY', action: 'Rejected Claim CLAIM003', details: 'Policy exclusion.' },
        ],
        sla: { targetDate: '2023-09-07', status: 'BREACHED' }
    },
    {
        claimId: 'CLAIM004', contractId: 'VSC004', claimDate: '2023-11-15', issueDescription: 'AC not cooling',
        status: 'APPROVED', amountRequested: 600, amountApproved: 600, repairShop: 'Cool Car Repair',
        workflowHistory: [
            { stage: 'Submitted', date: '2023-11-15', user: 'Diana Prince', note: 'AC issue.' },
            { stage: 'Under Review', date: '2023-11-16', user: 'CSR3', note: 'Quick review.' },
            { stage: 'Approved', date: '2023-11-17', user: 'AdjusterZ', note: 'Approved in full.' },
            { stage: 'Paid', date: '2023-11-20', user: 'Finance', note: 'Payment issued.' },
        ],
        auditLogs: [
            { timestamp: '2023-11-15 10:30', user: 'Diana Prince', action: 'Submitted Claim CLAIM004', details: 'AC not working.' },
            { timestamp: '2023-11-17 12:00', user: 'AdjusterZ', action: 'Approved Claim CLAIM004', details: 'Approved for $600.' },
        ],
        sla: { targetDate: '2023-11-18', status: 'MET' }
    },
    {
        claimId: 'CLAIM005', contractId: 'VSC006', claimDate: '2024-01-05', issueDescription: 'Electrical fault',
        status: 'SUBMITTED', amountRequested: 1200, amountApproved: null, repairShop: 'Electro Motors',
        workflowHistory: [
            { stage: 'Submitted', date: '2024-01-05', user: 'Alice Wonderland', note: 'New electrical claim.' },
        ],
        auditLogs: [
            { timestamp: '2024-01-05 09:00', user: 'Alice Wonderland', action: 'Submitted Claim CLAIM005', details: 'Electrical issues.' },
        ],
        sla: { targetDate: '2024-01-12', status: 'PENDING' }
    }
];

const dummyRenewals = [
    {
        renewalId: 'REN001', contractId: 'VSC003', dueDate: '2023-02-15', newEndDate: '2024-02-15',
        status: 'DECLINED', requestedBy: 'Charlie Chaplin',
        auditLogs: [
            { timestamp: '2023-01-01 09:00', user: 'System', action: 'Renewal notice sent for VSC003' },
            { timestamp: '2023-01-20 10:00', user: 'Charlie Chaplin', action: 'Renewal declined for VSC003' },
        ]
    },
    {
        renewalId: 'REN002', contractId: 'VSC002', dueDate: '2024-05-01', newEndDate: '2025-05-01',
        status: 'PENDING', requestedBy: 'System',
        auditLogs: [
            { timestamp: '2024-03-01 09:00', user: 'System', action: 'Renewal notice sent for VSC002' },
        ]
    }
];

const dummyUsers = [
    { userId: 'user_fi_pm', name: 'F&I Manager', role: 'F&I Product Manager' },
    { userId: 'user_csr', name: 'Customer Rep', role: 'Customer Service Representative' },
    { userId: 'user_dealer', name: 'Dealer User', role: 'Dealership Portal User' },
    { userId: 'user_owner', name: 'Vehicle Owner', role: 'Vehicle Owner' },
    { userId: 'user_architect', name: 'System Architect', role: 'System Architect' },
];

// --- STATUS & ROLE CONFIGURATION ---
const CONTRACT_STATUS_MAP = {
    ACTIVE: { label: 'Active', colorVar: 'var(--status-active)' },
    PENDING: { label: 'Pending', colorVar: 'var(--status-pending)' },
    EXPIRED: { label: 'Expired', colorVar: 'var(--status-expired)' },
    CANCELLED: { label: 'Cancelled', colorVar: 'var(--status-cancelled)' },
    APPROVED: { label: 'Approved', colorVar: 'var(--status-approved)' },
    UNDERWRITING: { label: 'Underwriting', colorVar: 'var(--status-pending)' },
    INITIATED: { label: 'Initiated', colorVar: 'var(--status-submitted)' },
};

const CLAIM_STATUS_MAP = {
    SUBMITTED: { label: 'Submitted', colorVar: 'var(--status-submitted)' },
    UNDER_REVIEW: { label: 'Under Review', colorVar: 'var(--status-under-review)' },
    APPROVED: { label: 'Approved', colorVar: 'var(--status-approved)' },
    REJECTED: { label: 'Rejected', colorVar: 'var(--status-rejected)' },
    PAID: { label: 'Paid', colorVar: 'var(--status-paid)' },
    AI_REVIEW: { label: 'AI Review', colorVar: 'var(--status-under-review)' },
};

const RENEWAL_STATUS_MAP = {
    PENDING: { label: 'Pending', colorVar: 'var(--status-pending)' },
    COMPLETED: { label: 'Completed', colorVar: 'var(--status-completed)' },
    DECLINED: { label: 'Declined', colorVar: 'var(--status-rejected)' },
};

const WORKFLOW_STAGES = {
    CONTRACT: ['Initiated', 'Underwriting', 'Approved', 'Activated', 'Cancellation_Requested', 'Cancelled', 'Expired'],
    CLAIM: ['Submitted', 'Under Review', 'AI Review', 'Approved', 'Rejected', 'Paid'],
    RENEWAL: ['Pending', 'Renewal_Notice_Sent', 'Renewal_Requested', 'Completed', 'Declined'],
};

const ROLES = {
    'F&I Product Manager': {
        canViewDashboard: true,
        canManageContracts: true, // create, edit, cancel
        canManageClaims: true, // adjudicate
        canViewCustomers: true,
        canViewAuditLogs: true,
        canAccessAdminFeatures: true,
    },
    'Customer Service Representative': {
        canViewDashboard: true,
        canManageContracts: false, // can view details, but not create/edit
        canManageClaims: true, // process claims
        canViewCustomers: true,
        canViewAuditLogs: true,
        canAccessAdminFeatures: false,
    },
    'Dealership Portal User': {
        canViewDashboard: true,
        canManageContracts: true, // create new contracts, view own
        canManageClaims: true, // submit claims for own contracts
        canViewCustomers: true, // view own customers
        canViewAuditLogs: false,
        canAccessAdminFeatures: false,
    },
    'Vehicle Owner': {
        canViewDashboard: false,
        canManageContracts: false, // can view own contract details, request cancellation/renewal
        canManageClaims: true, // submit own claims, view status
        canViewCustomers: false,
        canViewAuditLogs: false,
        canAccessAdminFeatures: false,
    },
    'System Architect': {
        canViewDashboard: true,
        canManageContracts: false,
        canManageClaims: false,
        canViewCustomers: false,
        canViewAuditLogs: true,
        canAccessAdminFeatures: true, // For system config, monitoring, etc.
    },
};

// --- CORE COMPONENTS ---

const Breadcrumbs = ({ path, navigate }) => (
    <div style={{ display: 'flex', gap: 'var(--spacing-sm)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-md)', alignItems: 'center' }}>
        {path?.map((item, index) => (
            <React.Fragment key={item?.name}>
                {index > 0 && <span style={{ color: 'var(--color-secondary)' }}>/</span>}
                {item?.onClick ? (
                    <a onClick={() => item?.onClick()} style={{ color: 'var(--color-primary)', textDecoration: 'none', cursor: 'pointer' }}>
                        {item?.name}
                    </a>
                ) : (
                    <span style={{ color: index === path.length - 1 ? 'var(--color-text)' : 'var(--color-secondary)' }}>
                        {item?.name}
                    </span>
                )}
            </React.Fragment>
        ))}
    </div>
);

const Card = ({ title, details, statusKey, onClick, actions, className = '' }) => {
    const statusInfo = statusKey && CONTRACT_STATUS_MAP[statusKey]
        ? CONTRACT_STATUS_MAP[statusKey]
        : CLAIM_STATUS_MAP[statusKey]
            ? CLAIM_STATUS_MAP[statusKey]
            : RENEWAL_STATUS_MAP[statusKey]
                ? RENEWAL_STATUS_MAP[statusKey]
                : { label: statusKey, colorVar: 'var(--color-secondary)' }; // Fallback

    return (
        <div
            className={`card status-${statusKey} ${className}`}
            style={{ borderColor: statusInfo?.colorVar }}
            onClick={() => onClick?.()}
        >
            <div className="card-actions">
                {actions?.map((action, index) => (
                    <button key={index} onClick={(e) => { e.stopPropagation(); action?.handler(); }} title={action?.label}>
                        {action?.icon || action?.label?.charAt(0)}
                    </button>
                ))}
            </div>
            <div className="card-title">{title}</div>
            {details?.map((detail, index) => (
                <div key={index} className="card-detail">
                    <span style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--color-secondary)' }}>{detail?.label}:</span>
                    <span>{detail?.value}</span>
                </div>
            ))}
            {statusKey && (
                <div className="card-status" style={{ backgroundColor: statusInfo?.colorVar }}>
                    {statusInfo?.label}
                </div>
            )}
        </div>
    );
};

const StatusBadge = ({ statusKey, statusMap }) => {
    const statusInfo = statusMap?.[statusKey] || { label: statusKey, colorVar: 'var(--color-secondary)' };
    return (
        <span className={`status-badge ${statusKey}`} style={{ backgroundColor: statusInfo?.colorVar }}>
            {statusInfo?.label}
        </span>
    );
};

const WorkflowTracker = ({ workflowHistory = [], currentStatus, workflowStages, sla = {} }) => {
    const stages = workflowStages || []; // Ensure stages is an array

    return (
        <div className="workflow-tracker">
            <div className="workflow-line" style={{ width: `calc(100% - var(--spacing-md) * 2)` }}></div>
            {stages?.map((stage, index) => {
                const historyEntry = workflowHistory?.find(h => h?.stage === stage);
                const isCompleted = historyEntry !== undefined && (stages.indexOf(currentStatus) > stages.indexOf(stage));
                const isCurrent = currentStatus === stage;
                const isSlaBreached = isCurrent && sla?.status === 'BREACHED';

                let iconChar = index + 1;
                if (isCompleted) iconChar = '✔';
                if (isSlaBreached) iconChar = '❗';

                return (
                    <div
                        key={stage}
                        className={`workflow-stage ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${isSlaBreached ? 'sla-breach' : ''}`}
                        style={{ flexBasis: `${100 / stages.length}%` }}
                    >
                        <div className="workflow-stage-icon">
                            {iconChar}
                        </div>
                        <div className="workflow-stage-title">{stage?.replace(/_/g, ' ')}</div>
                        {historyEntry?.date && <div className="workflow-stage-date">{historyEntry?.date}</div>}
                    </div>
                );
            })}
        </div>
    );
};

const AuditLogPanel = ({ logs, canViewLogs = false }) => {
    if (!canViewLogs) {
        return <div className="detail-section">Access Denied: You do not have permission to view audit logs.</div>;
    }

    return (
        <div className="detail-section">
            <h3 className="detail-section-title">Audit Logs</h3>
            <div className="audit-log-panel">
                {logs?.length > 0 ? (
                    logs?.map((log, index) => (
                        <div key={index} className="audit-log-entry">
                            <span className="audit-log-time">{log?.timestamp}</span>
                            <span className="audit-log-message"><strong>{log?.user}:</strong> {log?.action} - {log?.details}</span>
                        </div>
                    ))
                ) : (
                    <div style={{ padding: 'var(--spacing-md)', color: 'var(--color-secondary)' }}>No audit logs available.</div>
                )}
            </div>
        </div>
    );
};

const RelatedRecords = ({ title, records, type, navigate }) => {
    return (
        <div className="detail-section">
            <h3 className="detail-section-title">{title}</h3>
            {records?.length > 0 ? (
                <div className="card-grid" style={{ gridTemplateColumns: '1fr' }}>
                    {records?.map(record => (
                        <Card
                            key={record?.id || record?.contractId || record?.claimId || record?.renewalId}
                            title={record?.title || record?.planName || record?.claimId || record?.renewalId}
                            details={record?.details}
                            statusKey={record?.status}
                            onClick={() => navigate(type, { id: record?.id || record?.contractId || record?.claimId || record?.renewalId })}
                        />
                    ))}
                </div>
            ) : (
                <p style={{ color: 'var(--color-secondary)' }}>No {title.toLowerCase()} found.</p>
            )}
        </div>
    );
};

// --- CHART PLACEHOLDER COMPONENTS ---
const BarChartPlaceholder = ({ title, data, className = '' }) => (
    <div className={`chart-container ${className}`}>
        <h4 className="chart-title">{title}</h4>
        <div className="chart-bar-series" style={{ height: '150px' }}>
            {data?.map((item, index) => (
                <div key={index} className="chart-bar" style={{ height: `${item?.value}%`, backgroundColor: item?.color || 'var(--color-accent)' }}></div>
            ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-xs)', marginTop: 'var(--spacing-xs)' }}>
            {data?.map((item, index) => <span key={index} style={{ width: '20px', textAlign: 'center' }}>{item?.label}</span>)}
        </div>
    </div>
);

const LineChartPlaceholder = ({ title, data, className = '' }) => (
    <div className={`chart-container ${className}`}>
        <h4 className="chart-title">{title}</h4>
        <div className="chart-line-series" style={{ position: 'relative', height: '150px', borderBottom: '1px solid var(--color-border)' }}>
            {/* Simulate line path with points */}
            {data?.map((item, index) => (
                <div
                    key={index}
                    className="chart-line-point"
                    style={{ left: `${(index / (data.length - 1)) * 100}%`, bottom: `${item?.value}%` }}
                ></div>
            ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-xs)', marginTop: 'var(--spacing-xs)' }}>
            {data?.map((item, index) => <span key={index} style={{ flex: 1, textAlign: 'center' }}>{item?.label}</span>)}
        </div>
    </div>
);

const DonutChartPlaceholder = ({ title, data, className = '' }) => {
    const total = data?.reduce((sum, item) => sum + item?.value, 0);
    let currentAngle = 0;
    const gradients = data?.map(item => {
        const percentage = (item?.value / total) * 100;
        const start = currentAngle;
        currentAngle += percentage;
        return `${item?.color || 'gray'} ${start}% ${currentAngle}%`;
    }).join(', ');

    return (
        <div className={`chart-container ${className}`}>
            <h4 className="chart-title">{title}</h4>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--spacing-md)' }}>
                <div
                    className="chart-donut-circle"
                    style={{ background: `conic-gradient(${gradients})` }}
                >
                    <span className="chart-donut-label">{Math.round((data?.[0]?.value / total) * 100)}%</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                    {data?.map((item, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', fontSize: 'var(--font-size-sm)' }}>
                            <span style={{ width: '10px', height: '10px', backgroundColor: item?.color || 'gray', borderRadius: '2px', marginRight: 'var(--spacing-xs)' }}></span>
                            {item?.label} ({item?.value})
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const GaugeChartPlaceholder = ({ title, value, max, unit, className = '' }) => {
    const percentage = (value / max) * 100;
    const rotateAngle = (percentage / 100) * 180 - 90; // -90 to 90 degrees for 0-100%

    return (
        <div className={`chart-container ${className}`}>
            <h4 className="chart-title">{title}</h4>
            <div className="chart-gauge-arc">
                <div className="chart-gauge-inner"></div>
                <div className="chart-gauge-needle" style={{ transform: `translateX(-50%) rotate(${rotateAngle}deg)` }}></div>
            </div>
            <div style={{ textAlign: 'center', marginTop: 'var(--spacing-sm)', fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)' }}>
                {value} {unit}
            </div>
        </div>
    );
};

// --- SCREENS ---

const DashboardScreen = ({ navigate, currentUserRole }) => {
    const userPermissions = ROLES[currentUserRole];
    const canViewContracts = userPermissions?.canManageContracts || userPermissions?.canViewDashboard || userPermissions?.canManageClaims;
    const canViewClaims = userPermissions?.canManageClaims || userPermissions?.canViewDashboard;
    const canViewRenewals = userPermissions?.canViewDashboard;

    const kpiData = [
        { title: 'Active Contracts', value: dummyContracts?.filter(c => c?.status === 'ACTIVE')?.length, trend: '+5% this month' },
        { title: 'Pending Claims', value: dummyClaims?.filter(c => c?.status === 'UNDER_REVIEW' || c?.status === 'SUBMITTED')?.length, trend: 'stable' },
        { title: 'Total Premiums (YTD)', value: `$${dummyContracts?.reduce((sum, c) => sum + (c?.premium || 0), 0)}`, trend: '+12% YTD' },
        { title: 'SLA Breaches (Claims)', value: dummyClaims?.filter(c => c?.sla?.status === 'BREACHED')?.length, trend: '-1 this week' },
    ];

    const chartContractsByStatus = [
        { label: 'Active', value: dummyContracts?.filter(c => c?.status === 'ACTIVE')?.length, color: CONTRACT_STATUS_MAP.ACTIVE.colorVar },
        { label: 'Pending', value: dummyContracts?.filter(c => c?.status === 'PENDING')?.length, color: CONTRACT_STATUS_MAP.PENDING.colorVar },
        { label: 'Expired', value: dummyContracts?.filter(c => c?.status === 'EXPIRED')?.length, color: CONTRACT_STATUS_MAP.EXPIRED.colorVar },
        { label: 'Cancelled', value: dummyContracts?.filter(c => c?.status === 'CANCELLED')?.length, color: CONTRACT_STATUS_MAP.CANCELLED.colorVar },
    ];

    const chartClaimsByStatus = [
        { label: 'Approved', value: dummyClaims?.filter(c => c?.status === 'APPROVED')?.length, color: CLAIM_STATUS_MAP.APPROVED.colorVar },
        { label: 'Pending', value: dummyClaims?.filter(c => c?.status === 'UNDER_REVIEW' || c?.status === 'SUBMITTED')?.length, color: CLAIM_STATUS_MAP.UNDER_REVIEW.colorVar },
        { label: 'Rejected', value: dummyClaims?.filter(c => c?.status === 'REJECTED')?.length, color: CLAIM_STATUS_MAP.REJECTED.colorVar },
    ];

    const chartClaimApprovalRate = {
        value: Math.round((dummyClaims?.filter(c => c?.status === 'APPROVED')?.length / dummyClaims?.length) * 100) || 0,
        max: 100, unit: '%'
    };

    return (
        <div className="dashboard-layout">
            <h2 className="section-header">Dashboard Overview</h2>

            <div className="kpi-grid">
                {kpiData?.map((kpi, index) => (
                    <div key={index} className="kpi-card">
                        <span className="kpi-card-title">{kpi?.title}</span>
                        <span className="kpi-card-value">{kpi?.value}</span>
                        <span className="kpi-card-trend">{kpi?.trend}</span>
                    </div>
                ))}
            </div>

            <h3 className="section-header">Key Metrics</h3>
            <div className="card-grid">
                <DonutChartPlaceholder title="Contracts by Status" data={chartContractsByStatus} className="chart-realtime" />
                <BarChartPlaceholder title="Claims Status Distribution" data={chartClaimsByStatus} className="chart-realtime" />
                <GaugeChartPlaceholder title="Claim Approval Rate" value={chartClaimApprovalRate?.value} max={chartClaimApprovalRate?.max} unit={chartClaimApprovalRate?.unit} className="chart-realtime" />
                <LineChartPlaceholder
                    title="Monthly Premiums Trend"
                    data={[
                        { label: 'Jan', value: 30 }, { label: 'Feb', value: 45 }, { label: 'Mar', value: 40 },
                        { label: 'Apr', value: 60 }, { label: 'May', value: 55 }, { label: 'Jun', value: 70 }
                    ].map(d => ({ ...d, value: d?.value * 1.5 }))} // Scale up for visual
                    className="chart-realtime"
                />
            </div>

            {canViewContracts && (
                <>
                    <h3 className="section-header">Recent Contracts</h3>
                    <div className="card-grid">
                        {dummyContracts?.slice(0, 4)?.map(contract => (
                            <Card
                                key={contract?.contractId}
                                title={contract?.planName}
                                details={[
                                    { label: 'ID', value: contract?.contractId },
                                    { label: 'Customer', value: contract?.customerName },
                                    { label: 'Dealer', value: contract?.dealer },
                                    { label: 'End Date', value: contract?.endDate },
                                ]}
                                statusKey={contract?.status}
                                onClick={() => navigate('CONTRACT_DETAIL', { id: contract?.contractId })}
                                actions={[{ label: 'Edit', handler: () => navigate('CONTRACT_FORM', { id: contract?.contractId }) }]}
                            />
                        ))}
                    </div>
                </>
            )}

            {canViewClaims && (
                <>
                    <h3 className="section-header">Recent Claims</h3>
                    <div className="card-grid">
                        {dummyClaims?.slice(0, 4)?.map(claim => (
                            <Card
                                key={claim?.claimId}
                                title={claim?.claimId}
                                details={[
                                    { label: 'Contract', value: claim?.contractId },
                                    { label: 'Issue', value: claim?.issueDescription?.substring(0, 20) + '...' },
                                    { label: 'Amount', value: `$${claim?.amountRequested}` },
                                    { label: 'Date', value: claim?.claimDate },
                                ]}
                                statusKey={claim?.status}
                                onClick={() => navigate('CLAIM_DETAIL', { id: claim?.claimId })}
                                actions={[{ label: 'View', handler: () => navigate('CLAIM_DETAIL', { id: claim?.claimId }) }]}
                            />
                        ))}
                    </div>
                </>
            )}

            {canViewRenewals && (
                <>
                    <h3 className="section-header">Upcoming Renewals</h3>
                    <div className="card-grid">
                        {dummyRenewals?.filter(r => r?.status === 'PENDING')?.map(renewal => (
                            <Card
                                key={renewal?.renewalId}
                                title={`Renewal for ${renewal?.contractId}`}
                                details={[
                                    { label: 'Due Date', value: renewal?.dueDate },
                                    { label: 'New End Date', value: renewal?.newEndDate },
                                    { label: 'Requested By', value: renewal?.requestedBy },
                                ]}
                                statusKey={renewal?.status}
                                onClick={() => navigate('RENEWAL_DETAIL', { id: renewal?.renewalId })}
                                actions={[{ label: 'Manage', handler: () => navigate('RENEWAL_DETAIL', { id: renewal?.renewalId }) }]}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

const ContractDetailScreen = ({ contractId, navigate, currentUserRole, navigateToForm }) => {
    const contract = dummyContracts?.find(c => c?.contractId === contractId);
    const relatedClaims = dummyClaims?.filter(c => c?.contractId === contractId);
    const relatedRenewals = dummyRenewals?.filter(r => r?.contractId === contractId);
    const userPermissions = ROLES[currentUserRole];

    if (!contract) {
        return (
            <div className="main-content">
                <Breadcrumbs path={[{ name: 'Dashboard', onClick: () => navigate('DASHBOARD') }, { name: 'Contract Not Found' }]} />
                <h2 className="detail-page-title">Contract Details</h2>
                <p>Contract with ID "{contractId}" not found.</p>
            </div>
        );
    }

    const breadcrumbPath = [
        { name: 'Dashboard', onClick: () => navigate('DASHBOARD') },
        { name: 'Contracts', onClick: () => navigate('CONTRACT_LIST') },
        { name: `VSC ${contractId}` }
    ];

    const canEdit = currentUserRole === 'F&I Product Manager' || currentUserRole === 'Dealership Portal User';
    const canCancel = currentUserRole === 'F&I Product Manager' || currentUserRole === 'Customer Service Representative' || currentUserRole === 'Vehicle Owner';
    const canViewLogs = userPermissions?.canViewAuditLogs;

    return (
        <div className="main-content">
            <Breadcrumbs path={breadcrumbPath} />
            <div className="detail-page-header">
                <h2 className="detail-page-title">Contract: {contract?.planName} ({contract?.contractId})</h2>
                <div className="detail-actions">
                    {canEdit && <button className="button button-outline" onClick={() => navigateToForm('CONTRACT_FORM', { id: contractId })}>Edit Contract</button>}
                    {canCancel && (contract?.status === 'ACTIVE' || contract?.status === 'PENDING') && (
                        <button className="button button-secondary" onClick={() => alert(`Initiate cancellation for ${contract?.contractId}`)}>
                            Cancel Contract
                        </button>
                    )}
                </div>
            </div>

            <div className="detail-grid">
                <div className="detail-section">
                    <h3 className="detail-section-title">Contract Information</h3>
                    <div className="detail-list">
                        <div className="detail-item"><span className="detail-label">ID:</span> <span className="detail-value">{contract?.contractId}</span></div>
                        <div className="detail-item"><span className="detail-label">VIN:</span> <span className="detail-value">{contract?.vehicleVIN}</span></div>
                        <div className="detail-item"><span className="detail-label">Plan Name:</span> <span className="detail-value">{contract?.planName}</span></div>
                        <div className="detail-item"><span className="detail-label">Status:</span> <span className="detail-value"><StatusBadge statusKey={contract?.status} statusMap={CONTRACT_STATUS_MAP} /></span></div>
                        <div className="detail-item"><span className="detail-label">Customer:</span> <span className="detail-value">{contract?.customerName} ({contract?.customerId})</span></div>
                        <div className="detail-item"><span className="detail-label">Dealer:</span> <span className="detail-value">{contract?.dealer}</span></div>
                        <div className="detail-item"><span className="detail-label">Start Date:</span> <span className="detail-value">{contract?.startDate}</span></div>
                        <div className="detail-item"><span className="detail-label">End Date:</span> <span className="detail-value">{contract?.endDate}</span></div>
                        <div className="detail-item"><span className="detail-label">Premium:</span> <span className="detail-value">${contract?.premium?.toLocaleString()}</span></div>
                        <div className="detail-item"><span className="detail-label">Deductible:</span> <span className="detail-value">${contract?.deductible?.toLocaleString()}</span></div>
                        <div className="detail-item"><span className="detail-label">Mileage at Sale:</span> <span className="detail-value">{contract?.mileageAtSale?.toLocaleString()} miles</span></div>
                        <div className="detail-item"><span className="detail-label">Coverage Tier:</span> <span className="detail-value">{contract?.coverageTier}</span></div>
                        <div className="detail-item"><span className="detail-label">Payment Frequency:</span> <span className="detail-value">{contract?.paymentFrequency}</span></div>
                    </div>
                </div>

                <div className="detail-section">
                    <h3 className="detail-section-title">Workflow Progress</h3>
                    <WorkflowTracker
                        workflowHistory={contract?.workflowHistory}
                        currentStatus={contract?.status}
                        workflowStages={WORKFLOW_STAGES.CONTRACT}
                    />
                    <div style={{ marginTop: 'var(--spacing-md)' }}>
                        <h4 style={{ marginBottom: 'var(--spacing-sm)' }}>Milestones:</h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {contract?.workflowHistory?.map((entry, index) => (
                                <li key={index} style={{ marginBottom: 'var(--spacing-xs)', fontSize: 'var(--font-size-sm)' }}>
                                    <strong>{entry?.stage}:</strong> {entry?.date} ({entry?.user})
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <RelatedRecords
                    title="Related Claims"
                    records={relatedClaims?.map(claim => ({
                        id: claim?.claimId,
                        title: claim?.issueDescription,
                        status: claim?.status,
                        details: [
                            { label: 'Claim ID', value: claim?.claimId },
                            { label: 'Date', value: claim?.claimDate },
                            { label: 'Requested', value: `$${claim?.amountRequested}` },
                        ],
                    }))}
                    type="CLAIM_DETAIL"
                    navigate={navigate}
                />

                <RelatedRecords
                    title="Related Renewals"
                    records={relatedRenewals?.map(renewal => ({
                        id: renewal?.renewalId,
                        title: `Renewal ${renewal?.renewalId}`,
                        status: renewal?.status,
                        details: [
                            { label: 'Due Date', value: renewal?.dueDate },
                            { label: 'New End', value: renewal?.newEndDate },
                        ],
                    }))}
                    type="RENEWAL_DETAIL"
                    navigate={navigate}
                />

                <AuditLogPanel logs={contract?.auditLogs} canViewLogs={canViewLogs} />
            </div>
        </div>
    );
};

const ClaimDetailScreen = ({ claimId, navigate, currentUserRole, navigateToForm }) => {
    const claim = dummyClaims?.find(c => c?.claimId === claimId);
    const userPermissions = ROLES[currentUserRole];

    if (!claim) {
        return (
            <div className="main-content">
                <Breadcrumbs path={[{ name: 'Dashboard', onClick: () => navigate('DASHBOARD') }, { name: 'Claim Not Found' }]} />
                <h2 className="detail-page-title">Claim Details</h2>
                <p>Claim with ID "{claimId}" not found.</p>
            </div>
        );
    }

    const breadcrumbPath = [
        { name: 'Dashboard', onClick: () => navigate('DASHBOARD') },
        { name: 'Claims', onClick: () => navigate('CLAIM_LIST') },
        { name: `Claim ${claimId}` }
    ];

    const canAdjudicate = userPermissions?.canManageClaims && (claim?.status === 'UNDER_REVIEW' || claim?.status === 'SUBMITTED');
    const canViewLogs = userPermissions?.canViewAuditLogs;

    return (
        <div className="main-content">
            <Breadcrumbs path={breadcrumbPath} />
            <div className="detail-page-header">
                <h2 className="detail-page-title">Claim: {claim?.claimId}</h2>
                <div className="detail-actions">
                    {canAdjudicate && (
                        <>
                            <button className="button button-primary" onClick={() => alert(`Approve claim ${claim?.claimId}`)}>Approve</button>
                            <button className="button button-secondary" onClick={() => alert(`Reject claim ${claim?.claimId}`)}>Reject</button>
                        </>
                    )}
                    {userPermissions?.canManageClaims && claim?.status !== 'PAID' &&
                        <button className="button button-outline" onClick={() => navigateToForm('CLAIM_FORM', { id: claimId })}>Update Claim</button>
                    }
                </div>
            </div>

            <div className="detail-grid">
                <div className="detail-section">
                    <h3 className="detail-section-title">Claim Information</h3>
                    <div className="detail-list">
                        <div className="detail-item"><span className="detail-label">ID:</span> <span className="detail-value">{claim?.claimId}</span></div>
                        <div className="detail-item"><span className="detail-label">Contract ID:</span> <span className="detail-value"><a onClick={() => navigate('CONTRACT_DETAIL', { id: claim?.contractId })} style={{ color: 'var(--color-primary)', cursor: 'pointer', textDecoration: 'underline' }}>{claim?.contractId}</a></span></div>
                        <div className="detail-item"><span className="detail-label">Claim Date:</span> <span className="detail-value">{claim?.claimDate}</span></div>
                        <div className="detail-item"><span className="detail-label">Status:</span> <span className="detail-value"><StatusBadge statusKey={claim?.status} statusMap={CLAIM_STATUS_MAP} /></span></div>
                        <div className="detail-item"><span className="detail-label">Description:</span> <span className="detail-value">{claim?.issueDescription}</span></div>
                        <div className="detail-item"><span className="detail-label">Amount Requested:</span> <span className="detail-value">${claim?.amountRequested?.toLocaleString()}</span></div>
                        <div className="detail-item"><span className="detail-label">Amount Approved:</span> <span className="detail-value">{claim?.amountApproved ? `$${claim?.amountApproved?.toLocaleString()}` : 'N/A'}</span></div>
                        <div className="detail-item"><span className="detail-label">Repair Shop:</span> <span className="detail-value">{claim?.repairShop || 'N/A'}</span></div>
                        <div className="detail-item"><span className="detail-label">AI Fraud Check:</span> <span className="detail-value">{claim?.workflowHistory?.find(h => h?.stage === 'AI Review')?.note || 'Not run'}</span></div>
                    </div>
                </div>

                <div className="detail-section">
                    <h3 className="detail-section-title">Claim Workflow</h3>
                    <WorkflowTracker
                        workflowHistory={claim?.workflowHistory}
                        currentStatus={claim?.status}
                        workflowStages={WORKFLOW_STAGES.CLAIM}
                        sla={claim?.sla}
                    />
                    <div style={{ marginTop: 'var(--spacing-md)' }}>
                        <h4 style={{ marginBottom: 'var(--spacing-sm)' }}>SLA Tracking:</h4>
                        <div className="detail-item"><span className="detail-label">Target Date:</span> <span className="detail-value">{claim?.sla?.targetDate}</span></div>
                        <div className="detail-item"><span className="detail-label">SLA Status:</span> <span className="detail-value">{claim?.sla?.status === 'BREACHED' ? <span style={{ color: 'var(--status-rejected)' }}>BREACHED</span> : claim?.sla?.status}</span></div>
                    </div>
                </div>

                <AuditLogPanel logs={claim?.auditLogs} canViewLogs={canViewLogs} />
            </div>
        </div>
    );
};

const ContractFormScreen = ({ contractId, navigate }) => {
    const isEditing = !!contractId;
    const existingContract = isEditing ? dummyContracts?.find(c => c?.contractId === contractId) : null;

    const [formData, setFormData] = useState({
        contractId: existingContract?.contractId || '',
        vehicleVIN: existingContract?.vehicleVIN || '',
        planName: existingContract?.planName || '',
        customerName: existingContract?.customerName || '',
        startDate: existingContract?.startDate || '',
        endDate: existingContract?.endDate || '',
        status: existingContract?.status || 'PENDING',
        premium: existingContract?.premium || '',
        dealer: existingContract?.dealer || '',
        mileageAtSale: existingContract?.mileageAtSale || '',
        files: [], // For file uploads
        customerEmail: dummyCustomers?.find(c => c?.customerId === existingContract?.customerId)?.email || '', // Example of auto-populated
    });
    const [errors, setErrors] = useState({});

    const handleFieldChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => {
            const newErrors = { ...prev };
            if (newErrors[name]) delete newErrors[name];
            return newErrors;
        });
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, files: [...prev.files, ...Array.from(e.target.files)] }));
    };

    const removeFile = (fileName) => {
        setFormData(prev => ({ ...prev, files: prev.files.filter(file => file.name !== fileName) }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData?.vehicleVIN) newErrors.vehicleVIN = 'Vehicle VIN is required.';
        if (!formData?.planName) newErrors.planName = 'Plan name is required.';
        if (!formData?.customerName) newErrors.customerName = 'Customer name is required.';
        if (!formData?.startDate) newErrors.startDate = 'Start Date is required.';
        if (!formData?.endDate) newErrors.endDate = 'End Date is required.';
        if (formData?.startDate && formData?.endDate && new Date(formData?.startDate) >= new Date(formData?.endDate)) {
            newErrors.endDate = 'End Date must be after Start Date.';
        }
        if (!formData?.premium || formData?.premium <= 0) newErrors.premium = 'Premium must be a positive number.';
        if (!formData?.dealer) newErrors.dealer = 'Dealer is required.';
        setErrors(newErrors);
        return Object.keys(newErrors)?.length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log('Form Submitted:', formData);
            // In a real app, this would dispatch an action to save data.
            alert(`Contract ${isEditing ? 'updated' : 'created'} successfully! (See console for data)`);
            navigate('DASHBOARD'); // Or to the new contract's detail page
        } else {
            alert('Please correct the form errors.');
        }
    };

    const breadcrumbPath = [
        { name: 'Dashboard', onClick: () => navigate('DASHBOARD') },
        { name: 'Contracts', onClick: () => navigate('CONTRACT_LIST') },
        { name: isEditing ? `Edit VSC ${contractId}` : 'New Contract' }
    ];

    return (
        <div className="main-content">
            <Breadcrumbs path={breadcrumbPath} />
            <h2 className="detail-page-title">{isEditing ? `Edit Contract: ${contractId}` : 'Create New Contract'}</h2>

            <form onSubmit={handleSubmit} className="form-container">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
                    <div className="form-group">
                        <label htmlFor="vehicleVIN">Vehicle VIN <span style={{ color: 'var(--status-rejected)' }}>*</span></label>
                        <input
                            type="text"
                            id="vehicleVIN"
                            name="vehicleVIN"
                            value={formData?.vehicleVIN}
                            onChange={handleFieldChange}
                            required
                        />
                        {errors?.vehicleVIN && <div className="error-message">{errors?.vehicleVIN}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="planName">Plan Name <span style={{ color: 'var(--status-rejected)' }}>*</span></label>
                        <input
                            type="text"
                            id="planName"
                            name="planName"
                            value={formData?.planName}
                            onChange={handleFieldChange}
                            required
                        />
                        {errors?.planName && <div className="error-message">{errors?.planName}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="customerName">Customer Name <span style={{ color: 'var(--status-rejected)' }}>*</span></label>
                        <input
                            type="text"
                            id="customerName"
                            name="customerName"
                            value={formData?.customerName}
                            onChange={handleFieldChange}
                            required
                        />
                        {errors?.customerName && <div className="error-message">{errors?.customerName}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="customerEmail">Customer Email (Auto-populated)</label>
                        <input
                            type="email"
                            id="customerEmail"
                            name="customerEmail"
                            value={formData?.customerEmail}
                            readOnly // Example of auto-populated
                            style={{ backgroundColor: 'var(--color-background-muted)' }}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="startDate">Start Date <span style={{ color: 'var(--status-rejected)' }}>*</span></label>
                        <input
                            type="date"
                            id="startDate"
                            name="startDate"
                            value={formData?.startDate}
                            onChange={handleFieldChange}
                            required
                        />
                        {errors?.startDate && <div className="error-message">{errors?.startDate}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="endDate">End Date <span style={{ color: 'var(--status-rejected)' }}>*</span></label>
                        <input
                            type="date"
                            id="endDate"
                            name="endDate"
                            value={formData?.endDate}
                            onChange={handleFieldChange}
                            required
                        />
                        {errors?.endDate && <div className="error-message">{errors?.endDate}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="premium">Premium ($) <span style={{ color: 'var(--status-rejected)' }}>*</span></label>
                        <input
                            type="number"
                            id="premium"
                            name="premium"
                            value={formData?.premium}
                            onChange={handleFieldChange}
                            required
                            min="0"
                        />
                        {errors?.premium && <div className="error-message">{errors?.premium}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="dealer">Dealer <span style={{ color: 'var(--status-rejected)' }}>*</span></label>
                        <input
                            type="text"
                            id="dealer"
                            name="dealer"
                            value={formData?.dealer}
                            onChange={handleFieldChange}
                            required
                        />
                        {errors?.dealer && <div className="error-message">{errors?.dealer}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="mileageAtSale">Mileage at Sale</label>
                        <input
                            type="number"
                            id="mileageAtSale"
                            name="mileageAtSale"
                            value={formData?.mileageAtSale}
                            onChange={handleFieldChange}
                            min="0"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <select
                            id="status"
                            name="status"
                            value={formData?.status}
                            onChange={handleFieldChange}
                        >
                            {Object.entries(CONTRACT_STATUS_MAP)?.map(([key, value]) => (
                                <option key={key} value={key}>{value?.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Attachments</label>
                    <div className="file-upload-container">
                        <input
                            type="file"
                            id="fileUpload"
                            className="file-upload-input"
                            multiple
                            onChange={handleFileChange}
                        />
                        <label htmlFor="fileUpload" className="file-upload-label">
                            Drag & drop files here or click to browse
                        </label>
                    </div>
                    {formData?.files?.length > 0 && (
                        <div className="file-upload-list">
                            {formData?.files?.map((file, index) => (
                                <div key={index} className="file-upload-item">
                                    <span>{file?.name} ({Math.round(file?.size / 1024)} KB)</span>
                                    <button type="button" onClick={() => removeFile(file?.name)}>Remove</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="form-actions">
                    <button type="button" className="button button-secondary" onClick={() => navigate('DASHBOARD')}>Cancel</button>
                    <button type="submit" className="button button-primary">{isEditing ? 'Save Changes' : 'Create Contract'}</button>
                </div>
            </form>
        </div>
    );
};

const DataGridScreen = ({ title, data, columns, navigate, currentUserRole, entityType, createFormScreen, detailScreen }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [filters, setFilters] = useState({});
    const [selectedItems, setSelectedItems] = useState([]);
    const [savedViews, setSavedViews] = useState([{ id: 'default', name: 'All Records', filters: {} }]);
    const [currentView, setCurrentView] = useState('default');

    const userPermissions = ROLES[currentUserRole];
    const canCreate = (entityType === 'CONTRACT_LIST' && userPermissions?.canManageContracts) ||
                      (entityType === 'CLAIM_LIST' && userPermissions?.canManageClaims);
    const canBulkAction = userPermissions?.canAccessAdminFeatures || userPermissions?.canManageContracts || userPermissions?.canManageClaims;
    const canExport = userPermissions?.canAccessAdminFeatures || userPermissions?.canManageContracts || userPermissions?.canManageClaims;

    const handleSort = (columnKey) => {
        if (sortBy === columnKey) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(columnKey);
            setSortDirection('asc');
        }
    };

    const handleFilterChange = (filterKey, value) => {
        setFilters(prev => ({ ...prev, [filterKey]: value }));
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedItems(filteredAndSortedData?.map(item => item?.id));
        } else {
            setSelectedItems([]);
        }
    };

    const handleSelectItem = (id, e) => {
        if (e.target.checked) {
            setSelectedItems(prev => [...prev, id]);
        } else {
            setSelectedItems(prev => prev?.filter(item => item !== id));
        }
    };

    const applyView = (viewId) => {
        const view = savedViews?.find(v => v?.id === viewId);
        if (view) {
            setCurrentView(viewId);
            setFilters(view?.filters);
            setSearchTerm('');
            setSortBy(null);
            setSortDirection('asc');
        }
    };

    const filteredData = data?.filter(item => {
        const matchesSearch = Object.values(item || {})?.some(val =>
            String(val)?.toLowerCase()?.includes(searchTerm?.toLowerCase())
        );
        const matchesFilters = Object.entries(filters || {})?.every(([key, value]) => {
            if (!value) return true;
            return String(item?.[key])?.toLowerCase()?.includes(value?.toLowerCase());
        });
        return matchesSearch && matchesFilters;
    });

    const sortedData = [...filteredData]?.sort((a, b) => {
        if (!sortBy) return 0;
        const aValue = a?.[sortBy];
        const bValue = b?.[sortBy];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortDirection === 'asc' ? aValue?.localeCompare(bValue) : bValue?.localeCompare(aValue);
        }
        return sortDirection === 'asc' ? (aValue - bValue) : (bValue - aValue);
    });

    const filteredAndSortedData = sortedData;

    const breadcrumbPath = [
        { name: 'Dashboard', onClick: () => navigate('DASHBOARD') },
        { name: title }
    ];

    const entityIdKey = entityType === 'CONTRACT_LIST' ? 'contractId' : (entityType === 'CLAIM_LIST' ? 'claimId' : 'renewalId');

    const handleBulkAction = (action) => {
        if (selectedItems?.length === 0) {
            alert('Please select items for bulk action.');
            return;
        }
        alert(`Performing bulk action "${action}" on ${selectedItems?.length} items: ${selectedItems?.join(', ')}`);
        setSelectedItems([]); // Clear selection after action
    };

    const handleExport = (format) => {
        alert(`Exporting ${entityType} data to ${format}...`);
        // In a real app, generate and download file
    };

    const renderEmptyState = () => (
        <div className="data-grid-empty-state">
            <div className="illustration">📊</div>
            <p>No {title.toLowerCase()} found matching your criteria.</p>
            {canCreate && <button className="button button-primary" style={{ marginTop: 'var(--spacing-md)' }} onClick={() => navigate(createFormScreen, { id: 'new' })}>Create New {title.slice(0, -1)}</button>}
        </div>
    );

    return (
        <div className="main-content">
            <Breadcrumbs path={breadcrumbPath} />
            <div className="detail-page-header">
                <h2 className="detail-page-title">{title}</h2>
                <div className="detail-actions">
                    {canCreate && (
                        <button className="button button-primary" onClick={() => navigate(createFormScreen, { id: 'new' })}>
                            Create New {title?.slice(0, -1)}
                        </button>
                    )}
                </div>
            </div>

            <div className="data-grid">
                <div className="data-grid-toolbar">
                    <div className="left-controls">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {/* Example filter dropdown */}
                        <select
                            value={filters?.status || ''}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                        >
                            <option value="">All Statuses</option>
                            {Object.entries(CONTRACT_STATUS_MAP)?.map(([key, val]) => <option key={key} value={key}>{val?.label}</option>)}
                            {Object.entries(CLAIM_STATUS_MAP)?.map(([key, val]) => <option key={key} value={key}>{val?.label}</option>)}
                            {Object.entries(RENEWAL_STATUS_MAP)?.map(([key, val]) => <option key={key} value={key}>{val?.label}</option>)}
                        </select>
                        <select
                            value={currentView}
                            onChange={(e) => applyView(e.target.value)}
                        >
                            {savedViews?.map(view => <option key={view?.id} value={view?.id}>{view?.name}</option>)}
                        </select>
                    </div>
                    <div className="right-controls">
                        {canBulkAction && selectedItems?.length > 0 && (
                            <button className="button" onClick={() => handleBulkAction('Delete')}>Bulk Delete ({selectedItems?.length})</button>
                        )}
                        {canExport && (
                            <>
                                <button className="button" onClick={() => handleExport('Excel')}>Export to Excel</button>
                                <button className="button" onClick={() => handleExport('PDF')}>Export to PDF</button>
                            </>
                        )}
                    </div>
                </div>

                {filteredAndSortedData?.length > 0 ? (
                    <>
                        <div className="data-grid-header">
                            {canBulkAction && (
                                <div>
                                    <input
                                        type="checkbox"
                                        onChange={handleSelectAll}
                                        checked={selectedItems?.length === filteredAndSortedData?.length && filteredAndSortedData?.length > 0}
                                    />
                                </div>
                            )}
                            {columns?.map(col => (
                                <div key={col?.key} onClick={() => handleSort(col?.key)}>
                                    {col?.label}
                                    {sortBy === col?.key && (
                                        <span>{sortDirection === 'asc' ? ' ↑' : ' ↓'}</span>
                                    )}
                                </div>
                            ))}
                            <div>Actions</div> {/* For quick actions */}
                        </div>
                        {filteredAndSortedData?.map(item => (
                            <div key={item?.[entityIdKey]} className={`data-grid-row ${selectedItems?.includes(item?.[entityIdKey]) ? 'selected' : ''}`}>
                                {canBulkAction && (
                                    <div>
                                        <input
                                            type="checkbox"
                                            checked={selectedItems?.includes(item?.[entityIdKey])}
                                            onChange={(e) => handleSelectItem(item?.[entityIdKey], e)}
                                        />
                                    </div>
                                )}
                                {columns?.map(col => (
                                    <div key={col?.key}>
                                        {col?.render ? col?.render(item) : item?.[col?.key]}
                                    </div>
                                ))}
                                <div className="data-grid-cell-actions">
                                    <button onClick={() => navigate(detailScreen, { id: item?.[entityIdKey] })}>View</button>
                                    {(entityType === 'CONTRACT_LIST' && userPermissions?.canManageContracts) ||
                                     (entityType === 'CLAIM_LIST' && userPermissions?.canManageClaims && (item?.status === 'SUBMITTED' || item?.status === 'UNDER_REVIEW')) ? (
                                        <button onClick={() => navigate(createFormScreen, { id: item?.[entityIdKey] })}>Edit</button>
                                    ) : null}
                                </div>
                            </div>
                        ))}
                    </>
                ) : renderEmptyState()}
            </div>
        </div>
    );
};


// --- MAIN APP COMPONENT ---
function App() {
    const [view, setView] = useState({ screen: 'DASHBOARD', params: {} });
    const [currentUser, setCurrentUser] = useState(dummyUsers[0]); // Default to F&I Product Manager
    const [globalSearchTerm, setGlobalSearchTerm] = useState('');
    const [globalSearchResults, setGlobalSearchResults] = useState([]);
    const currentUserRole = currentUser?.role;

    const navigate = useCallback((screen, params = {}) => {
        setView({ screen, params });
        setGlobalSearchTerm(''); // Clear search on navigation
        setGlobalSearchResults([]);
    }, []);

    const handleLogout = useCallback(() => {
        setCurrentUser(null); // Or navigate to a login screen
        navigate('DASHBOARD'); // Redirect to dashboard or login
    }, [navigate]);

    const handleGlobalSearch = useCallback((term) => {
        setGlobalSearchTerm(term);
        if (term.length > 2) {
            const results = [];
            dummyContracts?.forEach(c => {
                if (Object.values(c)?.some(val => String(val)?.toLowerCase()?.includes(term?.toLowerCase()))) {
                    results.push({ type: 'Contract', id: c?.contractId, name: c?.planName, route: 'CONTRACT_DETAIL' });
                }
            });
            dummyClaims?.forEach(cl => {
                if (Object.values(cl)?.some(val => String(val)?.toLowerCase()?.includes(term?.toLowerCase()))) {
                    results.push({ type: 'Claim', id: cl?.claimId, name: cl?.issueDescription?.substring(0, 30), route: 'CLAIM_DETAIL' });
                }
            });
            dummyCustomers?.forEach(cust => {
                if (Object.values(cust)?.some(val => String(val)?.toLowerCase()?.includes(term?.toLowerCase()))) {
                    results.push({ type: 'Customer', id: cust?.customerId, name: cust?.name, route: 'CUSTOMER_DETAIL' });
                }
            });
            setGlobalSearchResults(results.slice(0, 5)); // Limit suggestions
        } else {
            setGlobalSearchResults([]);
        }
    }, []);

    const navigateToForm = useCallback((screen, params) => {
        setView({ screen, params });
    }, []);

    const currentUserPermissions = ROLES[currentUserRole] || {};

    const renderScreen = () => {
        switch (view?.screen) {
            case 'DASHBOARD':
                return <DashboardScreen navigate={navigate} currentUserRole={currentUserRole} />;
            case 'CONTRACT_LIST':
                return (
                    <DataGridScreen
                        title="VSC Contracts"
                        data={dummyContracts}
                        columns={[
                            { key: 'contractId', label: 'ID' },
                            { key: 'customerName', label: 'Customer' },
                            { key: 'planName', label: 'Plan' },
                            { key: 'startDate', label: 'Start Date' },
                            { key: 'endDate', label: 'End Date' },
                            { key: 'status', label: 'Status', render: (item) => <StatusBadge statusKey={item?.status} statusMap={CONTRACT_STATUS_MAP} /> },
                        ]}
                        navigate={navigate}
                        currentUserRole={currentUserRole}
                        entityType="CONTRACT_LIST"
                        createFormScreen="CONTRACT_FORM"
                        detailScreen="CONTRACT_DETAIL"
                    />
                );
            case 'CONTRACT_DETAIL':
                return <ContractDetailScreen contractId={view?.params?.id} navigate={navigate} currentUserRole={currentUserRole} navigateToForm={navigateToForm} />;
            case 'CONTRACT_FORM':
                return <ContractFormScreen contractId={view?.params?.id} navigate={navigate} />;
            case 'CLAIM_LIST':
                return (
                    <DataGridScreen
                        title="Claims"
                        data={dummyClaims}
                        columns={[
                            { key: 'claimId', label: 'ID' },
                            { key: 'contractId', label: 'Contract' },
                            { key: 'claimDate', label: 'Claim Date' },
                            { key: 'issueDescription', label: 'Description' },
                            { key: 'amountRequested', label: 'Requested', render: (item) => `$${item?.amountRequested?.toLocaleString()}` },
                            { key: 'status', label: 'Status', render: (item) => <StatusBadge statusKey={item?.status} statusMap={CLAIM_STATUS_MAP} /> },
                        ]}
                        navigate={navigate}
                        currentUserRole={currentUserRole}
                        entityType="CLAIM_LIST"
                        createFormScreen="CLAIM_FORM"
                        detailScreen="CLAIM_DETAIL"
                    />
                );
            case 'CLAIM_DETAIL':
                return <ClaimDetailScreen claimId={view?.params?.id} navigate={navigate} currentUserRole={currentUserRole} navigateToForm={navigateToForm} />;
            case 'CLAIM_FORM': // A placeholder form for claims
                return <ContractFormScreen contractId={view?.params?.id} navigate={navigate} />; // Reusing ContractFormScreen as a generic form example
            case 'RENEWAL_LIST':
                return (
                    <DataGridScreen
                        title="Renewals"
                        data={dummyRenewals}
                        columns={[
                            { key: 'renewalId', label: 'ID' },
                            { key: 'contractId', label: 'Contract' },
                            { key: 'dueDate', label: 'Due Date' },
                            { key: 'newEndDate', label: 'New End Date' },
                            { key: 'status', label: 'Status', render: (item) => <StatusBadge statusKey={item?.status} statusMap={RENEWAL_STATUS_MAP} /> },
                        ]}
                        navigate={navigate}
                        currentUserRole={currentUserRole}
                        entityType="RENEWAL_LIST"
                        createFormScreen="RENEWAL_FORM"
                        detailScreen="RENEWAL_DETAIL"
                    />
                );
            case 'RENEWAL_DETAIL':
                const renewal = dummyRenewals?.find(r => r?.renewalId === view?.params?.id);
                if (!renewal) {
                    return (
                        <div className="main-content">
                            <Breadcrumbs path={[{ name: 'Dashboard', onClick: () => navigate('DASHBOARD') }, { name: 'Renewal Not Found' }]} />
                            <h2 className="detail-page-title">Renewal Details</h2>
                            <p>Renewal with ID "{view?.params?.id}" not found.</p>
                        </div>
                    );
                }
                const renewalBreadcrumbs = [
                    { name: 'Dashboard', onClick: () => navigate('DASHBOARD') },
                    { name: 'Renewals', onClick: () => navigate('RENEWAL_LIST') },
                    { name: `Renewal ${view?.params?.id}` }
                ];
                return (
                    <div className="main-content">
                        <Breadcrumbs path={renewalBreadcrumbs} />
                        <h2 className="detail-page-title">Renewal: {renewal?.renewalId}</h2>
                        <div className="detail-grid">
                            <div className="detail-section">
                                <h3 className="detail-section-title">Renewal Information</h3>
                                <div className="detail-list">
                                    <div className="detail-item"><span className="detail-label">ID:</span> <span className="detail-value">{renewal?.renewalId}</span></div>
                                    <div className="detail-item"><span className="detail-label">Contract ID:</span> <span className="detail-value"><a onClick={() => navigate('CONTRACT_DETAIL', { id: renewal?.contractId })} style={{ color: 'var(--color-primary)', cursor: 'pointer', textDecoration: 'underline' }}>{renewal?.contractId}</a></span></div>
                                    <div className="detail-item"><span className="detail-label">Due Date:</span> <span className="detail-value">{renewal?.dueDate}</span></div>
                                    <div className="detail-item"><span className="detail-label">New End Date:</span> <span className="detail-value">{renewal?.newEndDate}</span></div>
                                    <div className="detail-item"><span className="detail-label">Status:</span> <span className="detail-value"><StatusBadge statusKey={renewal?.status} statusMap={RENEWAL_STATUS_MAP} /></span></div>
                                    <div className="detail-item"><span className="detail-label">Requested By:</span> <span className="detail-value">{renewal?.requestedBy}</span></div>
                                </div>
                            </div>
                            <AuditLogPanel logs={renewal?.auditLogs} canViewLogs={currentUserPermissions?.canViewAuditLogs} />
                        </div>
                    </div>
                );
            default:
                return <div className="main-content"><h2>Page Not Found</h2><p>The screen "{view?.screen}" does not exist.</p></div>;
        }
    };

    if (!currentUser) {
        return (
            <div className="App" style={{ justifyContent: 'center', alignItems: 'center' }}>
                <div className="form-container" style={{ textAlign: 'center' }}>
                    <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Welcome to VSC App</h2>
                    <p style={{ marginBottom: 'var(--spacing-md)' }}>Please select a user role to simulate login:</p>
                    {dummyUsers?.map(user => (
                        <button
                            key={user?.userId}
                            className="button button-primary"
                            onClick={() => setCurrentUser(user)}
                            style={{ margin: 'var(--spacing-sm)' }}
                        >
                            Login as {user?.name} ({user?.role})
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="App">
            <header className="header">
                <div className="logo">VSC App</div>
                <nav className="header-nav">
                    {currentUserPermissions?.canViewDashboard && <button onClick={() => navigate('DASHBOARD')}>Dashboard</button>}
                    {(currentUserPermissions?.canManageContracts || currentUserPermissions?.canViewDashboard) && <button onClick={() => navigate('CONTRACT_LIST')}>Contracts</button>}
                    {(currentUserPermissions?.canManageClaims || currentUserPermissions?.canViewDashboard) && <button onClick={() => navigate('CLAIM_LIST')}>Claims</button>}
                    {(currentUserPermissions?.canViewDashboard) && <button onClick={() => navigate('RENEWAL_LIST')}>Renewals</button>}
                    {/* Add more navigation based on roles/features */}
                </nav>
                <div className="global-search">
                    <input
                        type="text"
                        placeholder="Global Search..."
                        value={globalSearchTerm}
                        onChange={(e) => handleGlobalSearch(e.target.value)}
                    />
                    {globalSearchTerm?.length > 2 && globalSearchResults?.length > 0 && (
                        <div className="global-search-suggestions">
                            {globalSearchResults?.map(result => (
                                <div key={`${result?.type}-${result?.id}`} onClick={() => navigate(result?.route, { id: result?.id })}>
                                    <strong>{result?.type}:</strong> {result?.name} ({result?.id})
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="user-info">
                    <span>Hello, {currentUser?.name} ({currentUser?.role})</span>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </header>
            {renderScreen()}
        </div>
    );
}

export default App;