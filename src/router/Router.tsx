import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { LandingPage } from '../components'
import { Screenshots, Clips, Dashboard, Home } from '../pages'
import { ClipDetail } from '../pages/Clips/ClipDetail'
import { CollectionsPage } from '../pages/Collections/CollectionsPage'

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
        path: '/clips/:clipId',
        element: <ClipDetail />
      },
      {
        path: '/screenshots',
        element: <Screenshots />
      },
      {
        path: '/colecciones/:collectionId?',
        element: <CollectionsPage />
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
