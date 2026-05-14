import { Link, useNavigate } from "react-router-dom";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Navbar() {
  const { data: session } = authClient.useSession();
  const navigate = useNavigate();
  const user = session?.user;
  const initial = user?.name?.charAt(0).toUpperCase() ?? "?";
  const isAdmin = user?.role === "admin";

  async function handleSignOut() {
    await authClient.signOut();
    navigate("/login");
  }

  return (
    <nav className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2.5">
          <span className="text-base leading-none text-primary">◈</span>
          <span className="font-mono text-[12px] font-medium tracking-[0.18em] text-foreground/65 uppercase">
            Helpdesk
          </span>
        </div>

        {isAdmin && (
          <Link
            to="/users"
            className="font-mono text-[12px] tracking-[0.06em] text-muted-foreground transition-colors hover:text-foreground"
          >
            Users
          </Link>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Avatar className="h-[30px] w-[30px] border border-primary/30 bg-primary/10">
          <AvatarFallback className="font-mono text-[12px] font-medium text-primary bg-transparent">
            {initial}
          </AvatarFallback>
        </Avatar>
        <span className="text-[13.5px] text-foreground/80">{user?.name}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSignOut}
          className="h-7 border-border px-3 text-[12.5px] text-muted-foreground hover:text-foreground"
        >
          Sign out
        </Button>
      </div>
    </nav>
  );
}
