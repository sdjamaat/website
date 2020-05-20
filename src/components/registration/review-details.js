import React from "react"
import styled from "styled-components"
import { Form, Button, Card, Tag } from "antd"

const ReviewDetails = ({
  accountDetails,
  personalDetails,
  prevStep,
  submitForm,
}) => {
  return (
    <ReviewDetailsWrapper>
      <div style={{ textAlign: "center" }}>
        <Tag
          className="float-center"
          color="geekblue"
          style={{ fontSize: "1.1rem", padding: ".3rem" }}
        >
          Review Submission
        </Tag>
      </div>

      <Card
        title="Account Details"
        style={{ marginTop: "1rem" }}
        headStyle={{ textAlign: "center" }}
        bodyStyle={{ paddingLeft: ".3rem", paddingBottom: ".5rem" }}
      >
        <ul>
          <li>ITS #: {accountDetails.its}</li>
          <li>First name: {accountDetails.firstname}</li>
          <li>Last name: {accountDetails.lastname}</li>
          <li>Email: {accountDetails.email}</li>
        </ul>
      </Card>

      <Card
        title="Personal Details"
        style={{ marginTop: "1rem" }}
        headStyle={{ textAlign: "center" }}
        bodyStyle={{ paddingLeft: ".3rem", paddingBottom: ".5rem" }}
      >
        <ul>
          {personalDetails.title !== "" && (
            <li>Title: {personalDetails.title}</li>
          )}

          <li>
            Other titles:{" "}
            {personalDetails.othertitles.length !== 0 &&
              personalDetails.othertitles[0]}
            {personalDetails.othertitles.length > 1 &&
              `, ${personalDetails.othertitles[1]}`}
          </li>

          <li>DOB: {personalDetails.dob.format("MM-DD-YYYY")}</li>
          <li>Phone: {personalDetails.phone}</li>
          <li>Address: {personalDetails.address}</li>
          <li>Family members: {personalDetails.familymembers}</li>
          <li>Move status: {personalDetails.movestatus}</li>
        </ul>
      </Card>

      <Form.Item>
        <Button onClick={prevStep} className="float-left next-btn">
          Back
        </Button>
        <Button
          type="primary"
          onClick={submitForm}
          className="float-right next-btn"
        >
          Submit
        </Button>
      </Form.Item>
    </ReviewDetailsWrapper>
  )
}

const ReviewDetailsWrapper = styled.div`
  .next-btn {
    padding-top: 0.2rem;
    padding-bottom: 2.2rem;
    font-size: 1.2rem;
    margin-top: 1rem;
  }
`

export default ReviewDetails
