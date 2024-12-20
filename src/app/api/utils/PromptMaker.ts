/**
 * Constructs a prompt for the AI model based on the input parameters.
 * @param {string} optionSelected - The option selected by the user.
 * @param {string} jobDescription - The job description provided by the user.
 * @param {string} emailTemplate - The email template provided by the user.
 * @returns {string} - The generated prompt.
 */
function constructPrompt(optionSelected: string, jobDescription: string, emailTemplate: string) {
    return `
        You are a professional AI assistant tasked with drafting a highly personalized and professional cold email.

        Context:
        - Job Description: ${jobDescription}
        - Email Template (provided): ${emailTemplate}
        - Purpose: ${optionSelected}

        Key Requirements:
        - Use the email template as a foundation but enhance it with personalization and relevance.
        - Ensure the text feels natural and human-written, avoiding AI-generated tone at all costs.
        - Highlight my experiences and skills relevant to the job description and the selected purpose by leveraging my resume.
        - Limit the word count to 140 words while maintaining clarity and impact.
        - Exclude any footer starting from "Thank you for your time and consideration."

        Specific Instructions:
        1. Craft an engaging subject line tailored to the context.
        2. Begin with a warm and professional greeting.
        3. Use the body to emphasize my top skills and experiences that align with the job description.
        4. Personalize the email to the role and purpose while keeping it professional and compelling.
        5. Close with a clear call to action, avoiding generic phrases.

        Final Email Structure:
        - Subject Line
        - Opening Greeting
        - Body: Key skills/experiences and relevance
        - Closing: Call to Action

        Generate the email content accordingly.
    `;
}


export { constructPrompt };