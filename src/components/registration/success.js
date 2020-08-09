import React from "react"
import { Result, Button } from "antd"
import { Link } from "gatsby"

const SuccessSplash = () => {
  const subtitleNoAdmin = "Please check your email for a confirmation notice"
  const subtitleYesAdmin =
    "Check your email for a confirmation notice. Please note that newly registered website members will need to wait for their account to be approved by website admins before logging in for the first time"
  return (
    <Result
      style={{ marginTop: "-1.2rem" }}
      status="success"
      title="Successfully registered!"
      subTitle={
        process.env.GATSBY_ARE_NEW_USERS_DISABLED === "true"
          ? subtitleYesAdmin
          : subtitleNoAdmin
      }
      extra={[
        <Button type="primary" key="login">
          <Link to="/login">Login</Link>
        </Button>,
        <Button key="home">
          <Link to="/">Home</Link>
        </Button>,
      ]}
    />
  )
}

export default SuccessSplash
