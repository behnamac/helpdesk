import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, AlertCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
    <div className="relative flex min-h-svh items-center justify-center px-4 py-6">
      <div className="login-bg-grid" />

      <Card className="animate-card-enter relative z-10 w-full max-w-[400px] border-border/60 bg-card shadow-2xl">
        <CardHeader className="pb-6">
          <div className="mb-6 flex items-center gap-2.5">
            <span className="text-xl leading-none text-primary">◈</span>
            <span className="font-mono text-[13px] font-medium tracking-[0.18em] text-foreground/65 uppercase">
              Helpdesk
            </span>
          </div>
          <div>
            <h1 className="font-serif text-[26px] font-bold leading-tight text-foreground">
              Welcome back
            </h1>
            <p className="mt-1.5 text-sm font-light text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="email"
                className="font-mono text-[11px] font-medium tracking-[0.1em] text-muted-foreground uppercase"
              >
                Email address
              </Label>
              <Input
                {...register("email")}
                id="email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                disabled={isSubmitting}
                className={errors.email ? "border-destructive focus-visible:ring-destructive/30" : ""}
              />
              {errors.email && (
                <span className="font-mono text-[11px] text-destructive">{errors.email.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="password"
                className="font-mono text-[11px] font-medium tracking-[0.1em] text-muted-foreground uppercase"
              >
                Password
              </Label>
              <Input
                {...register("password")}
                id="password"
                type="password"
                placeholder="••••••••••"
                autoComplete="current-password"
                disabled={isSubmitting}
                className={errors.password ? "border-destructive focus-visible:ring-destructive/30" : ""}
              />
              {errors.password && (
                <span className="font-mono text-[11px] text-destructive">{errors.password.message}</span>
              )}
            </div>

            {authError && (
              <Alert variant="destructive" className="animate-shake">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 h-11 w-full bg-primary font-medium text-primary-foreground hover:bg-primary/90"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
