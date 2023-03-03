import { useUser } from '@auth0/nextjs-auth0/client';
import { Text, Title } from '@mantine/core';
import { useRouter } from 'next/router';
import { NextPage } from 'next/types';
import { useEffect } from 'react';

const Index: NextPage = () => {
	const { user, isLoading } = useUser();
	const router = useRouter();

	useEffect(() => {
		if (user) {
			router.replace('/dashboard');
		}
	}, [user, router, isLoading]);

	if (isLoading) {
		return <main>Loading...</main>;
	}

	return (
		<main>
			<Title>Welcome to the PickHacks Registration page!</Title>
			<Text>
				Please <a href="/api/auth/login">Log In</a> to continue.
			</Text>
		</main>
	);
};

export default Index;

