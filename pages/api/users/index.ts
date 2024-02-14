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
					const newApplication: Application = {
						...data,
						status: 'Admission Pending',
						category: existing.category,
						featured: existing.featured,
						projectLink: existing.projectLink,
						projectName: existing.projectName
					};

					await collection.findOneAndReplace({ _id: existing._id }, newApplication);

					return res
						.status(200)
						.setHeader('Set-Cookie', `ph-registration::id=${existing._id.toHexString()}; Max-Age=${6 * 31 * 24 * 3600}`)
						.json(newApplication);
				} else {
					const application: Application = {
						...data,
						status: 'Admission Pending',
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

