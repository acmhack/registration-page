import { useUser } from '@auth0/nextjs-auth0/client';
import { Text, Title, Flex, MediaQuery } from '@mantine/core';
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
		<MediaQuery
			query="(max-width: 1275px)"
			styles={{ paddingLeft: "100px" }}
		>
			<Flex justify="center" align="center" direction="column" gap="lg" style={{height: "100%"}}>
				<Title align="center">Welcome to PickHacks Registration!</Title>
				<Text align="center" fz="lg">
					Please <a href="/api/auth/login" style={{color: "#148648", fontWeight: "bold"}}>Log In</a> to register.
				</Text>
			</Flex>
		</MediaQuery>
	);
};

export default Index;

