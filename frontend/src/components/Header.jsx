import React, { useContext } from "react";

import { UserContext } from "../context/UserContext";

const Header = ({ title }) => {
  const [token, setToken] = useContext(UserContext);

  const handleLogout = () => {
    setToken(null);
  };

  return (
    <div className="has-text-centered m-4">
      <h1 className="title" ><div className="has-text-success-dark">{title}</div></h1>
      {token && (
        <button className="button is-danger is-rounded is-outlined" onClick={handleLogout}>
          Logout
        </button>
      )}
    </div>
  );
};

export default Header;
