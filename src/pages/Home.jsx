function Home({ login, register }) {
  return (
    <div className="card">
      <h2>Candidate Auth Test</h2>
      <p>Register and login using Keycloak.</p>

      <div className="button-group">
        <button onClick={register}>Register Candidate</button>
        <button onClick={login}>Login</button>
      </div>

      <p className="note">
        Register will open Keycloak registration page. After verification, you
        can login and test Spring Boot API.
      </p>
    </div>
  );
}

export default Home;