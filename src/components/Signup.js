import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const Signup = (props) => {
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "" });

  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:5000/api/auth/createuser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name: credentials.name, email: credentials.email, password: credentials.password }),
    });
    const json = await response.json();
    console.log(json);

    if (json.success) {
      //Save the auth-token and redirect
      localStorage.setItem("token", json.authtoken);
      navigate("/");
      props.showAlert("Registered Successfully", "success");
  }
  else {
      props.showAlert("Enter correct credentials","danger");
      navigate("/");
  }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  return (
    <div>
      <h2 className="my-2">Create an account to proceed . . .</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" className="form-control" id="name" name="name" aria-describedby="emailHelp" onChange={onChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" className="form-control" id="email" name="email" aria-describedby="emailHelp" onChange={onChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="passwor" name="password" onChange={onChange} minLength={5} required />
        </div>
        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">Confirm Password</label>
          <input type="cpassword" className="form-control" id="cpassword" name="cpassword" onChange={onChange} minLength={5} required />
        </div>
        <button type="submit" className="btn btn-primary">Create Account</button>
      </form>
    </div>
  );
};

export default Signup;