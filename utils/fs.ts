import { init } from 'filestack-js';

export const client = init(process.env.NEXT_PUBLIC_FILESTACK_KEY!);

