import React from "react"
import { Router } from "@reach/router"
import Layout from "../components/layout"
import PrivateRoute from "../components/private-route"
import Profile from "../components/auth/profile"
import FMB from "../components/auth/fmb"
const App = () => (
  <Layout>
    <Router>
      <PrivateRoute path="/auth/profile" component={Profile} />
      <PrivateRoute path="/auth/faiz" component={FMB} />
    </Router>
  </Layout>
)
export default App
