import { faker } from "@faker-js/faker";
import { ContactI } from "@/features/contacts/types";
import { optionI } from "@/features/contacts/components/MultiSelect";
import { PositionTypeEnum, GenderEnum } from "@/enums/enums";

const positionTypes = [
  PositionTypeEnum.TALENT,
  PositionTypeEnum.ENGINEERING,
  PositionTypeEnum.MANAGER,
  PositionTypeEnum.HEAD,
  PositionTypeEnum.OTHERS,
] as const;

export const mockCompanies: optionI[] = [
  {
    id: 1,
    key: "TechNova Solutions",
    value: "TechNova Solutions",
    logo: faker.image.avatar(),
  },
  {
    id: 2,
    key: "BluePeak Systems",
    value: "BluePeak Systems",
    logo: faker.image.avatar(),
  },
  {
    id: 3,
    key: "Nimbus Labs",
    value: "Nimbus Labs",
    logo: faker.image.avatar(),
  },
  {
    id: 4,
    key: "Quantum Hive",
    value: "Quantum Hive",
    logo: faker.image.avatar(),
  },
  {
    id: 5,
    key: "Vertex Dynamics",
    value: "Vertex Dynamics",
    logo: faker.image.avatar(),
  },
];

export const generateMockContact = (): ContactI => {
  const company = faker.helpers.arrayElement(mockCompanies);

  return {
    id: faker.number.int({ min: 1, max: 1000 }),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    gender: faker.helpers.arrayElement([GenderEnum.MALE, GenderEnum.FEMALE]),
    mobile: faker.phone.number(),
    linkedIn: faker.internet.url(),
    email: faker.internet.email(),
    position: faker.person.jobTitle(),
    positionType:
      positionTypes[Math.floor(Math.random() * positionTypes.length)],
    experience: faker.number.int({ min: 0, max: 10 }),
    valid: faker.datatype.boolean(),
    companyId: company.id,
    companyName: company.key,
    logo: company.logo ?? "",
  };
};

export const generateMockCompanies = (): optionI => {
  const key = faker.company.name();
  return {
    id: faker.number.int({ min: 1, max: 50 }),
    key: key,
    value: key,
    logo: faker.image.avatar(),
  };
};

export const mockContacts: ContactI[] = Array.from(
  { length: 30 },
  generateMockContact,
);

// export const mockCompanies: optionI[] = Array.from(
//   { length: 10 },
//   generateMockCompanies,
// );
