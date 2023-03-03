import { useUser } from '@auth0/nextjs-auth0/client';
import { Title } from '@mantine/core';
import { NextPage } from 'next/types';
import { useEffect } from 'react';

const Admin: NextPage = () => {
	const { user, isLoading } = useUser();

	useEffect(() => {
		if (!isLoading) {
			console.log(user);
		}
	}, [user, isLoading]);

	return (
		<div>
			<Title>Admin Panel?</Title>
		</div>
	);
};

export default Admin;

