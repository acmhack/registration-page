import { Title } from '@mantine/core';
import { NextPage } from 'next/types';

const Index: NextPage = () => {
	return (
		<div>
			<Title>Dashboard</Title>
			<Title order={2}>Subtitle</Title>
		</div>
	);
};

export default Index;

