

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha"; // import recaptcha

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null); //  store captcha token

  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem("user");
    if (auth) {
      navigate("/");
    }
  }, [navigate]);

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token); // store token when captcha solved
  };

  const collectData = async () => {
    if (!captchaToken) {
      alert("Please verify the CAPTCHA before signing up.");
      return;
    }

    try {
      const response = await fetch("https://foodbackend-kadu.onrender.com/User/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, captchaToken }), //  send captcha token to backend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Signup failed");
      }

      const result = await response.json();
      localStorage.setItem("user", JSON.stringify(result));
      navigate("/home");
    } catch (error) {
      alert(`Signup failed: ${error.message}`);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-banner"></div>
      <div className="signup-form">
        <h1>Create Your Account</h1>
        <input
          className="inputBox"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter Name"
        />
        <input
          className="inputBox"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Email"
        />
        <input
          className="inputBox"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter Password"
        />

        {/*  CAPTCHA component */}
        <ReCAPTCHA
          sitekey="6LfSi0srAAAAAFUL_9CumjllVycNZb6c8hyIn83k" //  get from Google reCAPTCHA admin console
          onChange={handleCaptchaChange}
        />

        <button onClick={collectData} className="signup-btn" type="button">
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Signup;
