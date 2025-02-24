import { useState, useRef } from "react";
import axios from "axios";
import "./InputForm.css";

const InputForm = ({ setIsOpen }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  // Auto-focus on the first input field when switching between login/signup
  const toggleAuthMode = () => {
    setIsSignUp((prev) => !prev);
    setError("");
    setTimeout(() => emailRef.current?.focus(), 0);
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const endpoint = isSignUp ? "SignUp" : "Login";
      const { data } = await axios.post(
        `https://backendfoodappwcl.onrender.com/User/${endpoint}`,
        { email, password }
      );

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setIsOpen();
      alert(isSignUp ? "Account created successfully!" : "Login successful!");
    } catch (err) {
      setError(
        err.response?.data?.error || "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form className="form" onSubmit={handleOnSubmit}>
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            ref={emailRef}
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            ref={passwordRef}
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Processing..." : isSignUp ? "Sign Up" : "Login"}
        </button>
        {isLoading && <div className="spinner"></div>}
        {error && (
          <h6 className="error" aria-live="polite">
            {error}
          </h6>
        )}
        <p onClick={toggleAuthMode} className="auth-toggle">
          {isSignUp
            ? "Already have an account? Log in"
            : "Create a new account"}
        </p>
      </form>

      {/* CSS for Spinner */}
      <style>
        {`
          .spinner {
            margin: 10px auto;
            border: 4px solid rgba(0, 0, 0, 0.1);
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border-left-color: #09f;
            animation: spin 1s ease infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .auth-toggle {
            color: #007bff;
            cursor: pointer;
            text-decoration: underline;
            font-size: 14px;
          }
          .auth-toggle:hover {
            color: #0056b3;
          }
        `}
      </style>
    </>
  );
};

export default InputForm;
