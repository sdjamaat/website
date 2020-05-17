import React from "react"
import { Router } from "@reach/router"
import Layout from "../components/layout"
import PrivateRoute from "../components/private-route"
import Profile from "../components/auth/profile"
const App = () => (
  <Layout>
    <Router>
      <PrivateRoute path="/auth/profile" component={Profile} />
    </Router>
  </Layout>
)
export default App
