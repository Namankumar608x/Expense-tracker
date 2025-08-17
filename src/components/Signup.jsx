import { Link, useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import "../styling/Signup.css"; 
function Signup() {
  const navigate = useNavigate();


  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("New user signed up:", user);
      navigate("/dashboard"); 
    } catch (err) {
      console.error("Google Sign-up error:", err);
    }
  };

  return (
    <div className="signup-container">
    
      <div className="signup-bg-decoration">
        <div className="floating-circle circle-1"></div>
        <div className="floating-circle circle-2"></div>
        <div className="floating-circle circle-3"></div>
        <div className="floating-circle circle-4"></div>
      </div>

      <div className="container-fluid h-100 d-flex align-items-center justify-content-center">
        <div className="signup-card card border-0 shadow-lg">
          <div className="card-body p-5">
      
            <div className="text-center mb-4">
              <div className="signup-logo mb-3">
                <svg width="32" height="32" fill="white" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="signup-title mb-2">ExpenseTracker</h1>
              <p className="signup-subtitle text-muted">Track. Save. Achieve.</p>
            </div>

          
            <div className="text-center mb-4">
              <h2 className="h4 fw-bold text-dark mb-2">Start Your Journey!</h2>
              <p className="text-muted">Join thousands who've transformed their finances</p>
            </div>

            <div className="benefits-section mb-4">
              <div className="benefit-item">
                <div className="benefit-icon">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="benefit-text">Track all your expenses in one place</span>
              </div>
            </div>

            <div className="mb-4">
              <button
                onClick={handleGoogleSignUp}
                type="button"
                className="btn google-signup-btn w-100 d-flex align-items-center justify-content-center"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="google-icon me-3"
                />
                <span className="fw-semibold">Sign up with Google</span>
              </button>
            </div>

            <div className="divider-section my-4">
              <hr className="divider-line" />
              <span className="divider-text bg-white px-3 text-muted">
                What you'll get
              </span>
            </div>

    
            <div className="row mb-4">
              <div className="col-6">
                <div className="feature-card">
                  <div className="feature-icon-small feature-icon-green mb-2">
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="feature-title">Smart Analytics</div>
                  <div className="feature-desc">Visual reports & insights</div>
                </div>
              </div>
              <div className="col-6">
                <div className="feature-card">
                  <div className="feature-icon-small feature-icon-blue mb-2">
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 9h11l-5-5v5zm-5 8h4v-6H4v6z" />
                    </svg>
                  </div>
                  <div className="feature-title">Goal Setting</div>
                  <div className="feature-desc">Achieve savings targets</div>
                </div>
              </div>
            </div>

   
            <p className="text-center text-muted mb-3">
              Already have an account?{" "}
              <Link to="/login" className="signin-link">
                Sign in here
              </Link>
            </p>

            <p className="text-center terms-text">
              By signing up, you agree to our{" "}
              <a href="#" className="terms-link">Terms</a> and{" "}
              <a href="#" className="terms-link">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;