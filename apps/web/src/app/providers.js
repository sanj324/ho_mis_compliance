import { jsx as _jsx } from "react/jsx-runtime";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
const queryClient = new QueryClient();
export const AppProviders = ({ children }) => (_jsx(QueryClientProvider, { client: queryClient, children: _jsx(BrowserRouter, { children: children }) }));
