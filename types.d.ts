type UserStatus = 'Profile Pending' | 'Admission Pending' | 'Confirmation Pending' | 'Denied' | 'Confirmed' | 'Checked In'

interface JSONFormValues {
	firstName: string;
	lastName: string;
	email: string;
	age: string;
	phoneNumber: string;
	country: string;
	school: string;
	levelOfStudy: string;
	graduationMonth: string;
	graduationYear: string;
	shirtSize: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
	dietRestrictions: string[];
	hackathonCount: string;
	resume: string | null;
	linkedin?: string;
	github?: string;
	otherSites: string[];
	attendingPrehacks: boolean;
	lookingForTeam: boolean;
	codeOfConductAgreement: boolean;
	dataAgreement: boolean;
	mlhAgreement: boolean;
}

interface DBEntry {
	id: string;
	admin: boolean;
	userstatus: UserStatus;
	firstname: string;
	lastname: string;
	email: string;
	age: string;
	phone: string;
	country: string;
	school: string;
	levelofstudy: string;
	gradyear: string;
	gradmonth: string;
	shirtsize: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
	resume: string | null; //base64
	diet: string;
	experience: string;
	links: string;
	prehacks: boolean;
	lft: boolean;
	mlhcodeofconduct: boolean;
	mlhcommunication: boolean;
	mlhlogistics: boolean;
}

interface Applicant {
	firstName: string;
	lastName: string;
	email: string;
	userStatus: UserStatus;
	age: string;
	phoneNumber: string;
	country: string;
	school: string;
	levelOfStudy: string;
	graduationMonth: string;
	graduationYear: string;
	shirtSize: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
	dietRestrictions: string[];
	hackathonCount: string;
	resume: string | null;
	linkedin?: string;
	github?: string;
	otherSites: string[];
	attendingPrehacks: boolean;
	lookingForTeam: boolean;
	codeOfConductAgreement: boolean;
	dataAgreement: boolean;
	mlhAgreement: boolean;
}

