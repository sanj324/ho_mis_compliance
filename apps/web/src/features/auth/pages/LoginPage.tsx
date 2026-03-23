import type { ReactElement } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { PageTitle } from "../../../components/common/PageTitle";
import { authApi } from "../services/authApi";
import { useAuthStore } from "../store/authStore";

export const LoginPage = (): ReactElement => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [username, setUsername] = useState("admin.ho");
  const [password, setPassword] = useState("Admin@123");
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center px-6">
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-panel">
        <PageTitle title="Login" subtitle="Phase 1 Access" />
        <form
          className="mt-6 space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            setError(null);
            try {
              const result = await authApi.login({ username, password });
              setAuth(result);
              navigate("/", { replace: true });
            } catch {
              setError("Login failed. Check API, database seed, and credentials.");
            }
          }}
        >
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-3"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Username"
          />
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-3"
            value={password}
            type="password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
          />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button className="w-full rounded-xl bg-brand-500 px-4 py-3 font-medium text-white" type="submit">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};
