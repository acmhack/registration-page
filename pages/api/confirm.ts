import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { getData } from '../../utils/db';

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	const id = req.cookies['ph-registration::id'];

	switch (req.method) {
		case 'POST': {
			const collection = await getData<Application>('applications');
			const user = await collection.findOne({ _id: new ObjectId(id) });

			if (!user) {
				return res.status(400).send('Invalid id cookie');
			} else if (user.status !== 'Confirmation Pending') {
				return res.status(400).send('User is not pending confirmation');
			}

			try {
				const updated = await collection.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { status: 'Confirmed' } });

				return res.status(200).json(updated);
			} catch (err: unknown) {
				console.log(err);
				return res.status(500).send('An unknown error occured');
			}
		}
		default:
			return res.status(405).send('Invalid Method; use POST');
	}
};

