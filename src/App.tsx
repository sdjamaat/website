import React from "react"
import { Routes, Route } from "react-router-dom"
import Home from "./pages/index"
import Login from "./pages/login"
import Register from "./pages/register"
import ForgotPassword from "./pages/forgotpassword"
import NotFound from "./pages/404"
import PrivateRoute from "./components/other/private-route"
import Dashboard from "./components/auth-pages/dashboard"
import Committees from "./components/auth-pages/committees"

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route
        path="/auth/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/auth/committees"
        element={
          <PrivateRoute>
            <Committees />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
