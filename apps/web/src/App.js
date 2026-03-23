import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AppProviders } from "./app/providers";
import { AppRouter } from "./app/router";
import { AuthBootstrap } from "./features/auth/components/AuthBootstrap";
export const App = () => (_jsxs(AppProviders, { children: [_jsx(AuthBootstrap, {}), _jsx(AppRouter, {})] }));
