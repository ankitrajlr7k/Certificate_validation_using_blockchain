import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Layout, RequireAuth } from "./pages/layout/Layout";
import Homepage from "./pages/homepage/Homepage";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import Generate from "./pages/generate/Generate";
import Validate from "./pages/validate/Validate";
import Profile from "./pages/profile/Profile";
import ProfileUpdate from "./pages/profileUpdate/ProfileUpdate";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Homepage />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/login",
          element: <Login />,
        },
      ],
    },
    {
      path: "/",
      element: <RequireAuth />,
      children: [
        {
          path: "/generate",
          element: <Generate />,
        },
        {
          path: "/validate",
          element: <Validate />,
        },
        {
          path: "/profile",
          element: <Profile />,
        },
        {
          path: "/profile/update",
          element: <ProfileUpdate />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default App;
