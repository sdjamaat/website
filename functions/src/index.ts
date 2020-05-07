import * as functions from "firebase-functions"
import * as sendGridMail from "@sendgrid/mail"

const API_KEY =
  "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"
const TEMPLATE_ID = "d-4809086ff8aa47028fb49d949a05198e"

sendGridMail.setApiKey(API_KEY)

export const newContactFormSubmission = functions.firestore
  .document("contact/{contactID}")
  .onCreate(async (change, context) => {
    const submission = change.data() || {}
    const msg = {
      to: "ibrahim.0814@gmail.com",
      from: "webmaster@sandiegojamaat.net",
      templateId: TEMPLATE_ID,
      dynamic_template_data: {
        name: submission.name,
        email: submission.email,
        phone: submission.phone,
        message: submission.message,
      },
    }
    return sendGridMail.send(msg)
  })
