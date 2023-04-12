import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import axios, { isAxiosError } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	const session = await getSession(req, res);
	const id = session!.user.sub;

	switch (req.method) {
		case 'GET': {
			const user = (await axios.get<DBEntry>(`${process.env.API_URL}/${id}`)).data;

			if (user.admin || req.query.id === id) {
				const response = await axios.get(`${process.env.API_URL}/${req.query.id}`); //req.query.id

				return res.status(200).json(response.data);
			} else {
				return res.status(403).send("In the privacy interests of our hackers, only admins are allowed to view other users' data");
			}
		}
		case 'POST': {
			const user = (await axios.get<DBEntry>(`${process.env.API_URL}/${id}`)).data;
			const data: DBEntry = req.body;

			if (user.admin || user.id === req.query.id) {
				try {
					const response = await axios.put(process.env.API_URL!, data);
					return res.status(200).json(response.data);
				} catch (err: unknown) {
					if (isAxiosError(err)) {
						if (err.response) {
							if (
								err.status === 400 &&
								typeof err.response.data === 'string' &&
								err.response.data.includes('throughput for the table was exceeded')
							) {
								return res.status(502).send("DB is overloaded at the moment, please try again in a bit (don't close the tab).");
							} else {
								console.log(err.response);
							}
						} else {
							console.log(err);
						}

						return res.status(500).send('An unknown error occured');
					} else {
						console.log(err);
						return res.status(500).send('An unknown error occured');
					}
				}
			} else {
				return res.status(403).send("In the privacy interests of our hackers, only admins are allowed to view other users' data");
			}
		}
		default:
			res.status(405).json('Invalid Method; use GET');
	}
});

