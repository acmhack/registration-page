type UserStatus = 'Admission Pending' | 'Confirmation Pending' | 'Denied' | 'Confirmed' | 'Checked In';

interface Application extends ApplicationData {
	_id: import('mongodb').ObjectId;
	status: UserStatus;
	admin: boolean;
}

interface ApplicationData {
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

	category: string | null;
	featured: boolean;
	projectLink: string | null;
	projectName: string | null;
}

