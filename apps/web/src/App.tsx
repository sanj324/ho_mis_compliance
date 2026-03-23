import type { ReactElement } from "react";
import { AppProviders } from "./app/providers";
import { AppRouter } from "./app/router";
import { AuthBootstrap } from "./features/auth/components/AuthBootstrap";

export const App = (): ReactElement => (
  <AppProviders>
    <AuthBootstrap />
    <AppRouter />
  </AppProviders>
);
