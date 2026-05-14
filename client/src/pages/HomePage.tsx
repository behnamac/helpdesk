import Navbar from "../components/Navbar";
import { authClient } from "../lib/auth-client";

export default function HomePage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  return (
    <div className="home-root">
      <Navbar />
      <main className="home-main">
        <div className="home-welcome">
          <p className="home-greeting">Good to see you,</p>
          <h1 className="home-name">{user?.name}</h1>
        </div>
        <div className="home-stats">
          <div className="stat-card">
            <span className="stat-value">0</span>
            <span className="stat-label">Open tickets</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">0</span>
            <span className="stat-label">Resolved today</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">0</span>
            <span className="stat-label">Pending review</span>
          </div>
        </div>
      </main>
    </div>
  );
}
