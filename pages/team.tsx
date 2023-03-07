import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { Title } from '@mantine/core';
import { NextPage } from 'next/types';

const Team: NextPage = () => {
	return (
		<div>
			<Title>Congrats, you found this page! Unfortunately, there&apos;s nothing here...</Title>
		</div>
	);
};

export default withPageAuthRequired(Team, { returnTo: '/team' });

