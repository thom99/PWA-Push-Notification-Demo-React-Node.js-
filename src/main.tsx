import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AuthProvider } from "./context/AuthProvider.tsx";
import App from "./App.tsx";
import { RouterProvider } from "react-router";
import router from "./utils/router/router.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <App />
    </AuthProvider>
  </StrictMode>
);
