function extractSubject(emailText: string) {
  // Split the input text into lines
  const lines = emailText.split("\n");

  // Find the line that starts with 'Subject:'
  for (const line of lines) {
    if (line.startsWith("Subject:")) {
      return line.replace("Subject:", "").trim();
    }
  }

  return "Subject not found";
}

function personalizeEmail(employee: any, emailContent: string) {
  const { gender, lastName, position } = employee;

  const salutation = gender === "male" ? "Mr." : "Ms.";

  let personalizedContent = emailContent
    .replace("{{person}}", `${salutation} ${lastName}`)
    .replace("{{position}}", position || "");

  personalizedContent = personalizedContent
    .split("\n") // Split by newline
    .map((line) => `<p>${line.trim()}</p>`) // Wrap each line in <p> tags
    .join(""); // Join back into a single string

  const finalEmailContent = `
              ${personalizedContent}
  
              <p>
                  <a href="https://link-to-resume.com" target="_blank" style="color: #007bff; text-decoration: none;">Resume Link</a><br>
                  <a href="https://link-to-internship.com" target="_blank" style="color: #007bff; text-decoration: none;">Internship Link</a>
              </p>
  
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
  // Split the content by the newline character and return everything after the first empty line (which separates the subject)
  const lines = emailContent.split("\n");
  const startIndex = lines.findIndex((line) => line.trim().startsWith("Dear"));

  if (startIndex !== -1) {
    return lines.slice(startIndex).join("\n");
  }
  return emailContent; // Return the original content if "Dear" is not found
}

const defaultEmailTemplate = `
Dear Mr.Garg,

My name is Mohit Saini and I am a final-year Computer Science student at IIIT Jabalpur, specializing in backend Technologies with experience across JavaScript, Python, Django, PostgreSQL, MERN stack, Docker, Linux, and AWS. I'm also skilled in SQL, C++, Golang, and have a strong aptitude for problem-solving.

I'm reaching out to you today because I'm interested in the Intern role at Delhivery. Given your valuable experience there as a Senior SDE, I would greatly value your support in referring me for the position or connecting me with the HR team if you feel my profile aligns well with the requirements.

Your support would mean a lot to someone eager to start their journey in tech.

I've attached my resume for you to look over. I'm happy to share any additional details if needed.
`;

export {
  extractSubject,
  personalizeEmail,
  defaultEmailTemplate,
  removeSubjectLine,
};
