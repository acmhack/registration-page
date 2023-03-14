import { handleAuth } from '@auth0/nextjs-auth0';

if (process.env.NEXT_PUBLIC_VERCEL_URL) {
	process.env.AUTH0_BASE_URL = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
}

export default handleAuth();

