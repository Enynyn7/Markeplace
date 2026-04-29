import { createBrowserRouter } from "react-router";
import { PreLogin } from "./pages/PreLogin";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { MainLayout } from "./layouts/MainLayout";
import { Dashboard } from "./pages/Dashboard";
import { Marketplace } from "./pages/Marketplace";
import { Sell } from "./pages/Sell";
import { MyTickets } from "./pages/MyTickets";
import { Profile } from "./pages/Profile";
import { Payments } from "./pages/Payments";
import { Notifications } from "./pages/Notifications";
import { TransactionHistory } from "./pages/TransactionHistory";
import { Settings } from "./pages/Settings";
import { Support } from "./pages/Support";
import { TicketDetails } from "./pages/TicketDetails";
import { MyListings } from "./pages/MyListings";
import { CreateListing } from "./pages/CreateListing";
import { ProductDetails } from "./pages/ProductDetails";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PreLogin />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/app",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "marketplace",
        element: <Marketplace />,
      },
      {
        path: "sell",
        element: <Sell />,
      },
      {
        path: "tickets",
        element: <MyTickets />,
      },
      {
        path: "tickets/:id",
        element: <TicketDetails />,
      },
      {
        path: "notifications",
        element: <Notifications />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "payments",
        element: <Payments />,
      },
      {
        path: "transactions",
        element: <TransactionHistory />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "support",
        element: <Support />,
      },
      {
        path: "listings",
        element: <MyListings />,
      },
      {
        path: "listings/create",
        element: <CreateListing />,
      },
      {
        path: "listings/edit/:id",
        element: <CreateListing />,
      },
      {
        path: "products/:id",
        element: <ProductDetails />,
      },
    ],
  },
]);