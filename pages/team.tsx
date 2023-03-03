import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { Title } from '@mantine/core';
import { NextPage } from 'next/types';
import { useEffect } from 'react';

const Team: NextPage = () => {
	const { user, isLoading } = useUser();

	useEffect(() => {
		if (!isLoading) {
			console.log(user);
		}
	}, [user, isLoading]);

	return (
		<div>
			<Title>Team Management</Title>
		</div>
	);
};

export default withPageAuthRequired(Team, { returnTo: '/team' });

