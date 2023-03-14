import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	const session = await getSession(req, res);
	const id = session!.user.sub;

	switch (req.method) {
		case 'GET': {
			const user = (await axios.get<DBEntry>(`${process.env.API_URL}/${id}`)).data;

			if (user.admin && req.query.id !== id) {
				const response = await axios.get(`${process.env.API_URL}/${req.query.id}`);

				return res.status(200).json(response.data);
			} else {
				return res.status(403).send("In the privacy interests of our hackers, only admins are allowed to view other users' data");
			}
		}
		case 'POST': {
			const user = (await axios.get<DBEntry>(`${process.env.API_URL}/${id}`)).data;
			const data : DBEntry = req.body;
			
			if (user.admin && data.id == req.query.id) {
				const response = await axios.put(process.env.API_URL!, data);
				return res.status(200).json(response.data);
			} else {
				return res.status(403).send("In the privacy interests of our hackers, only admins are allowed to view other users' data");
			}
		}
		default:
			res.status(405).json('Invalid Method; use GET');
	}
});

