export interface  EmailBody {
	subject : string;
	body : string;
	scheduledTime : number;
	contactIds : number[];
	attachmentIds :number[];
	additionalData : {
		internshipLink ?: string;
		resumeLink ?: string;
		coverLetterLink ?: string;
	};
}