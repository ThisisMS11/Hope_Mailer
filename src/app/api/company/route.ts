import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { createLoggerWithLabel } from "@/app/api/utils/logger";
import { makeResponse } from "@/app/api/helpers/reponseMaker";

const logger = createLoggerWithLabel("COMPANY");

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { name, domain, logo } = body;

    if (!name || !domain || !logo) {
      logger.error("Missing required fields: name, domain, or logo.");
      return makeResponse(
        400,
        false,
        "Missing required fields: name, domain, or logo.",
        null,
      );
    }

    const formattedName = name
      .split(" ")
      .map(
        (word: string) =>
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
      )
      .join(" ");

    const company = await prisma.company.create({
      data: {
        name: formattedName,
        domain,
        logo,
      },
    });

    logger.info("Company created successfully.");
    return makeResponse(201, true, "Company created successfully.", company);
  } catch (error) {
    logger.error(`Error creating company: ${error}`);
    return makeResponse(
      500,
      false,
      "Server error. Please try again later.",
      null,
    );
  }
};

export const GET = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const query = url.searchParams.get("q");

    let companies;

    if (query) {
      companies = await prisma.company.findMany({
        where: {
          name: {
            startsWith: query,
            mode: "insensitive",
          },
        },
      });

      if (companies.length === 0) {
        logger.info("No companies found matching the query.");
        return makeResponse(404, false, "No companies found.", []);
      }

      logger.info("Companies retrieved successfully with query.");
    } else {
      companies = await prisma.company.findMany();
      logger.info("All companies retrieved successfully.");
    }

    return makeResponse(
      200,
      true,
      "Companies retrieved successfully.",
      companies,
    );
  } catch (error) {
    logger.error(`Error retrieving companies: ${error}`);
    return makeResponse(
      500,
      false,
      "Server error. Please try again later.",
      null,
    );
  }
};
