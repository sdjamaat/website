import React, { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import styled from "styled-components"
import {
  Alert,
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Spin,
  Tag,
} from "antd"
import Layout from "../components/other/layout"
import SuccessSplash from "../components/registration/success"
import CustomMessage from "../components/other/custom-message"
import { onFinishFailed } from "../functions/forms"
import { createUserWithEmailAndPassword } from "firebase/auth"
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore"
import { httpsCallable } from "firebase/functions"
import { auth, db, functions } from "../lib/firebase"

const { Option } = Select

type InviteData = {
  token: string
  familyid: string
  memberindex: number
  displayname?: string
  memberFirstname?: string
}

const makeFamilyId = (firstname: string, lastname: string) =>
  `${firstname.toLowerCase()}${lastname.toLowerCase()}${
    Math.floor(Math.random() * 100000) + 100000
  }`

const Register = () => {
  const [searchParams] = useSearchParams()
  const inviteToken = searchParams.get("invite")

  const [form] = Form.useForm()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const [invite, setInvite] = useState<InviteData | null>(null)
  const [inviteLoading, setInviteLoading] = useState<boolean>(!!inviteToken)
  const [inviteError, setInviteError] = useState<string | null>(null)

  const [familyhead, setFamilyhead] = useState<boolean | null>(null)
  const [familySize, setFamilySize] = useState<number>(1)

  // Load invite token if provided
  useEffect(() => {
    if (!inviteToken) return
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, "familyInvites", inviteToken))
        if (!snap.exists()) {
          setInviteError("This invite link is invalid.")
        } else {
          const data: any = snap.data()
          if (data.usedAt) {
            setInviteError("This invite link has already been used.")
          } else {
            const famSnap = await getDoc(doc(db, "families", data.familyid))
            if (!famSnap.exists()) {
              setInviteError("This invite link points to a family that no longer exists.")
            } else {
              const fam: any = famSnap.data()
              const member = fam.members?.[data.memberindex]
              setInvite({
                token: inviteToken,
                familyid: data.familyid,
                memberindex: data.memberindex,
                displayname: fam.displayname,
                memberFirstname: member?.firstname,
              })
              setFamilyhead(false)
              form.setFieldsValue({ familyhead: false })
            }
          }
        }
      } catch (e: any) {
        console.log(e)
        setInviteError("Could not load invite. Please try again.")
      } finally {
        setInviteLoading(false)
      }
    }
    load()
  }, [inviteToken])

  const onFinish = async (values: any) => {
    setIsSubmitting(true)
    try {
      const yobStr = values.yob.format("YYYY")
      const firstname = values.firstname.trim()
      const lastname = values.lastname.trim()
      const email = values.email.trim()
      const its = values.its
      const phone = values.phone

      // Resolve familyid + (if non-head) memberindex
      let familyid: string
      let memberindex: number | null = null
      if (familyhead) {
        familyid = makeFamilyId(firstname, lastname)
      } else if (invite) {
        familyid = invite.familyid
        memberindex = invite.memberindex
      } else {
        throw new Error("Only the head of family can register here. Ask your head to send you an invite link.")
      }

      const cred = await createUserWithEmailAndPassword(auth, email, values.password)
      const uid = cred.user.uid

      const userDoc = {
        familyhead: !!familyhead,
        its,
        email,
        firstname,
        lastname,
        title: "None",
        othertitles: [],
        yob: yobStr,
        phone,
        familyid,
        uid,
      }
      await setDoc(doc(db, "users", uid), userDoc)

      if (familyhead) {
        const memberSlots = []
        for (let i = 1; i < values.size; i++) {
          const name = values.memberNames?.[i]?.trim()
          memberSlots.push({
            firstname: name || `Member ${i + 1}`,
            lastname: "",
            yob: null,
            its: null,
            uid: null,
          })
        }
        const familyDoc = {
          size: values.size,
          registrationStatus: values.registrationStatus,
          address: {
            street: values.address.street.trim(),
            city: values.address.city.trim(),
            zip: values.address.zip,
          },
          members: memberSlots,
          head: { firstname, lastname, its, yob: yobStr, email, uid },
          displayname: `${lastname} Family (${firstname})`,
          fmb: { code: null, enrolled: false, thaaliSize: null },
          familyid,
        }
        await setDoc(doc(db, "families", familyid), familyDoc)
      } else {
        // Update the chosen member slot in-place
        const famSnap = await getDoc(doc(db, "families", familyid))
        const fam: any = famSnap.data()
        const members = (fam?.members || []).map((m: any) => ({ ...m }))
        if (!members[memberindex!]) {
          throw new Error("Selected family member slot no longer exists.")
        }
        members[memberindex!].firstname = firstname
        members[memberindex!].lastname = lastname
        members[memberindex!].its = its
        members[memberindex!].yob = yobStr
        members[memberindex!].uid = uid
        await updateDoc(doc(db, "families", familyid), { members })

        if (invite) {
          await updateDoc(doc(db, "familyInvites", invite.token), {
            usedAt: serverTimestamp(),
            usedBy: uid,
          })
        }
      }

      if (import.meta.env.VITE_ARE_NEW_USERS_DISABLED === "true") {
        const disableNewRegistration = httpsCallable(functions, "disableNewRegistration")
        await disableNewRegistration({ caller: { uid } })
      }

      setSubmitted(true)
    } catch (error: any) {
      console.log(error)
      CustomMessage("error", error.message || "Could not register")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <Layout>
        <RegisterWrapper>
          <div className="content">
            <Card
              title="Register"
              headStyle={{ fontSize: "1.7rem", textAlign: "center" }}
            >
              <SuccessSplash />
            </Card>
          </div>
        </RegisterWrapper>
      </Layout>
    )
  }

  if (inviteLoading) {
    return (
      <Layout>
        <RegisterWrapper>
          <div className="content">
            <Card
              title="Register"
              headStyle={{ fontSize: "1.7rem", textAlign: "center" }}
            >
              <div style={{ textAlign: "center", padding: "2rem" }}>
                <Spin /> <div style={{ marginTop: "1rem" }}>Loading invite...</div>
              </div>
            </Card>
          </div>
        </RegisterWrapper>
      </Layout>
    )
  }

  const memberNameInputs = []
  if (familyhead && familySize > 1) {
    for (let i = 1; i < familySize; i++) {
      memberNameInputs.push(
        <Form.Item
          key={i}
          label={`Family member #${i + 1} first name (optional):`}
          name={["memberNames", i]}
        >
          <Input placeholder={`Member ${i + 1}`} />
        </Form.Item>
      )
    }
  }

  return (
    <Layout>
      <RegisterWrapper>
        <div className="content">
          <Card
            title="Register"
            headStyle={{ fontSize: "1.7rem", textAlign: "center" }}
            bodyStyle={{ paddingBottom: "0" }}
          >
            <Spin spinning={isSubmitting}>
              {inviteError && (
                <Alert
                  type="error"
                  message={inviteError}
                  style={{ marginBottom: "1rem" }}
                />
              )}

              {invite && (
                <Alert
                  type="success"
                  style={{ marginBottom: "1rem" }}
                  message={
                    <div>
                      Joining <strong>{invite.displayname}</strong>
                      {invite.memberFirstname &&
                        ` as ${invite.memberFirstname}`}
                      .
                    </div>
                  }
                />
              )}

              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={() => onFinishFailed(form)}
                initialValues={{ familyhead: invite ? false : undefined, size: 1 }}
              >
                {!invite && (
                  <Form.Item
                    label="Head of family?"
                    name="familyhead"
                    rules={[
                      { required: true, message: "Please select if head of family" },
                    ]}
                  >
                    <Select onChange={(v: boolean) => setFamilyhead(v)}>
                      <Option value={true}>Yes</Option>
                      <Option value={false}>No</Option>
                    </Select>
                  </Form.Item>
                )}

                {familyhead === false && !invite && (
                  <Alert
                    type="info"
                    style={{ marginBottom: "1rem" }}
                    message="Only the head of family can register here"
                    description="Ask your head of family to send you an invite link from their profile. The link will let you register against your family without picking it from a list."
                  />
                )}

                {(familyhead === true || !!invite) && (<>
                <Form.Item
                  label="ITS #"
                  name="its"
                  rules={[{ required: true, message: "Please input your ITS number" }]}
                >
                  <InputNumber style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                  label="First name:"
                  name="firstname"
                  rules={[{ required: true, message: "Please input your first name" }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Last name:"
                  name="lastname"
                  rules={[{ required: true, message: "Please input your last name" }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Email:"
                  name="email"
                  rules={[
                    { required: true, message: "Please input your email" },
                    { type: "email", message: "Email is invalid" },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Password:"
                  name="password"
                  rules={[
                    { required: true, message: "Please input your password" },
                    () => ({
                      validator(_rule: any, value: string) {
                        const passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,200}$/
                        if (!value || value.match(passw)) {
                          return Promise.resolve()
                        }
                        return Promise.reject(
                          "Password must be at least 6 characters long and must contain a digit and an uppercase letter"
                        )
                      },
                    }),
                  ]}
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item
                  label="Year of birth:"
                  name="yob"
                  rules={[{ required: true, message: "Please input your YOB" }]}
                >
                  <DatePicker style={{ width: "100%", padding: ".2rem" }} picker="year" />
                </Form.Item>

                <Form.Item
                  label="Phone number:"
                  name="phone"
                  rules={[{ required: true, message: "Please input your phone number" }]}
                >
                  <InputNumber style={{ width: "100%" }} />
                </Form.Item>

                {familyhead && (
                  <>
                    <Form.Item
                      label="Number of family members in household (including you):"
                      name="size"
                      rules={[
                        { required: true, message: "Please input number of family members" },
                        {
                          validator: (_r, v) =>
                            v > 0
                              ? Promise.resolve()
                              : Promise.reject("Family size must be at least 1"),
                        },
                      ]}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        min={1}
                        onChange={(v) => setFamilySize(Number(v) || 1)}
                      />
                    </Form.Item>

                    <Form.Item
                      label="Jamaat registration status:"
                      name="registrationStatus"
                      rules={[
                        { required: true, message: "Please input your registration status" },
                      ]}
                    >
                      <Select>
                        <Option value="Resident">Resident</Option>
                        <Option value="Visitor">Visitor</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item
                      label="Address (number & street):"
                      name={["address", "street"]}
                      rules={[{ required: true, message: "Please input your address street" }]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="City:"
                      name={["address", "city"]}
                      rules={[{ required: true, message: "Please input your address city" }]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="Zip code:"
                      name={["address", "zip"]}
                      rules={[{ required: true, message: "Please input your address zip code" }]}
                    >
                      <InputNumber style={{ width: "100%" }} />
                    </Form.Item>

                    {memberNameInputs.length > 0 && (
                      <>
                        <Tag color="geekblue" style={{ marginBottom: ".75rem" }}>
                          Family members (optional)
                        </Tag>
                        <div style={{ fontSize: ".9rem", color: "gray", marginBottom: ".75rem" }}>
                          Add first names so each member can register later. You can skip and edit
                          them from your profile.
                        </div>
                        {memberNameInputs}
                      </>
                    )}
                  </>
                )}

                </>)}

                {(familyhead === true || !!invite) && (
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="submit-btn"
                    disabled={!!inviteError}
                  >
                    Register
                  </Button>
                </Form.Item>
                )}
              </Form>
            </Spin>
          </Card>
        </div>
      </RegisterWrapper>
    </Layout>
  )
}

const RegisterWrapper = styled.div`
  .content {
    max-width: 550px;
    margin: auto;
    padding-top: 3.5%;
  }
  .submit-btn {
    width: 100%;
    height: 3rem;
    font-size: 1.2rem;
    margin-top: 1rem;
  }
`

export default Register
