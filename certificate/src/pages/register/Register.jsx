import "./register.scss";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest.js";
import { useState } from "react";

const Register = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const formdata = new FormData(e.target);

    const username = formdata.get("username");
    const email = formdata.get("email");
    const password = formdata.get("password");

    try {
      const res = await apiRequest.post("/auth/register", {
        username,
        email,
        password,
      });

      navigate("/login");
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setIsLoading(true);
    }
  };
  return (
    <div className="registerPage">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Create an Account</h1>
          <input name="username" type="text" placeholder="Username" />
          <input name="email" type="text" placeholder="Email" />
          <input name="password" type="password" placeholder="Password" />
          <button disabled={isLoading}>Register</button>
          {error && <span>{error}</span>}
          <Link to="/login">Do you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer"></div>
    </div>
  );
};

export default Register;
