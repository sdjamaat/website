import React from "react"
import { Router } from "@reach/router"
import Layout from "../components/layout"
import PrivateRoute from "../components/private-route"
import Profile from "../components/auth-pages/profile"
import FMB from "../components/auth-pages/fmb"
import Admin from "../components/auth-pages/admin"

const App = () => (
  <Layout>
    <Router>
      <PrivateRoute path="/auth/profile" component={Profile} />
      <PrivateRoute path="/auth/faiz" component={FMB} />
      <PrivateRoute path="/auth/admin" component={Admin} />
    </Router>
  </Layout>
)

export default App
