import React, { useContext, useState } from "react"
import {
  Card,
  Divider,
  Timeline,
  Descriptions,
  Button,
  Input,
  InputNumber,
  Alert,
  Modal,
  Form,
  List,
  Tag,
  Select,
  Popconfirm,
  Tooltip,
} from "antd"
import { Row, Col } from "react-bootstrap"
import styled from "styled-components"
import { AuthContext } from "../../../provider/auth-context"
import {
  HomeOutlined,
  UserOutlined,
  LinkOutlined,
  CopyOutlined,
  UserAddOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
} from "@ant-design/icons"
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore"
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

const placeholderName = (index: number) => `Member ${index + 2}`

const Profile = () => {
  const { currUser } = useContext(AuthContext)
  const isHead = currUser.family?.head?.uid === currUser.uid

  const [inviteLinks, setInviteLinks] = useState<Record<number, string>>({})
  const [generating, setGenerating] = useState<number | null>(null)
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null)

  const [addOpen, setAddOpen] = useState(false)
  const [adding, setAdding] = useState(false)
  const [addForm] = Form.useForm()

  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [editing, setEditing] = useState(false)
  const [editForm] = Form.useForm()

  const [accountOpen, setAccountOpen] = useState(false)
  const [accountSaving, setAccountSaving] = useState(false)
  const [accountForm] = Form.useForm()

  const [familyOpen, setFamilyOpen] = useState(false)
  const [familySaving, setFamilySaving] = useState(false)
  const [familyForm] = Form.useForm()

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
      const link = inviteUrl(token)
      setInviteLinks((prev) => ({ ...prev, [memberindex]: link }))
      try {
        await navigator.clipboard.writeText(link)
        CustomMessage("success", "Invite link created and copied to clipboard")
      } catch {
        CustomMessage("success", "Invite link created — tap Copy link to copy it")
      }
    } catch (e: any) {
      console.log(e)
      CustomMessage(
        "error",
        `Could not create invite link: ${e?.code || ""} ${e?.message || e}`.trim()
      )
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
      CustomMessage(
        "error",
        `Could not add family member: ${e?.code || ""} ${e?.message || e}`.trim()
      )
    } finally {
      setAdding(false)
    }
  }

  const openEdit = (index: number) => {
    setEditIndex(index)
  }

  const handleEditMember = async (values: { firstname?: string; lastname?: string }) => {
    if (editIndex === null) return
    setEditing(true)
    try {
      const nextMembers = currUser.family.members.map((m: any, i: number) =>
        i === editIndex
          ? {
              ...m,
              firstname: values.firstname?.trim() || placeholderName(editIndex),
              lastname: values.lastname?.trim() || "",
            }
          : m
      )
      await updateDoc(doc(db, "families", currUser.familyid), { members: nextMembers })
      CustomMessage("success", "Family member updated")
      setEditIndex(null)
      editForm.resetFields()
    } catch (e: any) {
      console.log(e)
      CustomMessage(
        "error",
        `Could not update family member: ${e?.code || ""} ${e?.message || e}`.trim()
      )
    } finally {
      setEditing(false)
    }
  }

  const handleDeleteMember = async (index: number) => {
    setDeletingIndex(index)
    try {
      const nextMembers = currUser.family.members.filter((_: any, i: number) => i !== index)

      // Clean up any pending invites for this family: delete invites pointing at the removed
      // slot, and decrement memberindex for invites pointing at higher slots so they still
      // land on the right person after the splice.
      const invitesSnap = await getDocs(
        query(collection(db, "familyInvites"), where("familyid", "==", currUser.familyid))
      )
      const batch = writeBatch(db)
      invitesSnap.forEach((d) => {
        const data = d.data() as any
        if (data.usedAt) return
        if (data.memberindex === index) {
          batch.delete(d.ref)
        } else if (data.memberindex > index) {
          batch.update(d.ref, { memberindex: data.memberindex - 1 })
        }
      })
      batch.update(doc(db, "families", currUser.familyid), {
        members: nextMembers,
        size: Math.max(1, currUser.family.size - 1),
      })
      await batch.commit()

      // Drop any locally-cached invite links that pointed at shifted indices to avoid confusion
      setInviteLinks((prev) => {
        const next: Record<number, string> = {}
        for (const [k, v] of Object.entries(prev)) {
          const idx = Number(k)
          if (idx === index) continue
          next[idx > index ? idx - 1 : idx] = v
        }
        return next
      })

      CustomMessage("success", "Family member removed")
    } catch (e: any) {
      console.log(e)
      CustomMessage(
        "error",
        `Could not remove family member: ${e?.code || ""} ${e?.message || e}`.trim()
      )
    } finally {
      setDeletingIndex(null)
    }
  }

  const handleEditAccount = async (values: any) => {
    setAccountSaving(true)
    try {
      const firstname = values.firstname.trim()
      const lastname = values.lastname.trim()
      const phone = values.phone
      const its = values.its
      const yob = String(values.yob)

      await updateDoc(doc(db, "users", currUser.uid), {
        firstname,
        lastname,
        phone,
        its,
        yob,
      })

      if (isHead) {
        await updateDoc(doc(db, "families", currUser.familyid), {
          "head.firstname": firstname,
          "head.lastname": lastname,
          "head.its": its,
          "head.yob": yob,
          displayname: `${lastname} Family (${firstname})`,
        })
      }

      CustomMessage("success", "Account details updated")
      setAccountOpen(false)
    } catch (e: any) {
      console.log(e)
      CustomMessage(
        "error",
        `Could not update account: ${e?.code || ""} ${e?.message || e}`.trim()
      )
    } finally {
      setAccountSaving(false)
    }
  }

  const handleEditFamily = async (values: any) => {
    setFamilySaving(true)
    try {
      await updateDoc(doc(db, "families", currUser.familyid), {
        "address.street": values.address.street.trim(),
        "address.city": values.address.city.trim(),
        "address.zip": values.address.zip,
        registrationStatus: values.registrationStatus,
      })
      CustomMessage("success", "Family details updated")
      setFamilyOpen(false)
    } catch (e: any) {
      console.log(e)
      CustomMessage(
        "error",
        `Could not update family: ${e?.code || ""} ${e?.message || e}`.trim()
      )
    } finally {
      setFamilySaving(false)
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

  const renderMemberItem = (member: any, index: number) => {
    const registered = !!member.uid
    const displayName =
      [member.firstname, member.lastname].filter(Boolean).join(" ").trim() ||
      placeholderName(index)
    const link = inviteLinks[index]

    const actions: React.ReactNode[] = []
    if (!registered) {
      actions.push(
        link ? (
          <Tooltip key="copy" title={link}>
            <Button size="small" icon={<CopyOutlined />} onClick={() => handleCopy(link)}>
              Copy link
            </Button>
          </Tooltip>
        ) : (
          <Button
            key="invite"
            size="small"
            icon={<LinkOutlined />}
            loading={generating === index}
            onClick={() => handleGenerate(index)}
          >
            Invite
          </Button>
        )
      )
      actions.push(
        <Button
          key="edit"
          size="small"
          icon={<EditOutlined />}
          onClick={() => openEdit(index)}
        />
      )
      actions.push(
        <Popconfirm
          key="delete"
          title="Remove this family member?"
          description="Pending invite links for this person will be revoked."
          okText="Remove"
          okButtonProps={{ danger: true }}
          onConfirm={() => handleDeleteMember(index)}
        >
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            loading={deletingIndex === index}
          />
        </Popconfirm>
      )
    }

    return (
      <List.Item key={index} actions={actions}>
        <List.Item.Meta
          avatar={
            <div className="member-avatar">
              <UserOutlined />
            </div>
          }
          title={
            <span>
              {displayName}{" "}
              {registered ? (
                <Tag color="green" icon={<CheckOutlined />} style={{ marginLeft: ".25rem" }}>
                  Registered
                </Tag>
              ) : (
                <Tag color="default" style={{ marginLeft: ".25rem" }}>
                  Not registered
                </Tag>
              )}
            </span>
          }
          description={
            registered ? (
              <span style={{ color: "gray" }}>
                ITS #: {member.its || "n/a"} · YOB: {member.yob || "n/a"}
              </span>
            ) : (
              <span style={{ color: "gray" }}>
                Send an invite link so they can register themselves.
              </span>
            )
          }
        />
      </List.Item>
    )
  }

  return (
    <ProfileWrapper>
      <Card title="Profile" headStyle={{ fontSize: "1.5rem", textAlign: "center" }}>
        <Row>
          <Col md={12} lg={12}>
            <div className="section-header">
              <Divider orientation="left" style={{ marginTop: "0", marginBottom: 0 }}>
                Account Details
              </Divider>
              <Button
                type="link"
                size="small"
                icon={<EditOutlined />}
                onClick={() => setAccountOpen(true)}
              >
                Edit
              </Button>
            </div>
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
            <div className="section-header">
              <Divider orientation="left" style={{ marginBottom: 0 }}>
                Family Details
              </Divider>
              {isHead && (
                <Button
                  type="link"
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => setFamilyOpen(true)}
                >
                  Edit
                </Button>
              )}
            </div>
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
              <div className="manage-section">
                <Card
                  size="small"
                  title="Manage Family Members"
                  headStyle={{ borderBottom: "none", paddingTop: "0.75rem", paddingBottom: "0.25rem" }}
                  extra={
                    <Button
                      type="primary"
                      icon={<UserAddOutlined />}
                      onClick={() => setAddOpen(true)}
                    >
                      Add member
                    </Button>
                  }
                  style={{ marginTop: "1.5rem" }}
                >
                  <Alert
                    type="info"
                    style={{ marginBottom: ".75rem" }}
                    message="Add family members, then share an invite link with each one. The link preloads their family and slot so they only fill in their own details."
                  />
                  {currUser.family.members.length === 0 ? (
                    <div style={{ color: "gray", textAlign: "center", padding: "1rem" }}>
                      No family members yet. Click <strong>Add member</strong> to get started.
                    </div>
                  ) : (
                    <List
                      itemLayout="horizontal"
                      dataSource={currUser.family.members}
                      renderItem={(m: any, i: number) => renderMemberItem(m, i)}
                    />
                  )}
                </Card>

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
                      label="First name (optional)"
                      name="firstname"
                      extra="They'll fill in the rest when they register via your invite link."
                    >
                      <Input placeholder={`Member ${currUser.family.size + 1}`} />
                    </Form.Item>
                  </Form>
                </Modal>

                <Modal
                  title="Edit family member"
                  open={editIndex !== null}
                  onCancel={() => {
                    setEditIndex(null)
                    editForm.resetFields()
                  }}
                  onOk={() => editForm.submit()}
                  confirmLoading={editing}
                  okText="Save"
                  afterOpenChange={(open) => {
                    if (open && editIndex !== null) {
                      const m = currUser.family.members[editIndex]
                      editForm.setFieldsValue({
                        firstname: m.firstname?.startsWith("Member ") ? "" : m.firstname || "",
                        lastname: m.lastname || "",
                      })
                    }
                  }}
                >
                  <Form form={editForm} layout="vertical" onFinish={handleEditMember}>
                    <Form.Item label="First name" name="firstname">
                      <Input
                        placeholder={
                          editIndex !== null ? placeholderName(editIndex) : undefined
                        }
                      />
                    </Form.Item>
                    <Form.Item label="Last name" name="lastname">
                      <Input />
                    </Form.Item>
                  </Form>
                </Modal>
              </div>
            )}
          </Col>
        </Row>

        <Modal
          title="Edit account details"
          open={accountOpen}
          onCancel={() => setAccountOpen(false)}
          onOk={() => accountForm.submit()}
          confirmLoading={accountSaving}
          okText="Save"
          afterOpenChange={(open) => {
            if (open) {
              accountForm.setFieldsValue({
                firstname: currUser.firstname || "",
                lastname: currUser.lastname || "",
                phone: currUser.phone,
                its: currUser.its,
                yob: currUser.yob ? Number(currUser.yob) : undefined,
              })
            }
          }}
        >
          <Form form={accountForm} layout="vertical" onFinish={handleEditAccount}>
            <Form.Item
              label="First name"
              name="firstname"
              rules={[{ required: true, message: "First name is required" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Last name"
              name="lastname"
              rules={[{ required: true, message: "Last name is required" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="ITS #"
              name="its"
              rules={[{ required: true, message: "ITS number is required" }]}
            >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              label="Phone number"
              name="phone"
              rules={[{ required: true, message: "Phone number is required" }]}
            >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              label="Year of birth"
              name="yob"
              rules={[{ required: true, message: "Year of birth is required" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={1900}
                max={new Date().getFullYear()}
                controls={false}
              />
            </Form.Item>
            <div style={{ color: "gray", fontSize: ".85rem" }}>
              Email can't be changed here — contact a jamaat admin if you need to update it.
            </div>
          </Form>
        </Modal>

        {isHead && (
          <Modal
            title="Edit family details"
            open={familyOpen}
            onCancel={() => setFamilyOpen(false)}
            onOk={() => familyForm.submit()}
            confirmLoading={familySaving}
            okText="Save"
            afterOpenChange={(open) => {
              if (open) {
                familyForm.setFieldsValue({
                  address: {
                    street: currUser.family.address?.street || "",
                    city: currUser.family.address?.city || "",
                    zip: currUser.family.address?.zip,
                  },
                  registrationStatus: currUser.family.registrationStatus,
                })
              }
            }}
          >
            <Form form={familyForm} layout="vertical" onFinish={handleEditFamily}>
              <Form.Item
                label="Address (number & street)"
                name={["address", "street"]}
                rules={[{ required: true, message: "Street is required" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="City"
                name={["address", "city"]}
                rules={[{ required: true, message: "City is required" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Zip code"
                name={["address", "zip"]}
                rules={[{ required: true, message: "Zip code is required" }]}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                label="Jamaat registration status"
                name="registrationStatus"
                rules={[{ required: true, message: "Registration status is required" }]}
              >
                <Select>
                  <Select.Option value="Resident">Resident</Select.Option>
                  <Select.Option value="Visitor">Visitor</Select.Option>
                </Select>
              </Form.Item>
            </Form>
          </Modal>
        )}
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
  .section-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  .section-header .ant-divider {
    flex: 1;
  }
  .manage-section .ant-list-item {
    padding: 0.75rem 0;
  }
  .member-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #f0f2f5;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #595959;
  }

  @media (max-width: 575px) {
    .manage-section .ant-card-head {
      padding: 0.5rem 0.75rem 0.25rem;
    }
    .manage-section .ant-card-head-title,
    .manage-section .ant-card-extra {
      padding: 0.5rem 0;
    }
    .manage-section .ant-card-body {
      padding: 0.75rem;
    }
    .manage-section .ant-list-item {
      flex-direction: column;
      align-items: stretch;
      gap: 0.5rem;
      padding: 0.75rem 0;
    }
    .manage-section .ant-list-item-meta {
      margin-bottom: 0 !important;
    }
    .manage-section .ant-list-item-action {
      margin-left: 0 !important;
      margin-top: 0;
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }
    .manage-section .ant-list-item-action > li {
      padding: 0;
      margin: 0;
    }
    .manage-section .ant-list-item-action > li .ant-list-item-action-split {
      display: none;
    }
    .manage-section .ant-list-item-action > li .ant-btn {
      min-width: 0;
    }
  }
`

export default Profile
