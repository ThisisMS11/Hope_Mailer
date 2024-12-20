function extractSubject(emailText : string) {
    // Split the input text into lines
    const lines = emailText.split('\n');

    // Find the line that starts with 'Subject:'
    for (const line of lines) {
        if (line.startsWith('Subject:')) {
            return line.replace('Subject:', '').trim();
        }
    }

    return 'Subject not found';
}

export {extractSubject}