import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	const session = await getSession(req, res);
	const id = session!.user.sub;

	switch (req.method) {
		case 'GET': {
			const user = (await axios.get<DBEntry>(`${process.env.API_URL}/${id}`)).data;

			if (user.admin) {
				const response = await axios.get(process.env.API_URL!);

				return res.status(200).json(response.data);
			} else {
				return res.status(403).send("In the privacy interests of our hackers, only admins are allowed to view other users' data");
			}
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

			const response = await axios.put(process.env.API_URL!, data);

			return res.status(200).json(response.data);
		}
	}
});

