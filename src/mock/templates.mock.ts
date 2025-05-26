export const mockTemplates = [
  {
    id: "1",
    name: "Welcome Email",
    subject: "Welcome to our platform!",
    body: "Dear {{firstName}},\n\nWelcome to our platform. We're excited to have you onboard!\n\nBest regards,\nThe Team",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Follow-up Email",
    subject: "Following up on our conversation",
    body: "Hello {{firstName}},\n\nI wanted to follow up on our conversation about {{position}} at {{companyName}}.\n\nRegards,\nThe Team",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
