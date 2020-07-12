import React from "react"
import { Router } from "@reach/router"
import Layout from "../components/layout"
import PrivateRoute from "../components/private-route"
import Dashboard from "../components/auth-pages/dashboard"

const App = () => (
  <Layout>
    <Router>
      <PrivateRoute path="/auth/dashboard" component={Dashboard} />
    </Router>
  </Layout>
)

export default App
