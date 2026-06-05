import { useEffect, useState } from "react";
import {
  registerCandidate,
  resendVerificationEmail,
  checkEmailVerified,
} from "../api/authApi";

function Register({ goToLogin }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [lastRegisteredEmail, setLastRegisteredEmail] = useState("");
  const [showResendButton, setShowResendButton] = useState(false);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const [countdown, setCountdown] = useState(0);
  const [verified, setVerified] = useState(false);

  // countdown timer
  useEffect(() => {
    if (countdown <= 0 || verified) {
      return;
    }

    const timer = setInterval(() => {
      setCountdown((old) => old - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, verified]);

  // show resend button when countdown expired
  useEffect(() => {
    if (countdown === 0 && lastRegisteredEmail && !verified) {
      setShowResendButton(true);
    }
  }, [countdown, lastRegisteredEmail, verified]);

  // check email verification every 5 seconds
  useEffect(() => {
    if (!lastRegisteredEmail || verified) {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const data = await checkEmailVerified(lastRegisteredEmail);

        if (data.verified) {
          setVerified(true);
          setMessage("Your account has been verified. You can login now.");
          setShowResendButton(false);
          setCountdown(0);
          clearInterval(interval);
        }
      } catch (error) {
        console.log(error.message);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [lastRegisteredEmail, verified]);

  const formatTime = (seconds) => {
    const minute = Math.floor(seconds / 60);
    const second = seconds % 60;

    return `${minute}:${second.toString().padStart(2, "0")}`;
  };

  const handleChange = (e) => {
    setForm((old) => ({
      ...old,
      [e.target.name]: e.target.value,
    }));
  };

  const submitRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    setVerified(false);

    try {
      const data = await registerCandidate(form);

      setMessage(
        data.message ||
          "Register successful. Please check your email to verify account."
      );

      setLastRegisteredEmail(form.email);

      // 5 minutes countdown
      setCountdown(5 * 60);

      // hide resend button first
      setShowResendButton(false);

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      });
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!lastRegisteredEmail) {
      setMessage("Please register first or enter your email again.");
      return;
    }

    setResending(true);
    setMessage("");
    setVerified(false);

    try {
      const data = await resendVerificationEmail(lastRegisteredEmail);

      setMessage(
        data.message ||
          "Verification email sent again. Please check your email."
      );

      // restart countdown again after resend
      setCountdown(5 * 60);
      setShowResendButton(false);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="auth-card">
      <h2>Register Candidate</h2>
      <p>Create your Job Spring candidate account.</p>

      {message && <div className="alert">{message}</div>}

      {verified && (
        <div className="verify-box success">
          <h3>Account Verified ✅</h3>
          <p>Your account has been verified. You can login now.</p>

          <button type="button" onClick={goToLogin}>
            Go to Login
          </button>
        </div>
      )}

      {lastRegisteredEmail && countdown > 0 && !verified && (
        <div className="verify-box">
          <p>
            Verification email sent to{" "}
            <strong>{lastRegisteredEmail}</strong>
          </p>
          <p>
            Link expires in:{" "}
            <strong className="countdown">{formatTime(countdown)}</strong>
          </p>
          <p className="small-text">
            Please check your email and click the verification link before it expires.
          </p>
        </div>
      )}

      {lastRegisteredEmail && countdown === 0 && !verified && (
        <div className="verify-box expired">
          <p>
            Verification link may be expired for{" "}
            <strong>{lastRegisteredEmail}</strong>.
          </p>
          <p className="small-text">
            Please click resend verification email.
          </p>
        </div>
      )}

      {!verified && (
        <form onSubmit={submitRegister}>
          <label>First Name</label>
          <input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="Bun"
            required
          />

          <label>Last Name</label>
          <input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Paninn"
            required
          />

          <label>Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="candidate@gmail.com"
            required
          />

          <label>Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />

          <button disabled={loading} type="submit">
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      )}

      {showResendButton && !verified && (
        <div className="resend-box">
          <button
            type="button"
            className="secondary-btn"
            onClick={handleResendVerification}
            disabled={resending}
          >
            {resending ? "Sending..." : "Resend Verification Email"}
          </button>
        </div>
      )}

      <p className="switch-text">
        Already have account?{" "}
        <button type="button" className="link-btn" onClick={goToLogin}>
          Login
        </button>
      </p>
    </div>
  );
}

export default Register;