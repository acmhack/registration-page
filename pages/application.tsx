import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import {
	Box,
	Button,
	Checkbox,
	FileInput,
	Group,
	MultiSelect,
	NativeSelect,
	NumberInput,
	Stack,
	Stepper,
	Switch,
	Text,
	TextInput,
	Tooltip
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconQuestionMark } from '@tabler/icons-react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { NextPage } from 'next/types';
import { useEffect, useState } from 'react';

interface FormValues {
	firstName: string;
	lastName: string;
	email: string;
	age: string;
	phoneNumber: string;
	country: string;
	school: string;
	levelOfStudy: string;
	graduationMonth: string;
	graduationYear: number;
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

const countries = [
	'United States',
	'Afghanistan',
	'Albania',
	'Algeria',
	'Andorra',
	'Angola',
	'Antigua and Barbuda',
	'Argentina',
	'Armenia',
	'Australia',
	'Austria',
	'Azerbaijan',
	'The Bahamas',
	'Bahrain',
	'Bangladesh',
	'Barbados',
	'Belarus',
	'Belgium',
	'Belize',
	'Benin',
	'Bhutan',
	'Bolivia',
	'Bosnia and Herzegovina',
	'Botswana',
	'Brazil',
	'Brunei',
	'Bulgaria',
	'Burkina Faso',
	'Burundi',
	'Cabo Verde',
	'Cambodia',
	'Cameroon',
	'Canada',
	'Central African Republic',
	'Chad',
	'Chile',
	'China',
	'Colombia',
	'Comoros',
	'Congo, Democratic Republic of the',
	'Congo, Republic of the',
	'Costa Rica',
	'Côte d’Ivoire',
	'Croatia',
	'Cuba',
	'Cyprus',
	'Czech Republic',
	'Denmark',
	'Djibouti',
	'Dominica',
	'Dominican Republic',
	'East Timor (Timor-Leste)',
	'Ecuador',
	'Egypt',
	'El Salvador',
	'Equatorial Guinea',
	'Eritrea',
	'Estonia',
	'Eswatini',
	'Ethiopia',
	'Fiji',
	'Finland',
	'France',
	'Gabon',
	'The Gambia',
	'Georgia',
	'Germany',
	'Ghana',
	'Greece',
	'Grenada',
	'Guatemala',
	'Guinea',
	'Guinea-Bissau',
	'Guyana',
	'Haiti',
	'Honduras',
	'Hungary',
	'Iceland',
	'India',
	'Indonesia',
	'Iran',
	'Iraq',
	'Ireland',
	'Israel',
	'Italy',
	'Jamaica',
	'Japan',
	'Jordan',
	'Kazakhstan',
	'Kenya',
	'Kiribati',
	'Korea, North',
	'Korea, South',
	'Kosovo',
	'Kuwait',
	'Kyrgyzstan',
	'Laos',
	'Latvia',
	'Lebanon',
	'Lesotho',
	'Liberia',
	'Libya',
	'Liechtenstein',
	'Lithuania',
	'Luxembourg',
	'Madagascar',
	'Malawi',
	'Malaysia',
	'Maldives',
	'Mali',
	'Malta',
	'Marshall Islands',
	'Mauritania',
	'Mauritius',
	'Mexico',
	'Micronesia, Federated States of',
	'Moldova',
	'Monaco',
	'Mongolia',
	'Montenegro',
	'Morocco',
	'Mozambique',
	'Myanmar (Burma)',
	'Namibia',
	'Nauru',
	'Nepal',
	'Netherlands',
	'New Zealand',
	'Nicaragua',
	'Niger',
	'Nigeria',
	'North Macedonia',
	'Norway',
	'Oman',
	'Pakistan',
	'Palau',
	'Panama',
	'Papua New Guinea',
	'Paraguay',
	'Peru',
	'Philippines',
	'Poland',
	'Portugal',
	'Qatar',
	'Romania',
	'Russia',
	'Rwanda',
	'Saint Kitts and Nevis',
	'Saint Lucia',
	'Saint Vincent and the Grenadines',
	'Samoa',
	'San Marino',
	'Sao Tome and Principe',
	'Saudi Arabia',
	'Senegal',
	'Serbia',
	'Seychelles',
	'Sierra Leone',
	'Singapore',
	'Slovakia',
	'Slovenia',
	'Solomon Islands',
	'Somalia',
	'South Africa',
	'Spain',
	'Sri Lanka',
	'Sudan',
	'Sudan, South',
	'Suriname',
	'Sweden',
	'Switzerland',
	'Syria',
	'Taiwan',
	'Tajikistan',
	'Tanzania',
	'Thailand',
	'Togo',
	'Tonga',
	'Trinidad and Tobago',
	'Tunisia',
	'Turkey',
	'Turkmenistan',
	'Tuvalu',
	'Uganda',
	'Ukraine',
	'United Arab Emirates',
	'United Kingdom',
	'Uruguay',
	'Uzbekistan',
	'Vanuatu',
	'Vatican City',
	'Venezuela',
	'Vietnam',
	'Yemen',
	'Zambia',
	'Zimbabwe'
];

const levelsOfStudy: string[] = [
	'Less than Secondary/High School',
	'Secondary/High School',
	'Undergraduate University (2 year - community college or similar)',
	'Undergraduate University (3+ year)',
	'Graduate University (Masters, Professional, Doctoral, etc.)',
	'Code School/Bootcamp',
	'Other Vocational/Trade Program/Apprenticeship',
	'Other',
	"I'm currently not a student",
	'Prefer not to answer'
];

const Application: NextPage = () => {
	const form = useForm<FormValues>({
		initialValues: {
			firstName: '',
			lastName: '',
			email: '',
			age: '18',
			phoneNumber: '',
			country: 'United States',
			school: '',
			levelOfStudy: 'Undergraduate University (3+ year)',
			graduationYear: new Date().getFullYear(),
			graduationMonth: 'May',
			shirtSize: 'M',
			hackathonCount: 'My first hackathon!',
			resume: null,
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
			age: (value) => (/^\d{1,2}$/.test(value) ? null : 'Invalid age'),
			phoneNumber: (value) =>
				value === '' || value === undefined || /^\d{10}$/.test(value) ? null : 'Invalid phone number (must be in format xxxyyyzzzz)',
			graduationYear: (value) => (/^\d{4}$/.test(value.toString()) ? null : 'Invalid graduation year'),
			graduationMonth: (value) => (value === '' ? 'Please select a graduation month' : null),
			school: (value) => (value === '' ? 'Please enter your school' : null),
			linkedin: (value) =>
				value === '' || value === undefined || /^https:\/\/(www\.)?linkedin\.com\/in\/\S+$/.test(value) ? null : 'Invalid LinkedIn URL',
			github: (value) => (value === '' || value === undefined || /^https:\/\/(www\.)?github\.com\/\S+$/.test(value) ? null : 'Invalid GitHub URL')
		}
	});
	const [otherURLs, setOtherURLs] = useState<string[]>([]);
	const [dietOptions, setDietOptions] = useState<string[]>(['Vegetarian', 'Vegan', 'Gluten Free', 'Nut Allergy', 'Kosher', 'Halal']);
	const [step, setStep] = useState<number>(0);
	const { user } = useUser();
	const [submitted, setSubmitted] = useState<boolean>(false);
	const [disabled, setDisabled] = useState<boolean>(false);
	const router = useRouter();

	useEffect(() => {
		axios.get<Applicant>('/api/me').then((res) => {
			if (res.data.userStatus !== 'Profile Pending') {
				setDisabled(true);
			}
		});
	}, []);

	return (
		<div>
			<Box sx={{ maxWidth: 1200 }} mx="auto">
				<form
					onSubmit={form.onSubmit((values) => {
						if (!user) {
							throw new Error('Shit has gone terribly wrong...');
						}

						if (form.values.resume) {
							const reader = new FileReader();

							reader.onloadend = () => {
								const resultString = reader.result as string;
								const resume = resultString.slice(resultString.indexOf(',') + 1);

								const applicationData = {
									...values,
									graduationYear: values.graduationYear.toString(),
									resume
								};

								const id: string = 'submitting-notification';
								let expired: boolean = false;

								axios
									.post('/api/users', applicationData)
									.then(() => {
										router.replace('/dashboard');

										if (!expired) {
											notifications.hide(id);
										}
									})
									.catch((err: AxiosError) => {
										if (err.response) {
											console.log(err.response.data);
											notifications.show({
												message: err.response.data as string,
												title: 'Something went wrong...',
												autoClose: 5000,
												color: 'red'
											});

											if (!expired) {
												notifications.hide(id);
											}
										}
									});

								notifications.show({
									id,
									title: 'Submitting application...',
									message: '',
									loading: true,
									color: 'green',
									autoClose: 5000,
									onClose: () => (expired = true)
								});
							};

							reader.readAsDataURL(form.values.resume);
						} else {
							const applicationData = {
								...values,
								graduationYear: values.graduationYear.toString()
							};

							axios
								.post('/api/users', applicationData)
								.then(() => {
									router.replace('/dashboard');
								})
								.catch((err: AxiosError) => {
									if (err.response) {
										console.log(err.response.data);
									}
								});
						}

						setSubmitted(true);
					})}>
					<fieldset disabled={disabled} style={{ border: 0 }}>
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
										<TextInput disabled={disabled} required label="First Name" {...form.getInputProps('firstName')} />
										<TextInput required label="Last Name" {...form.getInputProps('lastName')} />
										<TextInput required label="Email" placeholder="your@email.com" {...form.getInputProps('email')} />
										<NativeSelect
											required
											label="What is your age?"
											data={['Prefer not to answer', ...new Array(87).fill(null).map((_, i) => (i + 13).toString())]}
											{...form.getInputProps('age')}
										/>
										<NativeSelect
											required
											label="In which country do you currently reside?"
											data={countries}
											{...form.getInputProps('country')}
										/>
										<Group spacing={0}>
											<TextInput
												required
												label="What school do you currently attend? If you're no longer a student, what school/university did you most recently graduate from?"
												{...form.getInputProps('school')}
											/>
											<Text fz="xs">
												Don&apos;t use abbreviations -- please write the full name of the school / university. Enter &quot;None&quot;
												if you have never attended / graduated from a school/university.
											</Text>
										</Group>
										<NativeSelect
											required
											label="In what type of educational institution are you currently enrolled in?"
											data={levelsOfStudy}
											{...form.getInputProps('levelOfStudy')}
										/>
										<TextInput label="Phone Number" {...form.getInputProps('phoneNumber')} />
										<NativeSelect
											required
											label="Graduation Month"
											data={[
												'January',
												'February',
												'March',
												'April',
												'May',
												'June',
												'July',
												'August',
												'September',
												'October',
												'November',
												'December'
											]}
											{...form.getInputProps('graduationMonth')}
										/>
										<NumberInput required label="Graduation Year" {...form.getInputProps('graduationYear')} />
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
												setDietOptions([...dietOptions, query]);
												return query;
											}}
										/>
										<NativeSelect
											label="How many hackathons have you participated in?"
											{...form.getInputProps('hackathonCount')}
											data={['My first hackathon!', '1-3', '4-6', '7+']}
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
											getCreateLabel={(query) => `+ Add ${query}`}
											onCreate={(query) => {
												setOtherURLs([...form.values.otherSites, query]);
												return query;
											}}
											rightSection={null}
										/>
										<Switch label="I am looking for a team" {...form.getInputProps('lookingForTeam')} />
										<Switch
											label={
												<Group spacing={4}>
													<Text>I am interested in attending the PreHacks event</Text>
													<Tooltip
														label="PreHacks is a beginner-friendly workshop hosted by the PickHacks' development team to cover web design, app design, and other topics to better prepare you for PickHacks! If you've never been to a hackathon or want to pick up some new skills, PreHacks is the perfect opportunity for you!"
														multiline>
														<IconQuestionMark size={18} />
													</Tooltip>
												</Group>
											}
											{...form.getInputProps('attendingPrehacks')}
										/>
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
													<span style={{ color: 'red' }}>*</span> I authorize you to share my application/registration information
													with Major League Hacking for event administration, ranking, and MLH administration inline with the{' '}
													<a href="https://mlh.io/privacy" target="_blank" rel="noopener noreferrer">
														MLH Privacy Policy
													</a>
													. I further I agree to the terms of both the{' '}
													<a
														href="https://github.com/MLH/mlh-policies/blob/main/contest-terms.md"
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
											label="I authorize MLH to send me an email where I can further opt into the MLH Hacker, Events, or Organizer
												Newsletters and other communications from MLH"
											{...form.getInputProps('mlhAgreement')}
										/>

										<Group position="right" mt="md">
											<Button
												variant="default"
												disabled={submitted}
												onClick={() => {
													setStep(step - 1);
												}}>
												Back
											</Button>
											<Button type="submit" loading={submitted}>
												Submit
											</Button>
										</Group>
									</Stack>
								</Box>
							</Stepper.Step>
						</Stepper>
					</fieldset>
				</form>
			</Box>
		</div>
	);
};

export default withPageAuthRequired(Application, { returnTo: '/application' });

