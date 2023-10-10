import { Collection, Document, MongoClient } from 'mongodb';

let client: Promise<MongoClient> | null = null;

export async function getData<T extends Document>(collection: string): Promise<Collection<T>> {
	if (!client) {
		client = MongoClient.connect(process.env.MONGODB_URL!);
	}

	return (await client).db(process.env.STAGE === 'prod' ? 'main' : 'test').collection<T>(collection);
}
