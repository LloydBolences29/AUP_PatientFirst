import React from 'react'
import { useState } from 'react';
import './LogInPage.css'

const LogInPage = () => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);

  const handleRegisterClick = () => {
    setIsRightPanelActive(true);
  };

  const handleLoginClick = () => {
    setIsRightPanelActive(false);
  };

  return (
    <div className={`container ${isRightPanelActive ? "right-panel-active" : ""}`} id="container">
      {/* Register Form */}
      <div className="form-container register-container">
        <form action="#">
          <h1>Register here.</h1>
          <input type="text" placeholder="Name" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button type="button">Register</button>      
        </form>
      </div>

      {/* Login Form */}
      <div className="form-container login-container">
        <form action="#">
          <h1>Login here.</h1>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <div className="content">
            <div className="checkbox">
              <input type="checkbox" id="checkbox" />
              <label htmlFor="checkbox">Remember me</label>
            </div>
            <div className="pass-link">
              <a href="#">Forgot password?</a>
            </div>
          </div>
          <button type="button">Login</button>
        </form>
      </div>

      {/* Overlay Section */}
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1 className="title">Hello <br /> friends</h1>
            <p>If you have an account, login here and have fun.</p>
            <button className="ghost" onClick={handleLoginClick}>
              Login <i className="lni lni-arrow-left login"></i>
            </button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1 className="title">Start your <br /> journey now</h1>
            <p>If you don't have an account yet, join us and start your journey.</p>
            <button className="ghost" onClick={handleRegisterClick}>
              Register <i className="lni lni-arrow-right register"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default LogInPage
