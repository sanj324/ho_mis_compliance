import { Bell, BookOpenCheck, Boxes, BriefcaseBusiness, Building2, FileText, Landmark, LayoutDashboard, LineChart, Package, ShieldCheck, Users } from "lucide-react";
export const appMenuSections = [
    {
        title: "Overview",
        items: [{ label: "Dashboard", path: "/", icon: LayoutDashboard }]
    },
    {
        title: "Governance",
        items: [
            { label: "Users", path: "/users", icon: Users },
            { label: "Branches", path: "/branches", icon: Building2 },
            { label: "Audit Trail", path: "/audit-logs", icon: ShieldCheck },
            { label: "Notifications", path: "/notifications", icon: Bell },
            { label: "Documents", path: "/documents", icon: FileText },
            { label: "Ledger Posting", path: "/ledger/postings", icon: Landmark },
            { label: "Vouchers", path: "/ledger/vouchers", icon: Landmark }
        ]
    },
    {
        title: "Compliance",
        items: [
            { label: "Compliance Dashboard", path: "/compliance/dashboard", icon: BookOpenCheck },
            { label: "Compliance Events", path: "/compliance/events", icon: BookOpenCheck },
            { label: "Compliance Calendar", path: "/compliance/calendar", icon: BookOpenCheck }
        ]
    },
    {
        title: "Masters",
        items: [
            { label: "Departments", path: "/masters/departments", icon: Landmark },
            { label: "Designations", path: "/masters/designations", icon: Landmark },
            { label: "Cost Centers", path: "/masters/cost-centers", icon: Landmark }
        ]
    },
    {
        title: "Payroll",
        items: [
            { label: "Payroll Dashboard", path: "/payroll/dashboard", icon: BriefcaseBusiness },
            { label: "Employees", path: "/payroll/employees", icon: BriefcaseBusiness },
            { label: "Attendance", path: "/payroll/attendance", icon: BriefcaseBusiness },
            { label: "Salary Structures", path: "/payroll/salary-structures", icon: BriefcaseBusiness },
            { label: "Payroll Run", path: "/payroll/runs", icon: BriefcaseBusiness },
            { label: "Payroll Reports", path: "/payroll/reports", icon: BriefcaseBusiness }
        ]
    },
    {
        title: "Investments",
        items: [
            { label: "Investment Dashboard", path: "/investments/dashboard", icon: LineChart },
            { label: "Investments", path: "/investments", icon: LineChart },
            { label: "Counterparties", path: "/investments/counterparties", icon: LineChart },
            { label: "Security Types", path: "/investments/security-types", icon: LineChart },
            { label: "Issuers", path: "/investments/issuers", icon: LineChart },
            { label: "Brokers", path: "/investments/brokers", icon: LineChart },
            { label: "Investment Reports", path: "/investments/reports", icon: LineChart }
        ]
    },
    {
        title: "Assets",
        items: [
            { label: "Asset Dashboard", path: "/assets/dashboard", icon: Boxes },
            { label: "Assets", path: "/assets", icon: Boxes },
            { label: "Asset Categories", path: "/assets/categories", icon: Boxes },
            { label: "Depreciation Methods", path: "/assets/depreciation-methods", icon: Boxes },
            { label: "Depreciation Run", path: "/assets/depreciation-run", icon: Boxes },
            { label: "Insurance", path: "/assets/insurance", icon: Boxes },
            { label: "Asset Transfers", path: "/assets/transfers", icon: Boxes },
            { label: "Asset Disposals", path: "/assets/disposals", icon: Boxes },
            { label: "Asset Reports", path: "/assets/reports", icon: Boxes }
        ]
    },
    {
        title: "Stationery",
        items: [
            { label: "Stationery Dashboard", path: "/stationery/dashboard", icon: Package },
            { label: "Items", path: "/stationery/items", icon: Package },
            { label: "Vendors", path: "/stationery/vendors", icon: Package },
            { label: "Requisitions", path: "/stationery/requisitions", icon: Package },
            { label: "Stock Issues", path: "/stationery/issues", icon: Package },
            { label: "Stock Transfers", path: "/stationery/transfers", icon: Package },
            { label: "Stationery Reports", path: "/stationery/reports", icon: Package }
        ]
    },
    {
        title: "Share Capital",
        items: [
            { label: "Share Capital Dashboard", path: "/share-capital/dashboard", icon: Landmark },
            { label: "Members", path: "/share-capital/members", icon: Landmark },
            { label: "Share Classes", path: "/share-capital/share-classes", icon: Landmark },
            { label: "Allotments", path: "/share-capital/allotments", icon: Landmark },
            { label: "Transfers", path: "/share-capital/transfers", icon: Landmark },
            { label: "Redemptions", path: "/share-capital/redemptions", icon: Landmark },
            { label: "Dividends", path: "/share-capital/dividends", icon: Landmark },
            { label: "Share Capital Reports", path: "/share-capital/reports", icon: Landmark }
        ]
    }
];
