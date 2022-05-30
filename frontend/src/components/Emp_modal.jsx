import React, { useEffect, useState } from "react";

const EmpModal = ({ active, handleModal, token, id, setErrorMessage }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");
  useEffect(() => {
    const getEmployee = async () => {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      };
      const response = await fetch(`/api/employee/${id}`, requestOptions);

      if (!response.ok) {
        setErrorMessage("Could not get the Employee");
      } else {
        const data = await response.json();
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setDepartment(data.department);
        setEmail(data.email);
      }
    };

    if (id) {
      getEmployee();
    }
  }, [id, token]);

  const cleanFormData = () => {
    setFirstName("");
    setLastName("");
    setDepartment("");
    setEmail("");
  };

  const handleCreateEmployee= async (e) => {
    e.preventDefault();
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        department: department,
        email: email
      }),
    };
    const response = await fetch("/api/add_employee", requestOptions);
    if (!response.ok) {
      setErrorMessage("Something went wrong when adding Employee details");
    } else {
      cleanFormData();
      handleModal();
    }
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        department: department,
        email: email
      }),
    };
    const response = await fetch(`/api/employee/${id}`, requestOptions);
    if (!response.ok) {
      setErrorMessage("Something went wrong when updating Employee details");
    } else {
      cleanFormData();
      handleModal();
    }
  };

  return (
    <div className={`modal ${active && "is-active"}`}>
      <div className="modal-background" onClick={handleModal}></div>
      <div className="modal-card">
        <header className="modal-card-head has-background-primary-light">
          <h1 className="modal-card-title">
            {id ? "Update Details" : "Add Details"}
          </h1>
        </header>
        <section className="modal-card-body">
          <form>
            <div className="field">
              <label className="label">First Name</label>
              <div className="control">
                <input
                  type="text"
                  placeholder="Enter first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="input"
                  required
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Last Name</label>
              <div className="control">
                <input
                  type="text"
                  placeholder="Enter last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="input"
                  required
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Department</label>
              <div className="control">
                <input
                  type="text"
                  placeholder="Enter department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="input"
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Email</label>
              <div className="control">
                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                />
              </div>
            </div>
          </form>
        </section>
        <footer className="modal-card-foot has-background-primary-light">
          {id ? (
            <button className="button is-info" onClick={handleUpdateEmployee}>
              Update
            </button>
          ) : (
            <button className="button is-primary" onClick={handleCreateEmployee}>
              Create
            </button>
          )}
          <button className="button" onClick={handleModal}>
            Cancel
          </button>
        </footer>
      </div>
    </div>
  );
};

export default EmpModal;
