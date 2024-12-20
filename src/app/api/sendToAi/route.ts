import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createLoggerWithLabel } from "@/app/api/utils/logger";
import { constructPrompt } from "@/app/api/utils/PromptMaker";
import { makeResponse } from "@/app/api/helpers/reponseMaker";
const { GoogleGenerativeAI } = require("@google/generative-ai");

const logger = createLoggerWithLabel("AI_MODEL");

export const POST = async (req: NextRequest) => {
  try {
    logger.info("Starting the AI-based email content generation process.");

    // Parse form data
    const data = await req.formData();
    const jobDescription = data.get("jobDescription") as string;
    const optionSelected = data.get("optionSelected") as string;
    const resumeContent = data.get("resume") as File | null;
    const emailTemplate = data.get("emailTemplate") as string;

    // Validate inputs
    if (!jobDescription) {
      logger.error("Job description is missing.");
      return makeResponse(400, false, "Job description is required", null);
    }

    if (!optionSelected) {
      logger.error("Option selected is missing.");
      return makeResponse(400, false, "Option selected is required", null);
    }

    if (!resumeContent) {
      logger.error("Resume file is missing.");
      return makeResponse(400, false, "Resume file is required", null);
    }

    if (!emailTemplate) {
      logger.error("Email template is missing.");
      return makeResponse(400, false, "Email template is required", null);
    }

    if (!["application/pdf", "text/plain"].includes(resumeContent.type)) {
      logger.error("Unsupported resume file type.");
      return makeResponse(
        400,
        false,
        "Resume file must be in PDF or plain text format",
        null,
      );
    }

    // Convert resume to base64
    const resumeBuffer = Buffer.from(await resumeContent.arrayBuffer());
    const resumeBase64 = resumeBuffer.toString("base64");

    // const session = await getServerSession(authOptions);
    // if (!session || !session.user) {
    //     logger.error('User session is not available.');
    //     return makeResponse(401, false, 'Unauthorized', null);
    // }

    logger.info(`Initializing Google Generative AI instance.`);
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = constructPrompt(
      optionSelected,
      jobDescription,
      emailTemplate,
    );
    logger.info(`Generated Prompt : ${prompt}`);

    const resume = {
      inlineData: {
        data: resumeBase64,
        mimeType: "application/pdf",
      },
    };

    logger.info("Sending request to Google Gemini API.");
    try {
      const result = await model.generateContent([prompt, resume]);
      const responseText = result.response.text();

      logger.info("Successfully received response from Google Gemini API.");

      return makeResponse(
        200,
        true,
        "Email content successfully generated.",
        responseText,
      );
    } catch (error) {
      logger.error(`Error while communicating with Gemini API: ${error}`);
      return makeResponse(
        500,
        false,
        "AI service error. Please try again later.",
        null,
      );
    }
  } catch (error) {
    logger.error(`Unexpected error in API route: ${error}`);
    return makeResponse(
      500,
      false,
      "Server error. Please try again later.",
      null,
    );
  }
};
