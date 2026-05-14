import Navbar from "@/components/Navbar";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const stats = [
    { value: "0", label: "Open tickets" },
    { value: "0", label: "Resolved today" },
    { value: "0", label: "Pending review" },
  ];

  return (
    <div className="min-h-svh bg-background">
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 py-13">
        <div className="mb-12">
          <p className="mb-1.5 font-mono text-sm tracking-[0.04em] text-muted-foreground">
            Good to see you,
          </p>
          <h1 className="font-serif text-[40px] font-bold leading-tight text-foreground">
            {user?.name}
          </h1>
        </div>

        <div className="grid grid-cols-3 gap-4 max-sm:grid-cols-1">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className="animate-card-enter border-border/60 bg-card transition-colors hover:border-border hover:bg-secondary"
            >
              <CardContent className="flex flex-col gap-1.5 p-7">
                <span className="font-serif text-[36px] font-bold leading-none text-foreground">
                  {stat.value}
                </span>
                <span className="font-mono text-[11px] font-medium tracking-[0.1em] text-muted-foreground uppercase">
                  {stat.label}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
