import React, { useContext, useEffect, useState } from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import Header from "./components/Header";
import Table from "./components/Table";
import { UserContext } from "./context/UserContext";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

const App = () => {
  const [message, setMessage] = useState("");
  const [token] = useContext(UserContext);

  const getWelcomeMessage = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch("/api", requestOptions);
    const data = await response.json();

    if (response.ok) {
      setMessage(data.message);
    }
  };

  useEffect(() => {
    getWelcomeMessage();
  }, []);

  return (
    <div >
      <Header title={message} />
      <Router>

        <div className="columns">
          <div className="column"></div>
          <div className="column m-5 is-two-thirds">
            {!token ? (
              <div>
                <div className="has-text-centered" >
                  <button className="button is-primary is-rounded is-outlined">
                    <Link to="/register">
                      Register
                    </Link>
                  </button>
                  <button className="button is-primary is-rounded is-outlined">
                    <Link to="/">
                      Login
                    </Link>
                  </button>
                </div>
                <Routes>
                  <Route exact path="/register" element={<Register />} />
                  <Route exact path="/" element={<Login />} />
                </Routes>
              </div>
            ) : (
              <Table />
            )}
          </div>
          <div className="column"></div>
        </div>
      </Router>
    </div>
  );
};

export default App;