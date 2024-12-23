export const emailTemplates = {
  followUp: {
    subject: `Following Up on My {{jobPosition}} Application at {{company}}`,
    content: `
        Dear {{person}}, 

        I trust this email finds you in the best of your health and spirits. My name is Mohit Saini, and I am a final-year Computer Science student at IIIT Jabalpur. I am following up regarding my application for the {{jobPosition}} role at {{company}} and wanted to express my continued interest in the position.  

        I specialize in web technologies, with expertise in JavaScript, Python, Django, MERN, Docker, Linux, AWS, SQL, and C++. Alongside this, I have developed strong problem-solving abilities throughout my journey.

        I have also gained practical experience as a software developer Intern at <a href="https://pixaflip.com/" target="_blank" style="color: #007bff; text-decoration: none;">Pixaflip Technologies</a> and <a href="https://www.catoff.xyz/" target="_blank" style="color: #007bff; text-decoration: none;">CatOff</a>.

        I have linked my resume and will be happy to discuss further at your convenience and in case you're not the right person to assist in this matter, I would be grateful if you could kindly guide me to the appropriate contact.
        `,
  },

  referral: {
    subject: `Seeking Your Guidance for a {{jobPosition}} role at {{company}}`,
    content: `Dear {{person}},

        I trust this email finds you in the best of your health and spirits. My name is Mohit Saini and I am a final-year Computer Science student at IIIT Jabalpur, specializing in backend Technologies with experience across JavaScript, Python, Django, PostgreSQL, MERN stack, Docker, Linux, and AWS. I'm also skilled in SQL, C++, Golang, and have a strong aptitude for problem-solving.

        I have also gained practical experience as a software developer Intern at <a href="https://pixaflip.com/" target="_blank" style="color: #007bff; text-decoration: none;">Pixaflip Technologies</a> and <a href="https://www.catoff.xyz/" target="_blank" style="color: #007bff; text-decoration: none;">CatOff</a>.

        I'm reaching out to you today because I'm interested in the {{jobPosition}} role at {{company}}. Given your valuable experience there as {{position}}, I would greatly value your support in referring me for the position or connecting me with the HR team if you feel my profile aligns well with the requirements of the job.

        <u>Your support would mean a lot to a fresher eager to start his journey in tech.</u>

        I've attached my resume for you to look over. I'm happy to share any additional details if needed.
        `,
  },
};

export const defaultEmailTemplate = `
Dear Mr.Garg,

My name is Mohit Saini and I am a final-year Computer Science student at IIIT Jabalpur, specializing in backend Technologies with experience across JavaScript, Python, Django, PostgreSQL, MERN stack, Docker, Linux, and AWS. I'm also skilled in SQL, C++, Golang, and have a strong aptitude for problem-solving.

I'm reaching out to you today because I'm interested in the Intern role at Delhivery. Given your valuable experience there as a Senior SDE, I would greatly value your support in referring me for the position or connecting me with the HR team if you feel my profile aligns well with the requirements.

Your support would mean a lot to someone eager to start their journey in tech.

I've attached my resume for you to look over. I'm happy to share any additional details if needed.
`;
