import { Box, Button, Checkbox, FileInput, Group, MultiSelect, NativeSelect, SelectItem, Stack, Stepper, Switch, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { NextPage } from 'next/types';
import { useState } from 'react';

interface FormValues {
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
	school: string;
	graduationYear: string;
	shirtSize: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
	dietRestrictions: string[];
	hackathonCount: string;
	resume: File | null;
	linkedin?: string;
	github?: string;
	otherSites: string[];
	attendingPrehacks: boolean;
	lookingForTeam: boolean;
	codeOfConductAgreement: boolean;
	dataAgreement: boolean;
	mlhAgreement: boolean;
}

const Application: NextPage = () => {
	const form = useForm<FormValues>({
		initialValues: {
			firstName: '',
			lastName: '',
			email: '',
			phoneNumber: '',
			graduationYear: 'Graduate',
			shirtSize: 'M',
			hackathonCount: 'N',
			resume: null,
			school: 'MST',
			linkedin: '',
			github: '',
			otherSites: [],
			dietRestrictions: [],
			attendingPrehacks: false,
			lookingForTeam: false,
			codeOfConductAgreement: false,
			dataAgreement: false,
			mlhAgreement: false
		},
		validate: {
			firstName: (value) => (value === '' ? 'Please enter your first name' : null),
			lastName: (value) => (value === '' ? 'Please enter your last name' : null),
			email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
			linkedin: (value) =>
				value === '' || value === undefined || /^https:\/\/(www\.)?linkedin\.com\/in\/\S+$/.test(value) ? null : 'Invalid LinkedIn URL',
			github: (value) => (value === '' || value === undefined || /^https:\/\/(www\.)?github\.com\/\S+$/.test(value) ? null : 'Invalid GitHub URL')
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
	const [step, setStep] = useState<number>(0);

	return (
		<div>
			<Box sx={{ maxWidth: 1200 }} mx="auto">
				<form onSubmit={form.onSubmit((values) => console.log(values))}>
					<Stepper
						active={step}
						onStepClick={(step: number) => {
							if (!form.validate().hasErrors) {
								setStep(step);
							}
						}}>
						<Stepper.Step label="Personal Info">
							<Box sx={{ maxWidth: 600 }} mx="auto">
								<Stack>
									<TextInput required label="First Name" {...form.getInputProps('firstName')} />
									<TextInput required label="Last Name" {...form.getInputProps('lastName')} />
									<TextInput required label="Email" placeholder="your@email.com" {...form.getInputProps('email')} />
									<TextInput label="Phone Number" {...form.getInputProps('phoneNumber')} />
									<NativeSelect required label="School" {...form.getInputProps('school')} data={['MST', 'Mizzou', 'Other School']} />
									<NativeSelect
										required
										label="Graduation Year"
										{...form.getInputProps('graduationYear')}
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
									<Group position="right" mt="md">
										<Button
											onClick={() => {
												if (!form.validate().hasErrors) {
													setStep(step + 1);
												}
											}}>
											Next
										</Button>
									</Group>
								</Stack>
							</Box>
						</Stepper.Step>
						<Stepper.Step label="Prior Experience">
							<Box sx={{ maxWidth: 600 }} mx="auto">
								<Stack>
									<NativeSelect
										required
										label="T-Shirt Size"
										{...form.getInputProps('shirtSize')}
										data={['XS', 'S', 'M', 'L', 'XL', 'XXL']}
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
									<NativeSelect
										label="How many hackathons have you participated in?"
										{...form.getInputProps('hackathonCount')}
										data={[
											{ value: 'N', label: 'My first hackathon!' },
											{ value: 'S', label: '1-3' },
											{ value: 'M', label: '4-6' },
											{ value: 'L', label: '7+' }
										]}
									/>
									{/* TODO: FileInput has a Capture prop has type boolean | "user" | "environment"
										Add after we know hosting server and resume site api */}
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
									<Switch label="I am looking for a team" {...form.getInputProps('lookingForTeam')} />
									<Switch label="I am interested in attending the PreHacks event" {...form.getInputProps('attendingPrehacks')} />
									<Group position="right" mt="md">
										<Button
											variant="default"
											onClick={() => {
												setStep(step - 1);
											}}>
											Back
										</Button>
										<Button
											onClick={() => {
												if (!form.validate().hasErrors) {
													setStep(step + 1);
												}
											}}>
											Next
										</Button>
									</Group>
								</Stack>
							</Box>
						</Stepper.Step>
						<Stepper.Step label="Consent">
							<Box sx={{ maxWidth: 600 }} mx="auto">
								<Stack>
									<Checkbox
										required
										label={
											<>
												<span style={{ color: 'red' }}>*</span> I have read and agree to the{' '}
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
												<span style={{ color: 'red' }}>*</span> I authorize you to share my application/registration information for
												event administration, ranking, MLH administration, pre- and post-event informational e-mails, and occasional
												messages about hackathons in-line with the MLH Privacy Policy. I further I agree to the terms of both the{' '}
												<a
													href="https://github.com/MLH/mlh-policies/tree/master/prize-terms-and-conditions"
													target="_blank"
													rel="noopener noreferrer">
													MLH Contest Terms and Conditions
												</a>{' '}
												and the{' '}
												<a href="https://mlh.io/privacy" target="_blank" rel="noopener noreferrer">
													MLH Privacy Policy.
												</a>
											</>
										}
										{...form.getInputProps('dataAgreement')}
									/>
									<Checkbox
										required
										label={
											<>
												<span style={{ color: 'red' }}>*</span> I authorize MLH to send me pre- and post-event informational emails,
												which contain free credit and opportunities from their partners.
											</>
										}
										{...form.getInputProps('mlhAgreement')}
									/>

									<Group position="right" mt="md">
										<Button
											variant="default"
											onClick={() => {
												setStep(step - 1);
											}}>
											Back
										</Button>
										<Button type="submit">Submit</Button>
									</Group>
								</Stack>
							</Box>
						</Stepper.Step>
					</Stepper>
				</form>
			</Box>
		</div>
	);
};

export default Application;

