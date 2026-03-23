import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { DataTablePlaceholder } from "../../../components/common/DataTablePlaceholder";
import { PageTitle } from "../../../components/common/PageTitle";
import { investmentApi } from "../services/investmentApi";
export const InvestmentReportsPage = () => {
    const { data: register = [] } = useQuery({
        queryKey: ["investments", "reports", "register"],
        queryFn: investmentApi.getRegisterReport
    });
    const { data: maturityLadder = [] } = useQuery({
        queryKey: ["investments", "reports", "maturity-ladder"],
        queryFn: investmentApi.getMaturityLadder
    });
    const { data: exposure = [] } = useQuery({
        queryKey: ["investments", "reports", "exposure-summary"],
        queryFn: investmentApi.getExposureSummary
    });
    const { data: checks } = useQuery({
        queryKey: ["investments", "exposure", "checks"],
        queryFn: investmentApi.getExposureChecks
    });
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(PageTitle, { title: "Investment Reports", subtitle: "Register, Maturity, and Exposure Views" }), _jsx(DataTablePlaceholder, { columns: ["investmentCode", "securityName", "classification", "issuer", "counterparty", "bookValue", "rating"], rows: register.map((row) => ({
                    investmentCode: row.investmentCode,
                    securityName: row.securityName,
                    classification: row.classification,
                    issuer: row.issuer,
                    counterparty: row.counterparty,
                    bookValue: row.bookValue,
                    rating: row.rating
                })) }), _jsx(DataTablePlaceholder, { columns: ["bucket", "count", "totalBookValue"], rows: maturityLadder.map((row) => ({
                    bucket: row.bucket,
                    count: String(row.count),
                    totalBookValue: row.totalBookValue.toFixed(2)
                })) }), _jsx(DataTablePlaceholder, { columns: ["category", "name", "totalBookValue", "percentageOfPortfolio"], rows: exposure.map((row) => ({
                    category: row.category,
                    name: row.name,
                    totalBookValue: row.totalBookValue.toFixed(2),
                    percentageOfPortfolio: `${row.percentageOfPortfolio.toFixed(2)}%`
                })) }), _jsx(DataTablePlaceholder, { columns: ["investmentCode", "exceptionCode", "message", "severity"], rows: (checks?.exceptions ?? []).map((row) => ({
                    investmentCode: row.investmentCode,
                    exceptionCode: row.exceptionCode,
                    message: row.message,
                    severity: row.severity
                })) })] }));
};
