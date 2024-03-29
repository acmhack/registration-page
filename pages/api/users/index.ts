import { NextApiRequest, NextApiResponse } from 'next';
import { getData } from '../../../utils/db';

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	switch (req.method) {
		case 'POST': {
			const data = req.body as Omit<Application, 'status'>;

			try {
				const collection = await getData<Application>('applications');
				const existing = await collection.findOne({ email: data.email });

				if (existing) {
					return res.status(400).send('An application with that email already exists');
				} else {
					const application: Application = {
						...data,
                        school: data.school === 'Missouri University of Science and Technology' ? 'Missouri S&T' : data.school === 'University of Missouri' ? 'Mizzou' : data.school,
						category: null,
						featured: false,
						projectLink: null,
						projectName: null
					};
					const result = await collection.insertOne(application);

					if (result.acknowledged) {
						return res
							.status(201)
							.setHeader('Set-Cookie', `ph-registration::id=${result.insertedId.toHexString()}; Max-Age=${6 * 31 * 24 * 3600}`)
							.json(application);
					} else {
						return res.status(500).send('Failed to insert new application');
					}
				}
			} catch (err: unknown) {
				console.log(err);
				return res.status(500).send('An unknown error occured');
			}
		}
	}
};
