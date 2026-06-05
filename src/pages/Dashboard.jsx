import { useEffect, useState } from "react";
import { getMyProfile, logoutCandidate } from "../api/authApi";

function Dashboard({ onLogout }) {
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState("");

  const loadProfile = async () => {
    try {
      const data = await getMyProfile();
      setProfile(data);
    } catch (error) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const logout = async () => {
    await logoutCandidate();
    onLogout();
  };

  return (
    <div className="dashboard">
      <div className="topbar">
        <h2>Candidate Dashboard</h2>
        <button className="danger-btn" onClick={logout}>
          Logout
        </button>
      </div>

      {message && <div className="alert error">{message}</div>}

      {profile && (
        <div className="profile-box">
          <h3>My Profile</h3>
          <pre>{JSON.stringify(profile, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default Dashboard;