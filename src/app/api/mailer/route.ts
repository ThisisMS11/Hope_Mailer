import { NextRequest } from "next/server";
import { createLoggerWithLabel } from "@/app/api/utils/logger";
import { makeResponse } from "@/app/api/helpers/reponseMaker";
import { sendEmail } from "../utils/EmailHandler";

const logger = createLoggerWithLabel("AI_EMAIL_SENDER");

export const POST = async (req: NextRequest) => {
  try {
    logger.info("Starting the email sending process.");

    // Parse JSON data from the request body
    const data = await req.json();
    const { subject, message, email } = data;

    // Validate inputs
    if (!subject) {
      logger.error("Subject is missing.");
      return makeResponse(400, false, "Subject is required", null);
    }

    if (!message) {
      logger.error("message is missing.");
      return makeResponse(400, false, "Message is required", null);
    }

    if (!email) {
      logger.error("Recipient email (to) is missing.");
      return makeResponse(400, false, "Recipient email is required", null);
    }

    logger.info("All inputs validated. Invoking sendEmail function.");

    try {
      const emailResponse = await sendEmail({
        subject,
        message,
        email,
      });

      logger.info("Email sent successfully.");
      return makeResponse(200, true, "Email sent successfully.", emailResponse);
    } catch (error) {
      logger.error(`Error while sending email: ${error}`);
      return makeResponse(
        500,
        false,
        "Error while sending email. Please try again later.",
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
