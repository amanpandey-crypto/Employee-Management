import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import ErrorMessage from "./ErrorMessage";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationPassword, setConfirmationPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [, setToken] = useContext(UserContext);

  const submitRegistration = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, email: email, password: password }),
    };

    const response = await fetch("/api/signup", requestOptions);
    const data = await response.json();

    if (!response.ok) {
      setErrorMessage(data.detail);
    } else {
      setToken(data.access_token);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmationPassword && password.length > 5) {
      submitRegistration();
      
    } else {
      setErrorMessage(
        "Ensure that the passwords match and greater than 5 characters"
      );
    }
  };
  

  return (
      <div className="container" style={{"maxWidth": 450, "marginTop": 10}}>
        <form className="box" onSubmit={handleSubmit}>
          <h1 className="title has-text-centered">Register</h1>
          <div className="field">
            <label className="label">Username</label>
            <div className="control">
              <input
                type="name"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input"
                required
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Email Address</label>
            <div className="control">
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                required
              />
            </div>
          </div>
          <div className="field-group">
            <div className="field is-inline-block-desktop">
              <label className="label">Password</label>
              <div className="control">
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                  required
                />
              </div>
            </div>
            <div className="field is-inline-block-desktop">
              <label className="label">Confirm Password</label>
              <div className="control">
                <input
                  type="password"
                  placeholder="Enter password"
                  value={confirmationPassword}
                  onChange={(e) => setConfirmationPassword(e.target.value)}
                  className="input"
                  required
                />
              </div> 
            </div>
          </div>
          <ErrorMessage message={errorMessage} />
          <br />
          <button className="button is-primary" type="submit">
            Register
          </button>
        </form>
      </div>
  );
};

export default Register;
