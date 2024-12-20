import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { createLoggerWithLabel } from "@/app/api/utils/logger";
import { makeResponse } from "@/app/api/helpers/reponseMaker";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const logger = createLoggerWithLabel("CONTACTS");

// CREATE
export const POST = async (req: NextRequest) => {
  // ISSUE : not getting id is session user.
  const session = await getServerSession(authOptions);

  try {
    const body = await req.json();
    const {
      firstName,
      lastName,
      gender,
      mobile,
      linkedIn,
      email,
      company,
      position,
      experience,
    } = body;

    const userEmail = session?.user?.email;
    // @ts-ignore
    const user = await prisma.user.findUnique({ where: { email: userEmail } });

    if (!user) {
      logger.error(`user not found with email ${email}`);
      throw new Error(`User with email ${email} not found`);
    }

    const userId = user?.id;

    // Validate input
    if (
      !firstName ||
      !lastName ||
      !gender ||
      !mobile ||
      !email ||
      !company ||
      !position ||
      !userId
    ) {
      logger.error("Missing required fields.");
      return makeResponse(400, false, "All fields are required.", null);
    }

    if (!["male", "female", "not_know"].includes(gender)) {
      logger.error("Invalid gender value.");
      return makeResponse(
        400,
        false,
        "Gender must be 'male', 'female', or 'not_know'.",
        null,
      );
    }

    const contact = await prisma.contact.create({
      data: {
        firstName,
        lastName,
        gender,
        mobile,
        linkedIn,
        email,
        company,
        position,
        experience,
        userId,
      },
    });

    logger.info("Contact created successfully.");
    return makeResponse(201, true, "Contact created successfully.", contact);
  } catch (error) {
    console.log(error);
    logger.error(`Error creating contact: ${error}`);
    return makeResponse(
      500,
      false,
      "Server error. Please try again later.",
      null,
    );
  }
};

// READ
export const GET = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (id) {
      const contact = await prisma.contact.findUnique({
        where: { id },
      });

      if (!contact) {
        logger.error("Contact not found.");
        return makeResponse(404, false, "Contact not found.", null);
      }

      logger.info("Contact retrieved successfully.");
      return makeResponse(
        200,
        true,
        "Contact retrieved successfully.",
        contact,
      );
    } else {
      const contacts = await prisma.contact.findMany();
      logger.info("Contacts retrieved successfully.");
      return makeResponse(
        200,
        true,
        "Contacts retrieved successfully.",
        contacts,
      );
    }
  } catch (error) {
    logger.error(`Error retrieving contacts: ${error}`);
    return makeResponse(
      500,
      false,
      "Server error. Please try again later.",
      null,
    );
  }
};

// UPDATE
export const PUT = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      logger.error("Contact ID is required.");
      return makeResponse(400, false, "Contact ID is required.", null);
    }

    if (data.gender && !["male", "female", "not_know"].includes(data.gender)) {
      logger.error("Invalid gender value.");
      return makeResponse(
        400,
        false,
        "Gender must be 'male', 'female', or 'not_know'.",
        null,
      );
    }

    const updatedContact = await prisma.contact.update({
      where: { id },
      data,
    });

    logger.info("Contact updated successfully.");
    return makeResponse(
      200,
      true,
      "Contact updated successfully.",
      updatedContact,
    );
  } catch (error) {
    logger.error(`Error updating contact: ${error}`);
    return makeResponse(
      500,
      false,
      "Server error. Please try again later.",
      null,
    );
  }
};

// DELETE
export const DELETE = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      logger.error("Contact ID is required.");
      return makeResponse(400, false, "Contact ID is required.", null);
    }

    await prisma.contact.delete({
      where: { id },
    });

    logger.info("Contact deleted successfully.");
    return makeResponse(200, true, "Contact deleted successfully.", null);
  } catch (error) {
    logger.error(`Error deleting contact: ${error}`);
    return makeResponse(
      500,
      false,
      "Server error. Please try again later.",
      null,
    );
  }
};
