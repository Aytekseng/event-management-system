import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./components/Layout";
import { EventsList } from "./pages/EventsList";
import { EventDetail } from "./pages/EventDetail";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminEventForm } from "./pages/AdminEventForm";
import { AdminRoute } from "./routes/AdminRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout><EventsList /></Layout>,
  },
  {
    path: "/events/:id",
    element: <Layout><EventDetail /></Layout>,
  },
  {
    path: "/admin",
    element: <AdminRoute><Layout><AdminDashboard /></Layout></AdminRoute>,
  },
  {
    path: "/admin/new",
    element: <AdminRoute><Layout><AdminEventForm /></Layout></AdminRoute>,
  },
  {
    path: "/admin/events/:id",
    element: <AdminRoute><Layout><AdminEventForm /></Layout></AdminRoute>,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}