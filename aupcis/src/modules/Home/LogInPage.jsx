import React from "react";
import { useState } from "react";
import "./LogInPage.css";

const LogInPage = () => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);

  const handleRegisterClick = () => {
    setIsRightPanelActive(true);
  };

  const handleLoginClick = () => {
    setIsRightPanelActive(false);
  };

  return (
    <>
    <div className="body-form">
      <div
        className={` login-register-container ${
          isRightPanelActive ? "right-panel-active" : ""
        }`}
        id="container"
      >
        {/* Register Form */}
        <div className="form-container register-container">
          <form className="login-register-form" action="#">
            <h1 className="head-one">Register here.</h1>
            <input className="login-register-input" type="text" placeholder="Name" />
            <input className="login-register-input" type="email" placeholder="Email" />
            <input className="login-register-input" type="password" placeholder="Password" />
            <button className="login-register-btn" type="button">Register</button>
          </form>
        </div>

        {/* Login Form */}
        <div className="form-container login-container">
          <form className="login-register-form" action="#">
            <h1 className="head-one">Login here.</h1>
            <input className="login-register-input" type="email" placeholder="Email" />
            <input className="login-register-input" type="password" placeholder="Password" />
            <div className="loginFormContent">
              <div className="checkbox">
                <input className="login-register-input" type="checkbox" id="checkbox" />
                <label className="login-register-label" htmlFor="checkbox">Remember me</label>
              </div>
              <div className="pass-link">
                <a className="login-register-a" href="#">Forgot password?</a>
              </div>
            </div>
            <button className="login-register-btn" type="button">Login</button>
          </form>
        </div>

        {/* Overlay Section */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1 className="title">
                Hello <br /> friends
              </h1>
              <p className="login-register-p">If you have an account, login here and have fun.</p>
              <button className="ghost login-register-btn" onClick={handleLoginClick}>
                Login <i className="lni lni-arrow-left login"></i>
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1 className="head-one head-title">
                Start your <br /> journey now
              </h1>
              <p className="login-register-p">
                If you don't have an account yet, join us and start your
                journey.
              </p>
              <button className="ghost login-register-btn" onClick={handleRegisterClick}>
                Register <i className="lni lni-arrow-right register"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default LogInPage;
