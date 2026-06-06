import React from "react"
import { Result, Button, Alert } from "antd"
import { Link } from "react-router-dom"

const SuccessSplash = () => {
  const newUsersLocked = import.meta.env.VITE_ARE_NEW_USERS_DISABLED === "true"

  return (
    <Result
      style={{ marginTop: "-1.2rem" }}
      status="success"
      title="Successfully registered!"
      subTitle="Please check your email for a confirmation notice."
      extra={[
        newUsersLocked && (
          <Alert
            key="lock"
            type="warning"
            showIcon
            message="Your account is locked pending approval"
            description="A jamaat admin needs to approve your account before you can log in for the first time. You'll hear back shortly."
            style={{ textAlign: "left", marginBottom: "1rem" }}
          />
        ),
        <Button type="primary" key="login">
          <Link to="/login">Login</Link>
        </Button>,
        <Button key="home">
          <Link to="/">Home</Link>
        </Button>,
      ].filter(Boolean)}
    />
  )
}

export default SuccessSplash
