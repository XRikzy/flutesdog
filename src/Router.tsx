import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <h1>Aqui comienza la leyenda de los Perro Flautas!!</h1>,
  },
]);
export function Router() {
  return <RouterProvider router={router} />;
}
