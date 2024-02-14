import { Button, Flex, Input, MediaQuery, Space, Text, Title } from '@mantine/core';
import { useRouter } from 'next/router';
import { GetServerSideProps, NextPage } from 'next/types';
import { useState } from 'react';
import { http } from '../utils/utils';

const Index: NextPage = () => {
	const router = useRouter();
	const [email, setEmail] = useState<string>('');
	const [error, setError] = useState<string | null>(null);

	return (
		<MediaQuery query="(max-width: 1100px) and (min-width: 701px)" styles={{ paddingLeft: '15vw' }}>
			<Flex justify="center" align="center" direction="column" gap="lg" style={{ height: '100%' }}>
				<Title align="center">Welcome to PickHacks Registration!</Title>
				<Text align="center" fz="lg">
					Please enter your email to access your application
					<Input value={email} onChange={(evt) => setEmail(evt.target.value)} />
					<Space h="sm" />
					<Button
						onClick={() =>
							http
								.post('/api/me', { email })
								.then(() => router.push('/dashboard'))
								.catch((err) => setError(err.response?.data ?? 'Unknown error'))
						}>
						Submit
					</Button>
					{error !== null && <Text color="red">{error}</Text>}
				</Text>
				<Text align="center" fz="lg">
					Or{' '}
					<a href="/application" style={{ color: '#148648', fontWeight: 'bold' }}>
						begin a new application
					</a>
				</Text>
			</Flex>
		</MediaQuery>
	);
};

export default Index;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	if ('ph-registration::id' in req.cookies) {
		return { redirect: { statusCode: 301, destination: '/dashboard' } };
	}

	return { props: {} };
};

