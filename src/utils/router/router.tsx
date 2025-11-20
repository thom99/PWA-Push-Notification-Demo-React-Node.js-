import { createBrowserRouter } from "react-router";
import Layout from "../../layout/Layout";
import CreateUser from "../../pages/CreateUser/CreateUser";
import Login from "../../pages/Login/Login";
import Dashboard from "../../pages/Dashboard/Dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    loader: async () => {
      //   const data = await fetchData();
      //   return { data };
    },
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/create-user",
        element: <CreateUser />,
      },
    ],
  },
]);

export default router;
