import { useEffect, useState } from "react";
import api from "../api/api";
import keycloak from "../auth/keycloak";

function Profile({ logout, token }) {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    location: "",
    currentPosition: "",
    expectedSalary: "",
    profilePhotoUrl: "",
    summary: "",
  });

  const [message, setMessage] = useState("");

  const loadProfile = async () => {
    try {
      const response = await api.get("/api/candidates/me");

      setProfile(response.data);

      setForm({
        fullName: response.data.fullName || "",
        phone: response.data.phone || "",
        location: response.data.location || "",
        currentPosition: response.data.currentPosition || "",
        expectedSalary: response.data.expectedSalary || "",
        profilePhotoUrl: response.data.profilePhotoUrl || "",
        summary: response.data.summary || "",
      });
    } catch (error) {
      console.error(error);
      setMessage("Failed to load profile");
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (e) => {
    setForm((old) => ({
      ...old,
      [e.target.name]: e.target.value,
    }));
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...form,
        expectedSalary: form.expectedSalary
          ? Number(form.expectedSalary)
          : null,
      };

      const response = await api.put("/api/candidates/me", payload);

      setProfile(response.data);
      setMessage("Profile updated successfully");
    } catch (error) {
      console.error(error);
      setMessage("Failed to update profile");
    }
  };

  return (
    <div>
      <div className="top-bar">
        <div>
          <h2>Candidate Dashboard</h2>
          <p>
            Login as: <strong>{keycloak.tokenParsed?.email}</strong>
          </p>
          <p>
            Role:{" "}
            <strong>
              {keycloak.tokenParsed?.realm_access?.roles?.join(", ")}
            </strong>
          </p>
        </div>

        <button className="logout" onClick={logout}>
          Logout
        </button>
      </div>

      {message && <p className="message">{message}</p>}

      {profile && (
        <div className="card">
          <h3>Current Profile Response</h3>
          <pre>{JSON.stringify(profile, null, 2)}</pre>
        </div>
      )}

      <form className="card form" onSubmit={updateProfile}>
        <h3>Update Candidate Profile</h3>

        <label>Full Name</label>
        <input
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
        />

        <label>Phone</label>
        <input name="phone" value={form.phone} onChange={handleChange} />

        <label>Location</label>
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
        />

        <label>Current Position</label>
        <input
          name="currentPosition"
          value={form.currentPosition}
          onChange={handleChange}
        />

        <label>Expected Salary</label>
        <input
          name="expectedSalary"
          type="number"
          value={form.expectedSalary}
          onChange={handleChange}
        />

        <label>Profile Photo URL</label>
        <input
          name="profilePhotoUrl"
          value={form.profilePhotoUrl}
          onChange={handleChange}
        />

        <label>Summary</label>
        <textarea
          name="summary"
          value={form.summary}
          onChange={handleChange}
          rows="4"
        />

        <button type="submit">Update Profile</button>
      </form>

      <div className="card">
        <h3>Access Token</h3>
        <textarea readOnly value={token || ""} rows="8" />
      </div>
    </div>
  );
}

export default Profile;