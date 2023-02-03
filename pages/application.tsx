import { TextInput, Checkbox, Button, Group, Box, InputBase } from '@mantine/core';
import { useForm } from '@mantine/form'
import { NextPage } from 'next/types';
import MyButton from '../components/MyButton';

const Application: NextPage = () => {
	const form = useForm({
		initialValues: {
			email: '',
			fname: '',
			school: '',
		},

		validate: {
			email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
		},
	});

	return (
		<div>
			<Box sx={{ maxWidth: 300 }} mx="auto">
				<form onSubmit={form.onSubmit((values) => console.log(values))}>
					<TextInput
					withAsterisk
					label="Email"
					placeholder="your@email.com"
					{...form.getInputProps('email')}
					/>

					<TextInput
					label="Full Name"
					{...form.getInputProps('fname')}
					/>

					<InputBase
					label="School" // ambitious I know
					component="select"
					mt="md"
					{...form.getInputProps('school')}
					>
						<option value="school">MST</option>
						<option value="school2">Mizzou</option>
						<option value="school3">More School</option>
					</InputBase>
					<Group position="right" mt="md">
					<Button type="submit">Submit</Button>
					</Group>
				</form>
			</Box>
		</div>
	);
};

export default Application;
