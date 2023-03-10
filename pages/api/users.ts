import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

interface DBEntry {
	id: string;
	admin: boolean;
	userstatus: string;
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
	shirtsize: string;
	resume: string | null;
	diet: string;
	experience: string;
	links: string;
	prehacks: boolean;
	lft: boolean;
	mlhcodeofconduct: boolean;
	mlhcommunication: boolean;
	mlhlogistics: boolean;
}

export default withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	const session = await getSession(req, res);
	const id = session!.user.sub;

	switch (req.method) {
		case 'GET': {
			const response = await axios.get('https://nfn8sjemsh.execute-api.us-east-2.amazonaws.com/development/items');

			return res.status(200).json(response.data);
		}
		case 'POST': {
			const {
				firstName,
				lastName,
				email,
				age,
				phoneNumber,
				country,
				school,
				levelOfStudy,
				graduationMonth,
				graduationYear,
				shirtSize,
				dietRestrictions,
				hackathonCount,
				resume,
				linkedin,
				github,
				otherSites,
				attendingPrehacks,
				lookingForTeam,
				codeOfConductAgreement,
				dataAgreement,
				mlhAgreement
			} = req.body as JSONFormValues;

			const data: DBEntry = {
				id,
				admin: false,
				userstatus: 'Ready for Review',
				firstname: firstName,
				lastname: lastName,
				email,
				age,
				phone: phoneNumber,
				country,
				school,
				levelofstudy: levelOfStudy,
				gradyear: graduationYear,
				gradmonth: graduationMonth,
				shirtsize: shirtSize,
				resume,
				diet: JSON.stringify(dietRestrictions),
				experience: hackathonCount,
				links: JSON.stringify([linkedin, github, ...otherSites]),
				prehacks: attendingPrehacks,
				lft: lookingForTeam,
				mlhcodeofconduct: codeOfConductAgreement,
				mlhcommunication: dataAgreement,
				mlhlogistics: mlhAgreement
			};

			const response = await axios.put('https://nfn8sjemsh.execute-api.us-east-2.amazonaws.com/development/items', data);

			return res.status(200).json(response.data);
		}
	}
});

