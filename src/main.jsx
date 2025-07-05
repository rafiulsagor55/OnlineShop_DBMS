import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Demo from "./component/demo.jsx";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Demo2 from "./component/demo2.jsx";
import Login from "./component/Login.jsx";
import "./../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Register from "./component/Register1.jsx";
import VerifyCode from "./component/VerifyCode.jsx";
import CheckLogin from "./component/CheckLogin.jsx";
import Logout from "./component/Logout.jsx";
import DesignDemo from "./component/design/DesignDemo.jsx";
import { UserProvider } from "./component/UserProvider.jsx";
import MainContent from "./component/design/MainContent.jsx";
import TypeBasedItem from "./component/design/TypeBasedItem.jsx";
import EmptyParent from "./component/design/EmptyParent.jsx";
import ProductPage from "./component/design/ProductPage.jsx";
import CartPage from "./component/design/CartPage.jsx";
import CheckoutPage from "./component/design/CheckoutPage.jsx";
import ReviewSection from "./component/design/ReviewSection.jsx";
import QASection from "./component/design/QASection.jsx";
import TypeBasedItemWomen from "./component/design/TypeBasedItemWomes.jsx";
import TypeBasedItemKids from "./component/design/TypeBasedItemKids.jsx";
import NewArrivals from "./component/design/NewArrivals.jsx";
import AdminFilterInput from "./component/design/AdminFilterInput.jsx";
import ProductInputPage from "./component/design/ProductInputPage.jsx";
import AdminOrdersPage from "./component/design/AdminOrdersPage.jsx";
import CurrentOrderPage from "./component/design/CurrentOrderPage.jsx";
import EditProductPage from "./component/design/EditProductPage.jsx";
import KidsProductInputPage from "./component/design/KidsProductInputPage.jsx";
import Signin from "./component/Auth/Signin.jsx";
import Signup from "./component/Auth/Signup.jsx";
import VerifyEmail from "./component/Auth/VerifyEmail.jsx";
import UserDetails from "./component/Auth/UserDetails.jsx";
import SetPassword from "./component/Auth/SetPassword.jsx";
import ResetPassword from "./component/Auth/ResetPassword.jsx";
import ResetPasswordSendCode from "./component/Auth/ResetPasswordSendCode";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DesignDemo />,
    children: [
      {
        path: "",
        element: <MainContent />,
      },
      {
        path: "Mens-Wear",
        element: <TypeBasedItem />,
      },
      {
        path: "Womens-Wear",
        element: <TypeBasedItemWomen />,
      },
      {
        path: "Kids-Wear",
        element: <TypeBasedItemKids />,
      },
      {
        path: "product/:id",
        element: <ProductPage />,
      },
      {
        path: "/cartPage",
        element: <CartPage />,
      },
      {
        path: "/CheckoutPage",
        element: <CheckoutPage />,
      },
      {
        path: "/order-page",
        element: <CurrentOrderPage />,
      },
    ],
  },
  {
    path: "/sign-in",
    element: <Signin />,
  },
  {
    path: "/sign-up",
    element: <Signup />,
  },
  {
    path: "/verify-email",
    element: <VerifyEmail />,
  },
  {
    path: "/user-details",
    element: <UserDetails />,
  },
  {
    path: "/set-password",
    element: <SetPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/forgot-password",
    element: <ResetPasswordSendCode />,
  },
  {
    path: "/imput-product",
    element: <ProductInputPage />,
  },
  {
    path: "/edit-product",
    element: <EditProductPage />,
  },
  {
    path: "/order-page-admin",
    element: <AdminOrdersPage/>,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>
);
