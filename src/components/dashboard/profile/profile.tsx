import React, { useContext, useState } from "react"
import { Card, Divider, Timeline, Descriptions, Button, Input, Alert, Space, Modal, Form } from "antd"
import { Row, Col } from "react-bootstrap"
import styled from "styled-components"
import { AuthContext } from "../../../provider/auth-context"
import {
  HomeOutlined,
  UserOutlined,
  LinkOutlined,
  CopyOutlined,
  UserAddOutlined,
} from "@ant-design/icons"
import { doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore"
import { db } from "../../../lib/firebase"
import CustomMessage from "../../other/custom-message"

const makeToken = () => {
  if (typeof crypto !== "undefined" && (crypto as any).randomUUID) {
    return (crypto as any).randomUUID().replace(/-/g, "")
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

const inviteUrl = (token: string) =>
  `${window.location.origin}/register?invite=${token}`

const Profile = () => {
  const { currUser } = useContext(AuthContext)
  const isHead = currUser.family?.head?.uid === currUser.uid

  const [inviteLinks, setInviteLinks] = useState<Record<number, string>>({})
  const [generating, setGenerating] = useState<number | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [adding, setAdding] = useState(false)
  const [addForm] = Form.useForm()

  const handleGenerate = async (memberindex: number) => {
    setGenerating(memberindex)
    try {
      const token = makeToken()
      await setDoc(doc(db, "familyInvites", token), {
        token,
        familyid: currUser.familyid,
        memberindex,
        createdBy: currUser.uid,
        createdAt: serverTimestamp(),
        usedAt: null,
        usedBy: null,
      })
      setInviteLinks((prev) => ({ ...prev, [memberindex]: inviteUrl(token) }))
    } catch (e: any) {
      console.log(e)
      CustomMessage("error", "Could not create invite link")
    } finally {
      setGenerating(null)
    }
  }

  const handleAddMember = async (values: { firstname?: string }) => {
    setAdding(true)
    try {
      const newSlot = {
        firstname: values.firstname?.trim() || `Member ${currUser.family.size + 1}`,
        lastname: "",
        yob: null,
        its: null,
        uid: null,
      }
      const nextMembers = [...currUser.family.members, newSlot]
      await updateDoc(doc(db, "families", currUser.familyid), {
        members: nextMembers,
        size: currUser.family.size + 1,
      })
      CustomMessage("success", "Family member added")
      addForm.resetFields()
      setAddOpen(false)
    } catch (e: any) {
      console.log(e)
      CustomMessage("error", "Could not add family member")
    } finally {
      setAdding(false)
    }
  }

  const handleCopy = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link)
      CustomMessage("success", "Invite link copied")
    } catch {
      CustomMessage("error", "Copy failed — select the text manually")
    }
  }

  return (
    <ProfileWrapper>
      <Card title="Profile" headStyle={{ fontSize: "1.5rem", textAlign: "center" }}>
        <Row>
          <Col md={12} lg={12}>
            <Divider orientation="left" style={{ marginTop: "0" }}>
              Account Details
            </Divider>
            <Descriptions layout="vertical" size="small" bordered>
              <Descriptions.Item label="First name">{currUser.firstname}</Descriptions.Item>
              <Descriptions.Item label="Last name">{currUser.lastname}</Descriptions.Item>
              <Descriptions.Item label="Email">{currUser.email}</Descriptions.Item>
              <Descriptions.Item label="Phone">{currUser.phone}</Descriptions.Item>
              <Descriptions.Item label="ITS #">{currUser.its}</Descriptions.Item>
              <Descriptions.Item label="Year of Birth">{currUser.yob}</Descriptions.Item>
            </Descriptions>
          </Col>

          <Col md={12} lg={12} style={{ marginTop: ".5rem" }}>
            <Divider orientation="left">Family Details</Divider>
            <Row>
              <Col sm={12} md={4}>
                <Timeline
                  style={{ marginTop: ".6rem", paddingLeft: ".5rem" }}
                  items={[
                    {
                      dot: <HomeOutlined style={{ marginBottom: ".3rem" }} />,
                      children: (
                        <div>
                          {currUser.family.head.firstname}{" "}
                          {currUser.family.head.lastname} (Head) <br />
                          <span style={{ color: "gray", fontSize: "1rem" }}>
                            ITS #: {currUser.family.head.its}
                          </span>{" "}
                          <br />
                          <span style={{ color: "gray", fontSize: "1rem" }}>
                            Year of Birth: {currUser.family.head.yob}
                          </span>
                        </div>
                      ),
                    },
                    ...currUser.family.members.map((member: any, index: number) => ({
                      dot: <UserOutlined style={{ marginBottom: ".3rem" }} />,
                      children: (
                        <div key={index}>
                          {member.firstname} {member.lastname} <br />
                          <span style={{ color: "gray", fontSize: "1rem" }}>
                            ITS #: {member.its ? member.its : "n/a"}
                          </span>{" "}
                          <br />
                          <span style={{ color: "gray", fontSize: "1rem" }}>
                            Year of Birth: {member.yob || "n/a"}
                          </span>
                        </div>
                      ),
                    })),
                  ]}
                />
              </Col>
              <Col sm={12} md={8}>
                <Descriptions layout="vertical" size="small" bordered>
                  <Descriptions.Item label="Address">{currUser.family.address.street}</Descriptions.Item>
                  <Descriptions.Item label="City">{currUser.family.address.city}</Descriptions.Item>
                  <Descriptions.Item label="Zip">{currUser.family.address.zip}</Descriptions.Item>
                  <Descriptions.Item label="Jamaat Registration Status">{currUser.family.registrationStatus}</Descriptions.Item>
                  <Descriptions.Item label="Family Size">{currUser.family.size}</Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>

            {isHead && (
              <>
                <Divider orientation="left" style={{ marginTop: "1.5rem" }}>
                  Manage Family Members
                </Divider>
                <Alert
                  type="info"
                  style={{ marginBottom: ".75rem" }}
                  message="Add family members, then share an invite link with each one. The link preloads their family and slot so they only fill in their own details."
                />
                {currUser.family.members.map((member: any, index: number) => {
                  if (member.uid) return null
                  const link = inviteLinks[index]
                  return (
                    <div key={index} className="invite-row">
                      <div className="invite-row-label">
                        <strong>{member.firstname || `Member ${index + 2}`}</strong>
                      </div>
                      {link ? (
                        <Space.Compact style={{ width: "100%" }}>
                          <Input value={link} readOnly />
                          <Button
                            type="primary"
                            icon={<CopyOutlined />}
                            onClick={() => handleCopy(link)}
                          >
                            Copy
                          </Button>
                        </Space.Compact>
                      ) : (
                        <Button
                          icon={<LinkOutlined />}
                          loading={generating === index}
                          onClick={() => handleGenerate(index)}
                        >
                          Generate invite link
                        </Button>
                      )}
                    </div>
                  )
                })}
                <Button
                  type="dashed"
                  icon={<UserAddOutlined />}
                  onClick={() => setAddOpen(true)}
                  style={{ marginTop: ".5rem" }}
                >
                  Add family member
                </Button>
                <Modal
                  title="Add family member"
                  open={addOpen}
                  onCancel={() => setAddOpen(false)}
                  onOk={() => addForm.submit()}
                  confirmLoading={adding}
                  okText="Add"
                >
                  <Form form={addForm} layout="vertical" onFinish={handleAddMember}>
                    <Form.Item
                      label="First name (optional):"
                      name="firstname"
                      extra="They'll fill in the rest when they register via your invite link."
                    >
                      <Input placeholder={`Member ${currUser.family.size + 1}`} />
                    </Form.Item>
                  </Form>
                </Modal>
              </>
            )}
          </Col>
        </Row>
      </Card>
    </ProfileWrapper>
  )
}

const ProfileWrapper = styled.div`
  max-width: 1000px;
  margin: auto;
  .ant-divider-horizontal.ant-divider-with-text-left::before {
    width: 0%;
  }
  .ant-divider-horizontal.ant-divider-with-text-left::after {
    width: 100%;
  }
  .ant-divider-inner-text {
    padding-left: 0.2rem;
  }
  .next-btn {
    height: 2.8rem;
    font-size: 1.2rem;
    margin-top: 1rem;
  }
  .invite-row {
    margin-bottom: 0.75rem;
  }
  .invite-row-label {
    margin-bottom: 0.25rem;
  }
`

export default Profile
