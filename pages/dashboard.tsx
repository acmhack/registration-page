import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { Title } from '@mantine/core';
import { useRouter } from 'next/router';
import { NextPage } from 'next/types';
import { useEffect } from 'react';

const Dashboard: NextPage = () => {
	const { user, isLoading } = useUser();
	const router = useRouter();

	useEffect(() => {
		if (!user && !isLoading) {
			router.replace('/api/auth/login');
		} else if (!isLoading) {
			console.log(user);
		}
	}, [user, router, isLoading]);

	return (
		<div>
			<Title>Dashboard</Title>
			<Title order={2}>Subtitle</Title>
		</div>
	);
};

export default withPageAuthRequired(Dashboard, { returnTo: '/dashboard' });

