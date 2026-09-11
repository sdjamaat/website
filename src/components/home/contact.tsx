import React, { useRef, useState } from "react"
import { Form, Input, Button, Card, Spin, Alert } from "antd"
import { onFinishFailed } from "../../functions/forms"
import { httpsCallable } from "firebase/functions"
import { functions } from "../../lib/firebase"
import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile"
import styled from "styled-components"
import CustomMessage from "../other/custom-message"

const Contact = () => {
  const [form] = Form.useForm()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const turnstile = useRef<TurnstileInstance>(null)
  const submitting = useRef(false)
  const [token, setToken] = useState("")
  const [securityError, setSecurityError] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY

  const onFinish = async (values: Record<string, string>) => {
    if (submitting.current) return
    if (!siteKey || !token) {
      setSubmitError("Please complete the security check before submitting.")
      return
    }
    submitting.current = true
    setIsSubmitting(true)
    setSubmitError("")
    try {
      await httpsCallable(
        functions,
        "submitContactForm",
      )({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        message: values.message.trim(),
        website: values.website || "",
        turnstileToken: token,
      })
      form.resetFields()
      CustomMessage(
        "success",
        "Successfully submitted information! Check your email for a confirmation message",
      )
    } catch (error) {
      const code = (error as { code?: string }).code
      setSubmitError(
        code === "functions/resource-exhausted"
          ? "Too many submissions. Please wait an hour before trying again."
          : code === "functions/permission-denied" ||
              code === "functions/invalid-argument"
            ? "Please check your entries and complete the security check again."
            : "Could not submit your message. Your entries have been kept; please try again later.",
      )
    } finally {
      // Turnstile tokens are single-use, including after an unsuccessful request.
      setToken("")
      turnstile.current?.reset()
      submitting.current = false
      setIsSubmitting(false)
    }
  }

  const onSecurityError = () => {
    setToken("")
    setSecurityError(true)
  }

  const layout = {
    labelCol: { span: 16 },
    wrapperCol: { span: 24 },
  }

  return (
    <ContactWrapper>
      <Card
        hoverable={true}
        title={"Contact Us"}
        className="contact-us"
        styles={{
          header: { fontSize: "1.4rem", textAlign: "center" },
          body: { padding: "1.5rem", marginBottom: "-1.5rem" },
        }}
      >
        <Spin spinning={isSubmitting}>
          <Form
            {...layout}
            form={form}
            onFinish={onFinish}
            onFinishFailed={() => onFinishFailed(form)}
            layout="vertical"
            size="small"
          >
            <Form.Item
              name="name"
              label="Name"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Please input your name",
                },
                { max: 100 },
              ]}
            >
              <Input maxLength={100} autoComplete="name" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please input your email" },
                { type: "email", message: "Email is invalid" },
                { max: 254 },
              ]}
            >
              <Input maxLength={254} autoComplete="email" />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Phone number"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Please input your phone number",
                },
                { max: 30 },
                {
                  pattern: /^[+\d().\s-]+$/,
                  message: "Please enter a valid phone number",
                },
                {
                  validator: (_, value) => {
                    const digits = (value || "").replace(/\D/g, "").length
                    return digits >= 7 && digits <= 15
                      ? Promise.resolve()
                      : Promise.reject(new Error("Please enter 7–15 digits"))
                  },
                },
              ]}
            >
              <Input type="tel" autoComplete="tel" maxLength={30} />
            </Form.Item>
            <Form.Item
              name="message"
              label="Message"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Please input your message",
                },
                { max: 5000 },
              ]}
            >
              <Input.TextArea rows={10} maxLength={5000} showCount />
            </Form.Item>
            <div className="contact-honeypot" aria-hidden="true">
              <Form.Item name="website" label="Leave this field empty">
                <Input tabIndex={-1} autoComplete="off" />
              </Form.Item>
            </div>
            <Form.Item>
              {siteKey ? (
                <Turnstile
                  ref={turnstile}
                  siteKey={siteKey}
                  options={{
                    action: "contact",
                    size: "compact",
                    theme: "light",
                  }}
                  onSuccess={value => {
                    setToken(value)
                    setSecurityError(false)
                  }}
                  onExpire={() => setToken("")}
                  onTimeout={onSecurityError}
                  onError={onSecurityError}
                  onUnsupported={onSecurityError}
                  scriptOptions={{ onError: onSecurityError }}
                />
              ) : (
                <Alert
                  type="warning"
                  message="The contact form is temporarily unavailable. Please email umoor-dakhiliya@sandiegojamaat.net."
                />
              )}
              {securityError && (
                <Alert
                  type="warning"
                  message="The security check could not load. Please refresh this page or email umoor-dakhiliya@sandiegojamaat.net."
                />
              )}
              {submitError && (
                <Alert type="error" message={submitError} role="alert" />
              )}
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="submit-btn"
                loading={isSubmitting}
                disabled={!siteKey || !token || isSubmitting}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Card>
    </ContactWrapper>
  )
}

const ContactWrapper = styled.div`
  height: 100%;
  padding-bottom: 15px;
  .ant-card {
    height: 100%;
  }
  .contact-honeypot {
    position: absolute;
    left: -10000px;
    width: 1px;
    height: 1px;
    overflow: hidden;
  }
  .submit-btn {
    width: 100%;
    height: 2.5rem;
  }
`

export default Contact
