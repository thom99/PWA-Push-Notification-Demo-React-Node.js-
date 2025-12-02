import { createBrowserRouter } from "react-router";
import Layout from "../../layout/Layout";
import CreateUser from "../../pages/CreateUser/CreateUser";
import Login from "../../pages/Login/Login";
import Dashboard from "../../pages/Dashboard/Dashboard";
import { ProtectedRoute } from "./ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    loader: async () => {
      //   const data = await fetchData();
      //   return { data };
    },
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "/create-user",
        element: <CreateUser />,
      },
    ],
  },
]);

export default router;
