import * as functions from "firebase-functions"
import * as sendGridMail from "@sendgrid/mail"

const API_KEY =
  "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"
const TEMPLATE_ID_JAMAAT = "d-4809086ff8aa47028fb49d949a05198e"
const TEMPLATE_ID_RECEIPT = "d-968abfbf1d8a4bd7ba4cd520a84dd680"

sendGridMail.setApiKey(API_KEY)

export const newContactFormSubmission = functions.firestore
  .document("contact/{contactID}")
  .onCreate(async (change, context) => {
    const submission = change.data() || {}
    const jamaat_email = {
      to: "ibrahim.0814@gmail.com",
      from: "webmaster@sandiegojamaat.net",
      templateId: TEMPLATE_ID_JAMAAT,
      dynamic_template_data: {
        name: submission.name,
        email: submission.email,
        phone: submission.phone,
        message: submission.message,
      },
    }

    const reciept_email = {
      to: submission.email,
      from: "webmaster@sandiegojamaat.net",
      templateId: TEMPLATE_ID_RECEIPT,
      dynamic_template_data: {
        name: submission.name,
        email: submission.email,
        phone: submission.phone,
        message: submission.message,
      },
    }
    return Promise.all([
      sendGridMail.send(jamaat_email),
      sendGridMail.send(reciept_email),
    ])
  })
