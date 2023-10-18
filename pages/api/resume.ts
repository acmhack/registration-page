import { Request, Response } from 'express';
import { File } from 'filestack-js/build/main/lib/api/upload';
import multer from 'multer';
import { createRouter } from 'next-connect';
import { client } from '../../utils/fs';

const router = createRouter<Request, Response>();

export default router
	.use(multer({ storage: multer.memoryStorage() }).single('resume'))
	.post(async (req: Request, res: Response): Promise<void> => {
		if (req.file) {
			const file: File = await client.upload(req.file.buffer, undefined, { filename: req.file.originalname });

			res.status(201).json({ url: file.url });
		} else {
			res.status(400).send('Missing resume file.');
		}
	})
	.handler();

export const config = {
	api: {
		bodyParser: false
	}
};

