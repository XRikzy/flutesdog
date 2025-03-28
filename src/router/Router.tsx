import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { LandingPage } from '../components'
import { Screenshots, Clips, Dashboard, Home } from '../pages'

const router = createBrowserRouter([
  {
    element: <Home />,
    children: [
      {
        path: '/',
        element: <LandingPage />
      },
      {
        path: '/clips',
        element: <Clips />
      },
      {
        path: '/screenshots',
        element: <Screenshots />
      },
      {
        path: '/dashboard',
        element: <Dashboard />
      },
    ]
  }
])
export function AppRouter() {
  return <RouterProvider router={router} />
}
