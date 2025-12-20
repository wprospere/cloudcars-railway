export const emailTemplates = {
  driverApproved: {
    subject: "Welcome to Cloud Cars - Application Approved",
    body: `Dear {name},

Congratulations! We're pleased to inform you that your driver application has been approved.

Welcome to the Cloud Cars team! We're excited to have you join us as we continue to provide exceptional taxi services across Nottingham.

Next Steps:
1. Complete your onboarding paperwork
2. Schedule your vehicle inspection
3. Attend the driver orientation session

Please call us at 0115 8 244 244 to schedule your onboarding appointment.

Best regards,
Cloud Cars Team
www.cloudcarsltd.com`
  },

  driverInterview: {
    subject: "Cloud Cars - Interview Invitation",
    body: `Dear {name},

Thank you for your interest in joining Cloud Cars as a driver.

We would like to invite you for an interview to discuss your application further.

Please contact us at {phone} to schedule a convenient time for your interview.

We look forward to meeting you!

Best regards,
Cloud Cars Team
www.cloudcarsltd.com`
  },

  driverMoreInfo: {
    subject: "Cloud Cars - Additional Information Required",
    body: `Dear {name},

Thank you for submitting your driver application to Cloud Cars.

We need some additional information to process your application. Please reply to this email with:

- A copy of your valid driving licence
- Proof of vehicle ownership (if applicable)
- References from previous employers

Once we receive this information, we'll be able to move forward with your application.

Best regards,
Cloud Cars Team
www.cloudcarsltd.com`
  },

  corporateQuote: {
    subject: "Cloud Cars - Corporate Account Quote",
    body: `Dear {name},

Thank you for your interest in establishing a corporate account with Cloud Cars.

We're delighted to provide tailored transportation solutions for {company}. Our corporate accounts offer:

- Priority booking and dedicated account management
- Flexible payment terms (monthly invoicing)
- Competitive rates for regular business travel
- Professional, DBS-checked drivers
- Hybrid and eco-friendly vehicle options

I'll prepare a customized quote based on your estimated monthly requirements and send it to you shortly.

In the meantime, if you have any questions, please don't hesitate to contact us at 0115 8 244 244.

Best regards,
Cloud Cars Corporate Team
www.cloudcarsltd.com`
  },

  corporateWelcome: {
    subject: "Welcome to Cloud Cars Corporate Services",
    body: `Dear {name},

Welcome to Cloud Cars! We're thrilled to have {company} as a corporate partner.

Your corporate account is now active. You can start booking rides through our business portal at:
https://book.cloudcarsltd.com/portal/#/account/select-type

Account Benefits:
- Priority booking and dispatch
- Monthly consolidated invoicing
- Dedicated account manager
- 24/7 availability
- Real-time booking confirmations

If you need any assistance or have questions about your account, please contact us at 0115 8 244 244.

We look forward to serving your transportation needs!

Best regards,
Cloud Cars Corporate Team
www.cloudcarsltd.com`
  },

  corporateFollowup: {
    subject: "Following Up - Cloud Cars Corporate Account",
    body: `Dear {name},

I wanted to follow up on our recent conversation about establishing a corporate account for {company} with Cloud Cars.

Have you had a chance to review our proposal? I'd be happy to answer any questions or discuss how we can tailor our services to meet your specific needs.

Our corporate accounts offer:
- Flexible payment terms
- Competitive rates
- Priority service
- Professional drivers

Please let me know if you'd like to schedule a call to discuss further.

Best regards,
Cloud Cars Corporate Team
www.cloudcarsltd.com
0115 8 244 244`
  },

  generalThankYou: {
    subject: "Thank You for Contacting Cloud Cars",
    body: `Dear {name},

Thank you for getting in touch with Cloud Cars.

We've received your message and one of our team members will respond to you shortly.

If your inquiry is urgent, please don't hesitate to call us at 0115 8 244 244.

Best regards,
Cloud Cars Team
www.cloudcarsltd.com`
  },

  generalResolved: {
    subject: "Your Inquiry - Cloud Cars",
    body: `Dear {name},

Thank you for contacting Cloud Cars.

We're pleased to confirm that your inquiry has been resolved. If you have any further questions or need additional assistance, please don't hesitate to reach out.

We appreciate your business and look forward to serving you again soon!

Best regards,
Cloud Cars Team
www.cloudcarsltd.com
0115 8 244 244`
  }
};

export type EmailTemplateType = keyof typeof emailTemplates;
