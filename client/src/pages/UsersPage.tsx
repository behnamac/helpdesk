import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { authClient } from "@/lib/auth-client";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authClient.admin.listUsers({ query: { limit: 100 } }).then(({ data }) => {
      setUsers((data?.users as User[]) ?? []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-svh bg-background">
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 py-13">
        <div className="mb-10">
          <p className="mb-1.5 font-mono text-sm tracking-[0.04em] text-muted-foreground">
            Administration
          </p>
          <h1 className="font-serif text-[40px] font-bold leading-tight text-foreground">
            Users
          </h1>
        </div>

        <div className="rounded-lg border border-border/60 bg-card">
          <Table>
            <TableHeader>
              <TableRow className="border-border/60 hover:bg-transparent">
                <TableHead className="font-mono text-[11px] tracking-[0.1em] uppercase text-muted-foreground">
                  Name
                </TableHead>
                <TableHead className="font-mono text-[11px] tracking-[0.1em] uppercase text-muted-foreground">
                  Email
                </TableHead>
                <TableHead className="font-mono text-[11px] tracking-[0.1em] uppercase text-muted-foreground">
                  Role
                </TableHead>
                <TableHead className="font-mono text-[11px] tracking-[0.1em] uppercase text-muted-foreground">
                  Joined
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-12 text-center text-sm text-muted-foreground">
                    Loading users…
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-12 text-center text-sm text-muted-foreground">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} className="border-border/40">
                    <TableCell className="font-medium text-foreground/90">
                      {user.name}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      {user.role === "admin" ? (
                        <Badge className="border-primary/40 bg-primary/10 font-mono text-[10px] tracking-wider text-primary hover:bg-primary/15">
                          admin
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="font-mono text-[10px] tracking-wider text-muted-foreground">
                          agent
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
