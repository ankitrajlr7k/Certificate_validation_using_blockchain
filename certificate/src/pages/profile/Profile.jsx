import "./profile.scss";
import apiRequest from "../../lib/apiRequest.js";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, updateUser } = useContext(AuthContext);
  const handleLogOut = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="profilePage">
      <div className="details">
        <div className="wrapper">
          <div className="title">
            <h1>User Information</h1>
            <Link to="/profile/update">
              <button>Update Profile</button>
            </Link>
          </div>
          <div className="info">
            <span>
              Avatar:
              <img src={currentUser.avatar || "/noavatar.jpg"} alt="" />
            </span>
            <span>
              Username: <b>{currentUser.username}</b>
            </span>
            <span>
              E-mail: <b>{currentUser.email}</b>
            </span>
            <button onClick={handleLogOut}>Logout</button>
          </div>
        </div>
      </div>
      <div className="sideContainer"></div>
    </div>
  );
};

export default Profile;
