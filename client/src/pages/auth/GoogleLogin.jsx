import React from "react";
import { GoogleOAuthProvider, GoogleLogin as GoogleLoginButton } from "@react-oauth/google";
import { useAuth } from "../../context/AuthContext"; 
import { useNavigate } from "react-router-dom";

const GoogleLogin = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const { googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSuccess = async (response) => {
    const credential = response?.credential;
    if (!credential) return alert("No credential received from Google");

    try {
      const result = await googleLogin(credential);
      if (result.success) {
        navigate("/dashboard");
      } else {
        alert(result.error || "Google login failed");
      }
    } catch (error) {
      console.error("Google Login Error:", error);
      alert("Something went wrong during Google login.");
    }
  };

  const handleError = () => alert("Google Sign-In failed. Try again.");

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="w-full flex justify-center">
        <GoogleLoginButton
          onSuccess={handleSuccess}
          onError={handleError}
          useOneTap
          theme="filled_blue"
          width="350" 
          shape="rectangular"
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleLogin;