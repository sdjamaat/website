import React from "react"
import { Router } from "@reach/router"
import Layout from "../components/layout"
import PrivateRoute from "../components/private-route"
import Dashboard from "../components/auth-pages/dashboard"
import Committees from "../components/auth-pages/committees"

const App = () => (
  <Layout>
    <Router>
      <PrivateRoute path="/auth/dashboard" component={Dashboard} />
      <PrivateRoute path="/auth/committees" component={Committees} />
    </Router>
  </Layout>
)

export default App
