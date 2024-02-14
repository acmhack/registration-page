import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { getData } from '../../utils/db';

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	const id = req.cookies['ph-registration::id'];

	switch (req.method) {
		case 'GET': {
			const collection = await getData<Application>('applications');
			const user = await collection.findOne({ _id: new ObjectId(id) });

			if (!user) {
				return res.status(400).send('Invalid id cookie');
			}

			return res.status(200).json(user);
		}
		case 'POST': {
			const collection = await getData<Application>('applications');
			const user = await collection.findOne({ email: req.body.email });

			if (!user) {
				return res.status(400).send('Invalid email');
			}

			return res
				.status(200)
				.setHeader('Set-Cookie', `ph-registration::id=${user._id.toHexString()}; Max-Age=${6 * 31 * 24 * 3600}; Path=/`)
				.json(user);
		}
		default:
			res.status(405).json('Invalid Method; use GET or POST');
	}
};

