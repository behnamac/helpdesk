import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authClient } from "../lib/auth-client";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginFields = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { data: session, isPending } = authClient.useSession();
  const [authError, setAuthError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFields>({ resolver: zodResolver(loginSchema) });

  useEffect(() => {
    if (!isPending && session) navigate("/", { replace: true });
  }, [session, isPending, navigate]);

  async function onSubmit(data: LoginFields) {
    setAuthError("");
    const { error } = await authClient.signIn.email({ email: data.email, password: data.password });
    if (error) setAuthError(error.message ?? "Invalid email or password.");
    else navigate("/");
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

        <form onSubmit={handleSubmit(onSubmit)} className="login-form" noValidate>
          <div className="field-group">
            <label className="field-label" htmlFor="email">Email address</label>
            <input
              {...register("email")}
              id="email"
              type="email"
              className={`field-input${errors.email ? " field-input--error" : ""}`}
              placeholder="you@company.com"
              autoComplete="email"
              disabled={isSubmitting}
            />
            {errors.email && <span className="field-error">{errors.email.message}</span>}
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="password">Password</label>
            <input
              {...register("password")}
              id="password"
              type="password"
              className={`field-input${errors.password ? " field-input--error" : ""}`}
              placeholder="••••••••••"
              autoComplete="current-password"
              disabled={isSubmitting}
            />
            {errors.password && <span className="field-error">{errors.password.message}</span>}
          </div>

          {authError && (
            <div className="login-error" role="alert">
              <span className="error-icon">!</span>
              {authError}
            </div>
          )}

          <button type="submit" className="login-btn" disabled={isSubmitting}>
            {isSubmitting ? <span className="btn-spinner" /> : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
