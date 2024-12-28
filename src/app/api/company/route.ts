import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { createLoggerWithLabel } from "@/app/api/utils/logger";
import { makeResponse } from "@/app/api/helpers/reponseMaker";

const logger = createLoggerWithLabel("COMPANY");

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { name, domain, logo } = body;

    // Validate required fields
    if (!name) {
      logger.error("Missing required fields: name");
      return makeResponse(400, false, "Missing required field: name.", null);
    }

    // Format name
    const formattedName = name
      .split(" ")
      .map(
        (word: string) =>
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
      )
      .join(" ");

    // Prepare data for creation, excluding undefined optional fields
    const companyData: { name: string; domain?: string; logo?: string } = {
      name: formattedName,
    };

    if (domain) companyData.domain = domain;
    if (logo) companyData.logo = logo;

    // Create company in database
    const company = await prisma.company.create({
      data: companyData,
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
