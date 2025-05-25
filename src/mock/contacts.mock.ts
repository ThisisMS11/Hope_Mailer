import { faker } from "@faker-js/faker";
import { ContactI } from "@/features/contacts/types";
import { optionI } from "@/features/contacts/components/MultiSelect";

export const generateMockContact = (): ContactI => ({
  id: faker.number.int({ min: 1, max: 1000 }),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  gender: faker.helpers.arrayElement(["MALE", "FEMALE"]),
  mobile: faker.phone.number(),
  linkedIn: faker.internet.url(),
  email: faker.internet.email(),
  position: faker.person.jobTitle(),
  positionType: "TALENT",
  experience: faker.number.int({ min: 0, max: 10 }),
  valid: faker.datatype.boolean(),
  companyId: faker.number.int({ min: 1, max: 50 }),
  companyName: faker.company.name(),
  logo: faker.image.avatar(),
});

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
  { length: 10 },
  generateMockContact,
);

export const mockCompanies: optionI[] = Array.from(
  { length: 10 },
  generateMockCompanies,
);
