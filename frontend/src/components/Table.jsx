import React, { useContext, useEffect, useState } from "react";
import moment from "moment";

import ErrorMessage from "./ErrorMessage";
import EmpModal from "./Emp_modal";
import { UserContext } from "../context/UserContext";

const Table = () => {
  const [token] = useContext(UserContext);
  const [Employee, setEmployee] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [activeModal, setActiveModal] = useState(false);
  const [id, setId] = useState(null);

  const handleUpdate = async (id) => {
    setId(id);
    setActiveModal(true);
  };

  const handleDelete = async (id) => {
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const response = await fetch(`/api/employee/${id}`, requestOptions);
    if (!response.ok) {
      setErrorMessage("Failed to delete Employee details");
    }

    getEmployee();
  };

  const getEmployee = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const response = await fetch("/api/get_employee", requestOptions);
    if (!response.ok) {
      setErrorMessage("Something went wrong. Couldn't load the Details");
    } else {
      const data = await response.json();
      setEmployee(data);
      setLoaded(true);
    }
  };

  useEffect(() => {
    getEmployee();
  }, []);

  const handleModal = () => {
    setActiveModal(!activeModal);
    getEmployee();
    setId(null);
  };

  return (
    <>
      <EmpModal
        active={activeModal}
        handleModal={handleModal}
        token={token}
        id={id}
        setErrorMessage={setErrorMessage}
      />
      <div className="has-text-centered">
        <button
          className="button is-centered mb-5 is-primary"
          onClick={() => setActiveModal(true)}>
          Add Employee
        </button>
      </div>

      <ErrorMessage message={errorMessage} />
      {loaded && Employee ? (
        <table className="table is-striped is-narrow is-hoverable is-fullwidth">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Department</th>
              <th>Email</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Employee.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.first_name}</td>
                <td>{emp.last_name}</td>
                <td>{emp.department}</td>
                <td>{emp.email}</td>
                <td>{moment(Employee.date_last_updated).format("MMM Do YY")}</td>
                <td>
                  <button
                    className="button mr-2 is-info is-light"
                    onClick={() => handleUpdate(emp.id)}
                  >
                    Update
                  </button>
                  <button
                    className="button mr-2 is-danger is-light"
                    onClick={() => handleDelete(emp.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading</p>
      )}
    </>
  );
};

export default Table;
