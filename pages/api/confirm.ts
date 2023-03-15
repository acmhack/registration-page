import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import axios, { isAxiosError } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { dbUserToApplicant } from '../../utils/utils';

export default withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	const session = await getSession(req, res);
	const id = session!.user.sub;

	switch (req.method) {
		case 'POST': {
			const data = (await axios.get<DBEntry>(`${process.env.API_URL}/${id}`)).data;

			if (data.userstatus !== 'Confirmation Pending') {
				return res.status(400).send('User is not pending confirmation or already confirmed');
			}

			const newUser: DBEntry = {
				...data,
				userstatus: 'Confirmed'
			};

			try {
				await axios.put(process.env.API_URL!, newUser);

				return res.status(200).json(dbUserToApplicant(newUser));
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
		}
		default:
			return res.status(405).send('Invalid Method; use POST');
	}
});

