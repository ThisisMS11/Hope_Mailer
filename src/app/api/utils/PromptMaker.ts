/**
 * Constructs a prompt for the AI model based on the input parameters.
 * @param {string} optionSelected - The option selected by the user.
 * @param {string} jobDescription - The job description provided by the user.
 * @param {string} emailTemplate - The email template provided by the user.
 * @returns {string} - The generated prompt.
 */
function constructPrompt(optionSelected: string, jobDescription: string, emailTemplate: string) {
    return `
        You are a professional AI assistant tasked with drafting a cold email.
        
        Context:
        - Job Description: ${jobDescription}
        - Email Template: ${emailTemplate}
        - Purpose: ${optionSelected}

        Requirements:
        - Most important requirement is that the generated text should not appear ai generated at any cost. i have given  you a email Template.
        - Personalize the email according to the job description by talking my relevant experiences from the resume.
        - Highlight the key strengths and skills relevant to the option selected using my attached resume.
        - Keep the tone professional yet engaging.
        - Keep the length of the text not more than the emailTemplate (very important)

        Instructions:
        1. Start with an engaging subject line.
        2. Use the provided template as a base.
        3. Ensure the content aligns with the job description and is succinct.
        4. Structure the email as:
           - Subject Line
           - Opening Greeting
           - Body: Highlight key skills/experiences
           - Closing with a Call to Action

        Generate the email content accordingly.
    `;
}

export { constructPrompt };