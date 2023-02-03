import { Box, Button, Checkbox, Divider, Group, MultiSelect, NativeSelect, SelectItem, Stack, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { NextPage } from 'next/types';
import { useState } from 'react';

const ICEBREAKERS = {
	character: 'If you could be a fictional character for a day, who would you be and what would you do?',
	game: 'Got any games? Tell us about your favorite video/board/party game and why you love it.'
};

interface FormValues {
	email: string;
	fname: string;
	school: string;
	linkedin?: string;
	github: string;
	otherSites: string[];
	dietRestrictions: string[];
	discoveryMethod: string[];
	attendingPrehacks: boolean;
	codeOfConductAgreement: boolean;
	dataAgreement: boolean;
	mlhAgreement: boolean;
	adult: boolean;
}

const Application: NextPage = () => {
	const form = useForm<FormValues & typeof ICEBREAKERS>({
		initialValues: {
			email: '',
			fname: '',
			school: '',
			linkedin: '',
			github: '',
			otherSites: [],
			dietRestrictions: [],
			character: '',
			game: '',
			discoveryMethod: [],
			attendingPrehacks: false,
			codeOfConductAgreement: false,
			dataAgreement: false,
			mlhAgreement: false,
			adult: false
		},
		validate: {
			email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email')
		}
	});
	const [otherURLs, setOtherURLs] = useState<string[]>([]);
	const [dietOptions, setDietOptions] = useState<SelectItem[]>([
		{ value: 'N', label: 'None' },
		{ value: 'T', label: 'Vegetarian' },
		{ value: 'V', label: 'Vegan' },
		{ value: 'G', label: 'Gluten Free' },
		{ value: 'A', label: 'Nut Allergy' },
		{ value: 'K', label: 'Kosher' },
		{ value: 'H', label: 'Halal' }
	]);
	const [discoveryOptions, setDiscoveryOptions] = useState<SelectItem[]>([
		{ value: 'W', label: 'Word of Mouth' },
		{ value: 'M', label: 'Social Media (Instagram, Twitter, Facebook, etc.)' },
		{ value: 'H', label: 'MLH Website' },
		{ value: 'E', label: 'E-Mail' },
		{ value: 'S', label: 'School Organization' },
		{ value: 'P', label: 'Professor/Class' },
		{ value: 'I', label: 'Internet Search' }
	]);

	return (
		<div>
			<Box sx={{ maxWidth: 600 }} mx="auto">
				<form onSubmit={form.onSubmit((values) => console.log(values))}>
					<Stack>
						<TextInput withAsterisk label="Email" placeholder="your@email.com" {...form.getInputProps('email')} />
						<TextInput label="Full Name" {...form.getInputProps('fname')} />
						<NativeSelect label="School" {...form.getInputProps('school')} data={['MST', 'Mizzou', 'More School']} />
						<TextInput label="LinkedIn" {...form.getInputProps('linkedin')} />
						<TextInput withAsterisk label="GitHub" {...form.getInputProps('github')} />
						<MultiSelect
							label="Other Sites"
							{...form.getInputProps('otherSites')}
							data={otherURLs}
							searchable
							creatable
							getCreateLabel={(query) => query}
							onCreate={(query) => {
								setOtherURLs([...form.values.otherSites, query]);
								return query;
							}}
							rightSection={null}
						/>
						<MultiSelect
							label="Dietary Restrictions"
							{...form.getInputProps('dietRestrictions')}
							data={dietOptions}
							searchable
							creatable
							getCreateLabel={(query) => query}
							onCreate={(query) => {
								const item = { value: query, label: query };
								setDietOptions([...dietOptions, { value: query, label: query }]);
								return item;
							}}></MultiSelect>

						<Divider />

						<Title order={3}>This year’s PickHacks is all about entertainment, so please entertain us by answering these questions:</Title>
						{Object.entries(ICEBREAKERS).map(([property, prompt]) => (
							<TextInput key={property} label={prompt} {...form.getInputProps(property)} withAsterisk />
						))}

						<Divider />

						<MultiSelect
							label="How did you hear about PickHacks?"
							{...form.getInputProps('discoveryMethod')}
							data={discoveryOptions}
							searchable
							creatable
							getCreateLabel={(query) => query}
							onCreate={(query) => {
								const item = { value: query, label: query };
								setDiscoveryOptions([...discoveryOptions, { value: query, label: query }]);
								return item;
							}}
						/>
						<Checkbox label="Please check if you will be attending our prehacks event." {...form.getInputProps('attendingPrehacks')} />
						<Checkbox
							required
							label={
								<>
									I have read and agree to the{' '}
									<a href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf" target="_blank" rel="noopener noreferrer">
										MLH Code of Conduct.
									</a>
								</>
							}
							{...form.getInputProps('codeOfConductAgreement')}
						/>
						<Checkbox
							required
							label={
								<>
									I authorize you to share my application/registration information for event administration, ranking, MLH administration,
									pre- and post-event informational e-mails, and occasional messages about hackathons in-line with the MLH Privacy Policy. I
									further I agree to the terms of both the
									<a
										href="https://github.com/MLH/mlh-policies/tree/master/prize-terms-and-conditions"
										target="_blank"
										rel="noopener noreferrer">
										{' '}
										MLH Contest Terms and Conditions
									</a>{' '}
									and the
									<a href="https://mlh.io/privacy" target="_blank" rel="noopener noreferrer">
										MLH Privacy Policy.
									</a>
								</>
							}
							{...form.getInputProps('dataAgreement')}
						/>
						<Checkbox
							label="I authorize MLH to send me pre- and post-event informational emails, which contain free credit and opportunities from their partners."
							{...form.getInputProps('mlhAgreement')}
						/>

						<Group position="right" mt="md">
							<Button type="submit">Submit</Button>
						</Group>
					</Stack>
				</form>
			</Box>
		</div>
	);
};

export default Application;

