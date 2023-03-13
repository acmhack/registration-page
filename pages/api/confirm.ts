import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { dbUserToApplicant } from '../../utils/utils';

export default withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	const session = await getSession(req, res);
	const id = session!.user.sub;

	switch (req.method) {
		case 'POST': {
			const data = (await axios.get<DBEntry>(`https://nfn8sjemsh.execute-api.us-east-2.amazonaws.com/development/items/${id}`)).data;

			if (data.userstatus !== 'Confirmation Pending') {
				return res.status(400).send('User is not pending confirmation or already confirmed');
			}

			const newUser: DBEntry = {
				...data,
				userstatus: 'Confirmed'
			};

			await axios.put('https://nfn8sjemsh.execute-api.us-east-2.amazonaws.com/development/items', newUser);

			return res.status(200).json(dbUserToApplicant(newUser));
		}
		default:
			return res.status(405).send('Invalid Method; use POST');
	}
});

