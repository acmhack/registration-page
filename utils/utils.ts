export function calculateRemainingTime(): [number, number, number, number] {
	const remainingTime = (new Date(2023, 3, 14, 16).valueOf() - Date.now()) / 1000;

	const seconds = Math.floor(remainingTime % 60);
	const minutes = Math.floor(remainingTime / 60) % 60;
	const hours = Math.floor(remainingTime / 3600) % 24;
	const days = Math.floor(remainingTime / (3600 * 24));

	return [days, hours, minutes, seconds];
}

export function dbUserToApplicant({
	age,
	country,
	diet,
	email,
	experience,
	firstname,
	gradmonth,
	gradyear,
	lastname,
	levelofstudy,
	lft,
	links,
	mlhcodeofconduct,
	mlhcommunication,
	mlhlogistics,
	phone,
	prehacks,
	resume,
	school,
	shirtsize,
	userstatus
}: DBEntry): Applicant {
	const [linkedin, github, ...otherSites] = JSON.parse(links);

	return {
		age,
		attendingPrehacks: prehacks,
		codeOfConductAgreement: mlhcodeofconduct,
		country,
		dataAgreement: mlhcommunication,
		dietRestrictions: JSON.parse(diet),
		email,
		firstName: firstname,
		graduationMonth: gradmonth,
		graduationYear: gradyear,
		hackathonCount: experience,
		lastName: lastname,
		levelOfStudy: levelofstudy,
		lookingForTeam: lft,
		mlhAgreement: mlhlogistics,
		otherSites,
		phoneNumber: phone,
		resume,
		school,
		shirtSize: shirtsize,
		userStatus: userstatus,
		github,
		linkedin
	};
}

