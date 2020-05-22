import React from "react"
import styled from "styled-components"
import { Form, Button, Card, Tag } from "antd"

const ReviewDetails = ({
  accountDetails,
  personalDetails,
  familyDetails,
  familyAffiliation,
  familyMemberDetails,
  showFamilyDetails,
  setStep,
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
        bodyStyle={{ paddingLeft: "0rem", paddingBottom: ".5rem" }}
      >
        <ul>
          <li>Head of family: {accountDetails.familyhead ? "Yes" : "No"}</li>
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
        bodyStyle={{ paddingLeft: "0rem", paddingBottom: ".5rem" }}
      >
        <ul>
          {!showFamilyDetails && (
            <>
              <li>
                Affiliation: {familyAffiliation.displayname} - [
                {
                  familyAffiliation.members[familyAffiliation.memberindex]
                    .firstname
                }
                ]
              </li>
            </>
          )}
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

          <li>YOB: {personalDetails.yob.format("YYYY")}</li>
          <li>Phone: {personalDetails.phone}</li>
        </ul>
      </Card>

      {showFamilyDetails && (
        <Card
          title="Family Details"
          style={{ marginTop: "1rem" }}
          headStyle={{ textAlign: "center" }}
          bodyStyle={{ paddingLeft: "0rem", paddingBottom: ".5rem" }}
        >
          <ul>
            <li>Members: {familyDetails.size}</li>
            <li>Move status: {familyDetails.movestatus}</li>
            <li>
              Address:{" "}
              {`${familyDetails.address.street}, ${familyDetails.address.city}, CA, ${familyDetails.address.zip}`}
            </li>
            <li>
              Faiz-ul-Mawaid status:{" "}
              {familyDetails.fmbstatus !== "Not enrolled"
                ? `${familyDetails.fmbstatus} thali`
                : "Not enrolled"}
            </li>
          </ul>
        </Card>
      )}

      {showFamilyDetails && familyDetails.size > 1 && (
        <div className="members-content">
          <Card
            title="Family Members"
            style={{ marginTop: "1rem" }}
            headStyle={{ textAlign: "center" }}
            bodyStyle={{
              paddingBottom: ".5rem",
            }}
          >
            {familyMemberDetails.members.map((member, index) => {
              if (typeof member !== "undefined") {
                return (
                  <Card
                    key={index}
                    bodyStyle={{ padding: ".5rem" }}
                    style={{ marginBottom: "1rem" }}
                  >
                    <p
                      style={{
                        paddingLeft: "1rem",
                        fontWeight: "bold",
                        marginBottom: ".5rem",
                      }}
                    >
                      Family Member {index + 1}
                    </p>
                    <ul>
                      <li>First name: {member.firstname}</li>
                      <li>Last name: {member.lastname}</li>
                      <li>YOB: {member.yob.format("YYYY")}</li>
                      <li>ITS #: {member.its ? member.its : "None"}</li>
                    </ul>
                  </Card>
                )
              }
            })}
          </Card>
        </div>
      )}

      <Form.Item>
        <Button
          onClick={() =>
            showFamilyDetails
              ? setStep("family-member-details")
              : setStep("choose-family")
          }
          className="float-left next-btn"
        >
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

  .members-contact {
    max-width: 500px;
    margin: auto;
  }
`

export default ReviewDetails
