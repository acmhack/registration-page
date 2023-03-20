import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { dbUserToApplicant } from '../../utils/utils';

export default withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	const session = await getSession(req, res);
	const id = session!.user.sub;

	const response = await axios.get(`${process.env.API_URL}/${id}`);

	if (response.headers['content-length'] === '0') {
		const newUser: DBEntry = {
			id,
			admin: false,
			userstatus: 'Profile Pending',
			firstname: '',
			lastname: '',
			email: '',
			age: '18',
			phone: '',
			country: 'United States',
			school: '',
			levelofstudy: 'Undergraduate University (3+ year)',
			gradyear: new Date().getFullYear().toString(),
			gradmonth: 'May',
			shirtsize: 'M',
			resume: null,
			diet: '[]',
			experience: 'My first hackathon!',
			links: '["", ""]',
			prehacks: false,
			lft: false,
			mlhcodeofconduct: false,
			mlhcommunication: false,
			mlhlogistics: false
		};

		await axios.put(`${process.env.API_URL}`, newUser);

		return res.status(200).json(dbUserToApplicant(newUser));
	}

	res.status(200).json(dbUserToApplicant(response.data));
});

