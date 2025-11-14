import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, OrbitControls } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import "./Auth.css";
import {
  doSignInWithEmailAndPassword,
  doSigtnInGoogle,
  doCreateUserWithEmailAndPassword,
} from "../../firebase/auth";

const FloatingShapes = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#6366f1" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a855f7" />

      <Sphere args={[1, 100, 200]} position={[-2, 0, 0]} scale={1.5}>
        <MeshDistortMaterial
          color="#6366f1"
          attach="material"
          distort={0.4}
          speed={1.5}
          roughness={0}
        />
      </Sphere>

      <Sphere args={[1, 100, 200]} position={[2, 1, -1]} scale={1}>
        <MeshDistortMaterial
          color="#a855f7"
          attach="material"
          distort={0.5}
          speed={2}
          roughness={0}
        />
      </Sphere>

      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
    </>
  );
};

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        if (isLogin) {
          // Login
          await doSignInWithEmailAndPassword(formData.email, formData.password);
          navigate("/dashboard");
        } else {
          // Sign up
          if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setIsSigningIn(false);
            return;
          }
          await doCreateUserWithEmailAndPassword(
            formData.email,
            formData.password
          );
          navigate("/dashboard");
        }
      } catch (err) {
        setError(err.message);
        setIsSigningIn(false);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isSigningIn) {
      setIsSigningIn(true);
      setError("");
      try {
        await doSigtnInGoogle();
        navigate("/dashboard");
      } catch (err) {
        setError(err.message);
        setIsSigningIn(false);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-canvas">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <FloatingShapes />
        </Canvas>
      </div>

      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="auth-header">
          <h1 className="auth-logo">Citicore</h1>
          <p className="auth-subtitle">Data Dashboard</p>
        </div>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`auth-tab ${!isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.form
            key={isLogin ? "login" : "signup"}
            className="auth-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
            transition={{ duration: 0.3 }}
          >
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required={!isLogin}
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>

            {!isLogin && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required={!isLogin}
                />
              </div>
            )}

            {isLogin && (
              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="forgot-link">
                  Forgot password?
                </a>
              </div>
            )}

            {error && (
              <div
                className="error-message"
                style={{
                  color: "red",
                  marginBottom: "1rem",
                  textAlign: "center",
                }}
              >
                {error}
              </div>
            )}

            <motion.button
              type="submit"
              className="auth-submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSigningIn}
            >
              {isSigningIn
                ? "Processing..."
                : isLogin
                ? "Login"
                : "Create Account"}
            </motion.button>

            <div
              className="divider"
              style={{ margin: "1.5rem 0", textAlign: "center", color: "#888" }}
            >
              or
            </div>

            <motion.button
              type="button"
              className="google-signin"
              onClick={handleGoogleSignIn}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSigningIn}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #ddd",
                borderRadius: "8px",
                background: "white",
                color: "#333",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path
                  fill="#4285F4"
                  d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
                />
                <path
                  fill="#34A853"
                  d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
                />
                <path
                  fill="#FBBC05"
                  d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"
                />
                <path
                  fill="#EA4335"
                  d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"
                />
              </svg>
              Continue with Google
            </motion.button>
          </motion.form>
        </AnimatePresence>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              className="auth-switch"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
