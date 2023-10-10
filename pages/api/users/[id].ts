import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { getData } from '../../../utils/db';

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	const id = req.cookies['ph-registration::id'];

	switch (req.method) {
		case 'GET': {
			const collection = await getData<Application>('applications');
			const user = await collection.findOne({ _id: new ObjectId(id) });

			if (!user) {
				return res.status(400).send('Invalid id cookie');
			}

			if (user.admin || req.query.id === id) {
				const application = await collection.findOne({ _id: new ObjectId(req.query.id as string) });

				return res.status(200).json(application);
			} else {
				return res.status(403).send("In the privacy interests of our hackers, only admins are allowed to view other users' data");
			}
		}
		case 'POST': {
			const collection = await getData<Application>('applications');
			const user = await collection.findOne({ _id: new ObjectId(id) });
			const data: Application = req.body;

			if (!user) {
				return res.status(400).send('Invalid id cookie');
			}

			if (user.admin || id === req.query.id) {
				try {
					const result = await collection.findOneAndUpdate({ _id: new ObjectId(req.query.id as string) }, { $set: data });

					return res.status(200).json(result);
				} catch (err: unknown) {
					console.log(err);
					return res.status(500).send('An unknown error occured');
				}
			} else {
				return res.status(403).send("In the privacy interests of our hackers, only admins are allowed to view other users' data");
			}
		}
		default:
			res.status(405).json('Invalid Method; use GET');
	}
};

