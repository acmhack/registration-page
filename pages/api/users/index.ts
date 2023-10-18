import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { getData } from '../../../utils/db';

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	const id = req.cookies['ph-registration::id'];

	switch (req.method) {
		case 'GET': {
			if (!id) {
				// TODO: consider whether POST should be protected by something similar
				return res.status(400).send('Missing id cookie');
			}

			try {
				const collection = await getData<Application>('applications');

				const user = await collection.findOne({ _id: new ObjectId(id) });

				if (!user) {
					return res.status(400).send('Invalid id cookie');
				}

				if (user.admin) {
					const applications = await collection.find().toArray();

					return res.status(200).json(applications);
				} else {
					return res.status(403).send("In the privacy interests of our hackers, only admins are allowed to view other users' data");
				}
			} catch (err: unknown) {
				console.log(err);
				return res.status(500).send('An unknown error occured');
			}
		}
		case 'POST': {
			const data = req.body as Omit<Application, 'status'>;

			try {
				const collection = await getData<Application>('applications');
				const existing = await collection.findOne({ email: data.email });

				if (existing) {
					const newApplication: Application = { ...data, status: 'Admission Pending' };

					await collection.findOneAndReplace({ _id: existing._id }, newApplication);

					return res
						.status(200)
						.setHeader('Set-Cookie', `ph-registration::id=${existing._id.toHexString()}; Max-Age=${6 * 31 * 24 * 3600}`)
						.json(newApplication);
				} else {
					const application: Application = { ...data, status: 'Admission Pending' };
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

