function extractSubject(emailText: string) {
  const lines = emailText.split("\n");

  for (const line of lines) {
    if (line.startsWith("Subject:")) {
      return line.replace("Subject:", "").trim();
    }
  }

  return "Subject not found";
}

function personalizeEmailSubject(
  subject: string,
  jobPosition: string,
  company: string,
) {
  let personalizedEmailSubject = subject
    .replace("{{jobPosition}}", jobPosition)
    .replace("{{company}}", company);
  return personalizedEmailSubject;
}

function personalizeEmail(
  employee: any,
  emailContent: string,
  attachResumeLink: boolean,
  attachInternshipLink: boolean,
  internshipLink?: string,
  resumeLink?: string,
) {
  const { gender, lastName, position, company, experience } = employee;

  const salutation = gender === "male" ? "Mr." : "Ms.";
  const article = /^[aeiouAEIOU]/.test(position) ? "an" : "a";

  let personalizedContent = emailContent
    .replace("{{person}}", `${salutation} ${lastName}`)
    .replace("{{position}}", `${article} ${position}`)
    .replace("{{experience}}", experience || "")
    .replace("{{company}}", company || "");

  personalizedContent = personalizedContent
    .split("\n")
    .map((line) => `<p>${line.trim()}</p>`)
    .join("");

  let linksContent = "";

  if (attachResumeLink) {
    resumeLink = resumeLink === "" ? "https://dub.sh/56eJZk7" : resumeLink;
    linksContent += `<a href=${resumeLink} target="_blank" style="color: #007bff; text-decoration: none;">Resume Link</a><br>`;
  }

  if (attachInternshipLink) {
    linksContent += `<a href=${internshipLink} target="_blank" style="color: #007bff; text-decoration: none;">Internship Link</a><br>`;
  }

  const finalEmailContent = `
              ${personalizedContent}
  
              <p>
                  ${linksContent}
              </p>

              <p>Thank you for taking the time to read through this email.</p>
  
              <p>
                  Best regards,<br><br>
                  <b>Mohit Saini</b><br>
                  Final Year B.Tech, Computer Science<br>
                  Indian Institute of Information Technology, Jabalpur<br>
                  📧 <a href="mailto:mohitforwork2002@gmail.com" style="color: #007bff; text-decoration: none;">mohitforwork2002@gmail.com</a><br>
                  📱 +91 9680453581<br>
                  GitHub: <a href="https://github.com/ThisisMS11" target="_blank" style="color: #007bff; text-decoration: none;">ThisisMS11</a> | 
                  LinkedIn: <a href="https://linkedin.com/in/mohitsaini11" target="_blank" style="color: #007bff; text-decoration: none;">Mohit Saini</a> | 
                  LeetCode: <a href="https://leetcode.com/ThisisMS11" target="_blank" style="color: #007bff; text-decoration: none;">ThisisMS11</a>
              </p>
      `;

  return finalEmailContent;
}

/* To remove the subject line from the generated content */
function removeSubjectLine(emailContent: string) {
  const lines = emailContent.split("\n");
  const startIndex = lines.findIndex((line) => line.trim().startsWith("Dear"));

  if (startIndex !== -1) {
    return lines.slice(startIndex).join("\n");
  }
  return emailContent;
}

const steps = {
  selectOption: {
    key: "selectOption",
    label: "Select Between Custom and AI Generated",
    component: "StepSelectOption",
  },
  custom: {
    key: "custom",
    steps: {
      pasteAndMark: {
        key: "pasteAndMark",
        label: "Paste your template and Mark Variables",
        component: "StepEditContent",
      },
    },
  },
  aiGenerated: {
    key: "aiGenerated",
    steps: {
      emailContext: {
        key: "emailContext",
        label: "Select emailContext",
        component: "StepEmailContext",
      },
      jobDescription: {
        key: "jobDescription",
        label: "Job Description",
        component: "StepJobDescription",
      },
      chooseResume: {
        key: "chooseResume",
        label: "Choose Resume",
        component: "StepUploadResume",
      },
      referenceTemplate: {
        key: "referenceTemplate",
        label: "Reference Email Template",
        component: "StepProvideEmailTemplate",
      },
      editAndMark: {
        key: "editAndMark",
        label: "Edit and Mark Variables",
        component: "StepEditContent",
      },
    },
  },
  final: {
    key: "MailingStarts",
    label: "Mailing to Selected Contacts",
    component: "FinalMailing",
  },
};

export {
  extractSubject,
  personalizeEmail,
  removeSubjectLine,
  personalizeEmailSubject,
  steps,
};
