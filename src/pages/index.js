import React from "react"
import Layout from "../components/layout"
import Contact from "../components/home/contact"

import { Card } from "antd"

export default () => (
  <Layout>
    <div>
      <Card title="Contact Us">
        <Contact />
      </Card>
    </div>
  </Layout>
)
