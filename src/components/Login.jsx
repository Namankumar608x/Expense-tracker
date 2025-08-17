import { Link, useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import "../styling/Login.css";

function Login() {
  const navigate = useNavigate();

  // Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Signed in user:", user);
      navigate("/dashboard");
    } catch (err) {
      console.error("Google Sign-in error:", err);
    }
  };

  return (
    <div className="login-container">

      <div className="login-bg-decoration">
        <div className="floating-circle circle-1"></div>
        <div className="floating-circle circle-2"></div>
        <div className="floating-circle circle-3"></div>
      </div>

      <div className="container-fluid h-100 d-flex align-items-center justify-content-center">
        <div className="login-card card border-0 shadow-lg">
          <div className="card-body p-5">
       
            <div className="text-center mb-4">
              <div className="login-logo mb-3">
                <svg width="32" height="32" fill="white" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="login-title mb-2">ExpenseTracker</h1>
              <p className="login-subtitle text-muted">Track. Save. Achieve.</p>
            </div>

            <div className="text-center mb-4">
              <h2 className="h4 fw-bold text-dark mb-2">Welcome back!</h2>
              <p className="text-muted">Sign in to manage your finances</p>
            </div>

            <div className="mb-4">
              <button
                onClick={handleGoogleSignIn}
                type="button"
                className="btn google-signin-btn w-100 d-flex align-items-center justify-content-center"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="google-icon me-3"
                />
                <span className="fw-semibold">Continue with Google</span>
              </button>
            </div>

            <div className="divider-section my-4">
              <hr className="divider-line" />
              <span className="divider-text bg-white px-3 text-muted">
                Join thousands of smart savers
              </span>
            </div>

 
            <div className="row mb-4">
              <div className="col-4">
                <div className="text-center feature-item">
                  <div className="feature-icon feature-icon-green mb-2">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <p className="feature-text">Track</p>
                </div>
              </div>
              <div className="col-4">
                <div className="text-center feature-item">
                  <div className="feature-icon feature-icon-blue mb-2">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <p className="feature-text">Secure</p>
                </div>
              </div>
              <div className="col-4">
                <div className="text-center feature-item">
                  <div className="feature-icon feature-icon-purple mb-2">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <p className="feature-text">Analyze</p>
                </div>
              </div>
            </div>

            <p className="text-center text-muted mb-3">
              New to ExpenseTracker?{" "}
              <Link to="/signup" className="signup-link">
                Start tracking now
              </Link>
            </p>

            <p className="text-center terms-text">
              Your financial data is encrypted and secure
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;