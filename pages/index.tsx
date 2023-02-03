import { Title } from '@mantine/core';
import { NextPage } from 'next/types';
import MyButton from '../components/MyButton';

const Index: NextPage = () => {
	return (
		<div>
			<Title>Basic Page</Title>
			<Title order={2}>Subtitle</Title>
			<MyButton onClick={() => alert('Hello')} />
		</div>
	);
};

export default Index;

