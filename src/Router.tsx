import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./page/Home";
import { Clips } from "./components/Clips";
import { Awards } from "./components/Awards";
import { Dashboard } from "./components/Dashboard";
import { LandingPage } from "./components";

const router = createBrowserRouter([
  {
    element: <Home />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/clips",
        element: <Clips />,
      },
      {
        path: "/awards",
        element: <Awards />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
    ],
  },
]);
export function Router() {
  return <RouterProvider router={router} />;
}
