import * as functions from "firebase-functions"
import * as sendGridMail from "@sendgrid/mail"

// sendgrid key
const API_KEY =
  "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"

// template for contact us submission email that is sent to jamaat admins
const TEMPLATE_ID_CONTACT_US_JAMAAT = "d-4809086ff8aa47028fb49d949a05198e"

// template for contact us submission email that is sent to the user who submitted it
const TEMPLATE_ID_CONTATCT_US_RECEIPT = "d-968abfbf1d8a4bd7ba4cd520a84dd680"

// templace for new user registration email that is sent to jamaat admins
const TEMPLATE_ID_NEW_USER_REGISTRATION_JAMAAT =
  "d-67342aa81e234d42841ebd0dfac1c003"

// set the api key for sendgrid
sendGridMail.setApiKey(API_KEY)

/*
Triggered when a user submits information via the contact us form on the homepage of the website we send two emails
First email: sent to jamaat admins to let them know someone has submitted an inquiry
Second email: sent to the user who submitted information, as a reciept
*/
export const newContactFormSubmission = functions.firestore
  .document("contact/{contactID}")
  .onCreate(async (change, context) => {
    const submission = change.data() || {}
    const jamaat_email = {
      to: ["umooor-dakheliyah@sandiegojamaat.net", "ibrahim.0814@gmail.com"],
      from: "webmaster@sandiegojamaat.net",
      templateId: TEMPLATE_ID_CONTACT_US_JAMAAT,
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
      templateId: TEMPLATE_ID_CONTATCT_US_RECEIPT,
      dynamic_template_data: {
        name: submission.name,
        email: submission.email,
        phone: submission.phone,
        message: submission.message,
      },
    }
    return Promise.all([
      sendGridMail.sendMultiple(jamaat_email),
      sendGridMail.send(reciept_email),
    ])
  })

/*
Triggered when a new user completes all the registration forms on the website and creates an account
We send some of their information to jamaat admins to let them know
*/
export const newUserRegistration = functions.firestore
  .document("users/{userID}")
  .onCreate(async (change, context) => {
    const submission = change.data() || {}
    const jamaat_email = {
      to: ["umooor-dakheliyah@sandiegojamaat.net", "ibrahim.0814@gmail.com"],
      from: "webmaster@sandiegojamaat.net",
      templateId: TEMPLATE_ID_NEW_USER_REGISTRATION_JAMAAT,
      dynamic_template_data: {
        firstname: submission.firstname,
        lastname: submission.lastname,
        email: submission.email,
        phone: submission.phone,
        familyhead: submission.familyhead ? "Yes" : "No",
      },
    }
    return Promise.all([sendGridMail.sendMultiple(jamaat_email)])
  })
