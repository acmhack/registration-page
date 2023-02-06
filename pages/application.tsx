import { Box, Button, Checkbox, Divider, FileInput, Group, MultiSelect, NativeSelect, SelectItem, Stack, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { NextPage } from 'next/types';
import { useState } from 'react';

const ICEBREAKERS = {
	character: 'If you could be a fictional character for a day, who would you be and what would you do?',
	game: 'Got any games? Tell us about your favorite video/board/party game and why you love it.'
};

interface FormValues {
	email: string;
	fullname: string;
	phonenumber: string;
	school: string;
	graduationyear: string;
	major: string;
	gender: string;
	race: string[];
	hackathoncount: string;
	resume: File | null;
	linkedin?: string;
	github?: string;
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
			fullname: '',
			phonenumber: '',
			graduationyear: 'Graduate',
			major: '',
			gender: 'W',
			race: [],
			hackathoncount: 'N',
			resume: null,
			school: 'MST',
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
			email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
			linkedin: (value) =>
				value === '' || value === undefined || /^https:\/\/(www\.)?linkedin\.com\/in\/\S+$/.test(value) ? null : 'Invalid LinkedIn URL',
			github: (value) => (value === '' || value === undefined || /^https:\/\/(www\.)?github\.com\/\S+$/.test(value) ? null : 'Invalid GitHub URL')
		}
	});
	const [raceOptions, setRace] = useState<SelectItem[]>([
		{ value: 'N', label: 'American Indian or Alaskan Native' },
		{ value: 'A', label: 'Asian' },
		{ value: 'B', label: 'Black or African-American' },
		{ value: 'H', label: 'Hispanic or Latino' },
		{ value: 'I', label: 'Native Hawaiian or other Pacific Islander' },
		{ value: 'W', label: 'White or Caucasian' },
		{ value: 'P', label: 'I prefer not to answer' }
	]);
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
						<TextInput required label="Email" placeholder="your@email.com" {...form.getInputProps('email')} />
						<TextInput required label="Full Name" {...form.getInputProps('fullname')} />
						<TextInput required label="Phone Number" {...form.getInputProps('phonenumber')} />
						<NativeSelect required label="School" {...form.getInputProps('school')} data={['MST', 'Mizzou', 'More School']} />
						<NativeSelect
							required
							label="Graduation Year"
							{...form.getInputProps('graduationyear')}
							data={[
								{ value: 'Graduate', label: 'Graduate Student' },
								{ value: '2023', label: '2023' },
								{ value: '2024', label: '2024' },
								{ value: '2025', label: '2025' },
								{ value: '2026', label: '2026' },
								{ value: '2027', label: '2027' },
								{ value: '2028', label: '2028' },
								{ value: 'High School', label: 'High School' }
							]}
						/>
						<TextInput required label="Major" {...form.getInputProps('major')} />
						<NativeSelect
							required
							label="Gender"
							{...form.getInputProps('gender')}
							data={[
								{ value: 'W', label: 'Woman' },
								{ value: 'M', label: 'Man' },
								{ value: 'T', label: 'Transgender' },
								{ value: 'N', label: 'Non-binary/non-conforming' },
								{ value: 'P', label: 'Prefer not to respond' }
							]}
						/>
						<MultiSelect
							required
							label="Race"
							{...form.getInputProps('race')}
							data={raceOptions}
							searchable
							creatable
							getCreateLabel={(query) => query}
							onCreate={(query) => {
								const item = { value: query, label: query };
								setRace([...raceOptions, { value: query, label: query }]);
								return item;
							}}></MultiSelect>
						<NativeSelect
							required
							label="How many hackathons have you participated in?"
							{...form.getInputProps('hackathoncount')}
							data={[
								{ value: 'N', label: 'My first hackathon!' },
								{ value: 'S', label: '1-3' },
								{ value: 'M', label: '4-6' },
								{ value: 'L', label: '7+' }
							]}
						/>

						{/* FileInput has a Capture prop has type boolean | "user" | "environment"
							Add after we know hosting server and resume site api
						*/}
						<FileInput
							label="Upload your resume. PDF only!"
							description="Resume is optional, but highly encouraged for your application."
							{...form.getInputProps('resume')}
							placeholder="Submit resume"
							accept="application/pdf"
						/>

						<TextInput label="LinkedIn" {...form.getInputProps('linkedin')} />
						<TextInput label="GitHub" {...form.getInputProps('github')} />
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
							}}
						/>

						<Divider />

						<Title order={3}>This year&apos;s PickHacks is all about entertainment, so please entertain us by answering these questions:</Title>
						{Object.entries(ICEBREAKERS).map(([property, prompt]) => (
							<TextInput required key={property} label={prompt} {...form.getInputProps(property)} withAsterisk />
						))}

						<Divider />

						<MultiSelect
							required
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

