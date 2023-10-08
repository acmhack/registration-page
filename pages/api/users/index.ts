import axios from 'axios';
import { MongoClient } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	console.log(req.cookies);
	const id = '';

	switch (req.method) {
		case 'GET': {
			const user = (await axios.get<Application>(`${process.env.API_URL}/${id}`)).data;

			if (user.admin) {
				const response = await axios.get(process.env.API_URL!);

				return res.status(200).json(response.data);
			} else {
				return res.status(403).send("In the privacy interests of our hackers, only admins are allowed to view other users' data");
			}
		}
		case 'POST': {
			const data = req.body as Omit<Application, 'status'>;

			try {
				const client = await MongoClient.connect(process.env.MONGODB_URL!);
				const collection = client.db(process.env.STAGE === 'prod' ? 'main' : 'test').collection<Application>('applications');

				const application: Application = { ...data, status: 'Admission Pending' };
				const result = await collection.insertOne(application);

				if (result.acknowledged) {
					return res.status(201).json(application);
				} else {
					return res.status(500).send('Failed to insert new application');
				}
			} catch (err: unknown) {
				console.log(err);
				return res.status(500).send('An unknown error occured');
			}
		}
	}
};

