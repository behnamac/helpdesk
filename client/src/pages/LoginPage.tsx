import { type FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authClient } from "../lib/auth-client";

export default function LoginPage() {
  const navigate = useNavigate();
  const { data: session, isPending } = authClient.useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isPending && session) navigate("/", { replace: true });
  }, [session, isPending, navigate]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await authClient.signIn.email({ email, password });

    if (error) {
      setError(error.message ?? "Invalid email or password.");
      setLoading(false);
    } else {
      navigate("/");
    }
  }

  return (
    <div className="login-root">
      <div className="login-bg-grid" />

      <div className="login-card">
        <div className="login-brand">
          <span className="login-logo-mark">◈</span>
          <span className="login-logo-text">HELPDESK</span>
        </div>

        <div className="login-header">
          <h1 className="login-heading">Welcome back</h1>
          <p className="login-subheading">Sign in to your account to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <div className="field-group">
            <label className="field-label" htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              className="field-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              autoComplete="email"
              required
              disabled={loading}
            />
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="field-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
              autoComplete="current-password"
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className="login-error" role="alert">
              <span className="error-icon">!</span>
              {error}
            </div>
          )}

          <button type="submit" className="login-btn" disabled={loading || !email || !password}>
            {loading ? (
              <span className="btn-spinner" />
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
