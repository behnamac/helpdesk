import { useNavigate } from "react-router-dom";
import { authClient } from "../lib/auth-client";

export default function Navbar() {
  const { data: session } = authClient.useSession();
  const navigate = useNavigate();
  const user = session?.user;

  const initial = user?.name?.charAt(0).toUpperCase() ?? "?";

  async function handleSignOut() {
    await authClient.signOut();
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo-mark">◈</span>
        <span className="navbar-title">HELPDESK</span>
      </div>
      <div className="navbar-user">
        <div className="user-avatar">{initial}</div>
        <span className="user-name">{user?.name}</span>
        <button onClick={handleSignOut} className="signout-btn">
          Sign out
        </button>
      </div>
    </nav>
  );
}
