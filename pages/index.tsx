import { Autocomplete, Box, Button, Checkbox, FileInput, Group, Input, MultiSelect, NativeSelect, Stack, Stepper, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NextPage } from 'next/types';
import { useEffect, useState } from 'react';
import { http } from '../utils/utils';

interface FormValues {
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
	age: string;
	graduationMonth: string;
	graduationYear: string;
	country: string;
	shirtSize: '' | 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
	dietRestrictions: string[];
	school: string;
	levelOfStudy: string;
	resume: File | string | null;
	// attendingPrehacks: boolean;
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
	'',
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

const schools: string[] = [
	'',
	'College of the Ozarks',
	'Missouri S&T',
	'Missouri State University',
	'Mizzou',
	'Southeast Missouri State University',
	'St. Louis University',
	'Truman State University',
	'University of Illinois Urbana-Champaign',
	'University of Missouri–St. Louis',
	'Washington University in St. Louis',
	'None'
];

const Application: NextPage = () => {
	const form = useForm<FormValues>({
		initialValues: {
			firstName: '',
			lastName: '',
			email: '',
			age: '',
			phoneNumber: '',
			country: 'United States',
			school: '',
			levelOfStudy: '',
			graduationYear: '',
			graduationMonth: '',
			shirtSize: '',
			resume: null,
			dietRestrictions: [],
			// attendingPrehacks: false,
			codeOfConductAgreement: false,
			dataAgreement: false,
			mlhAgreement: false
		},
		validate: {
			firstName: (value) => (value === '' ? 'Please enter your first name' : null),
			lastName: (value) => (value === '' ? 'Please enter your last name' : null),
			email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
			age: (value) => (/^\d{1,2}$/.test(value) ? null : 'Invalid age'),
			phoneNumber: (value) => (/^\d{10}$/.test(value) ? null : 'Invalid phone number (must be in format xxxyyyzzzz)'),
			shirtSize: (value) => (value === '' ? 'Please select a shirt size' : null),
			graduationYear: (value) => (step < 2 ? null : /^\d{4}$/.test(value.toString()) ? null : 'Invalid graduation year'),
			graduationMonth: (value) => (step < 2 ? null : value === '' ? 'Please select a graduation month' : null),
			school: (value) => (step < 2 ? null : value === '' ? 'Please enter your school' : null)
		}
	});
	const [dietOptions, setDietOptions] = useState<string[]>(['Vegetarian', 'Vegan', 'Gluten Free', 'Nut Allergy', 'Kosher', 'Halal']);
	const [step, setStep] = useState<number>(0);
	const [submitted, setSubmitted] = useState<boolean>(false);
	const [disabled, setDisabled] = useState<boolean>(false);
	const [openOther, setOpenOther] = useState<boolean>(false);
	const [school, setSchool] = useState<string>('');

	const router = useRouter();

	useEffect(() => {
		if (Cookies.get('ph-registration::id') !== undefined) {
			http.get<ApplicationData>('/api/me').then((res) => {
				const user = res.data;

				form.setValues({ ...user, graduationYear: user.graduationYear });
			});
		}
	}, [router, form]);

	return (
		<div>
			<Group sx={{ position: 'absolute' }} top={25} left={25}>
				<img src='/Logo2024.png' height={35} width={35}></img>
				<Text
					weight={'bold'}
					sx={{
						background: 'linear-gradient(45deg, #fc77d9 0%, #a369f5 40%, #544bd6 65%, #5c52e0 92%)',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
						fontSize: '1.3em'
					}}
				>
					PickHacks 2024
				</Text>
			</Group>
			<Box sx={{ maxWidth: 1200 }} mx='auto' p={16} pt={90}>
				<form
					onSubmit={form.onSubmit((values) => {
						const id: string = 'submitting-notification';
						let expired: boolean = false;

						if (values.resume) {
							if (typeof values.resume === 'string' || form.values.resume === null) {
								const applicationData = {
									...values,
									graduationYear: values.graduationYear.toString()
								};

								http.post('/api/users', applicationData)
									.then(() => {
										router.replace('/success');

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
							} else {
								const data = new FormData();
								data.append('resume', form.values.resume!);
								http.post<{ url: string }>('/api/resume', data).then((res) => {
									const resumeURL = res.data.url;

									const applicationData = {
										...values,
										graduationYear: values.graduationYear,
										resume: resumeURL
									};

									http.post('/api/users', applicationData)
										.then(() => {
											router.replace('/success');

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
								});
							}
						} else {
							const applicationData = {
								...values,
								graduationYear: values.graduationYear.toString()
							};

							http.post('/api/users', applicationData)
								.then(() => {
									router.replace('/success');

									if (!expired) {
										notifications.hide(id);
									}
								})
								.catch((err: AxiosError) => {
									if (err.response) {
										notifications.show({
											message: err.response.data as string,
											title: 'Something went wrong...',
											autoClose: 5000,
											color: 'red'
										});

										if (!expired) {
											notifications.hide(id);
										}
										setSubmitted(false);
									}
								});
						}

						notifications.show({
							id,
							title: 'Submitting application...',
							message: '',
							loading: true,
							color: 'green',
							autoClose: 5000,
							onClose: () => (expired = true)
						});
						setSubmitted(true);
					})}
				>
					<fieldset disabled={disabled} style={{ border: 0 }}>
						<Stepper
							active={step}
							onStepClick={(step: number) => {
								if (!form.validate().hasErrors) {
									setStep(step);
								}
							}}
						>
							<Stepper.Step label='Contact Info'>
								<Box sx={{ maxWidth: 700, marginTop: '3%' }} mx='auto'>
									<Stack sx={{ gap: '1.5em' }}>
										<Group grow={true}>
											<TextInput disabled={disabled} required label='First Name' {...form.getInputProps('firstName')} />
											<TextInput required label='Last Name' {...form.getInputProps('lastName')} />
										</Group>
										<Group grow={true}>
											<TextInput required label='Email' placeholder='your@email.com' {...form.getInputProps('email')} />
											<TextInput
												maxLength={10}
												required
												label='Phone Number'
												placeholder='1234567890'
												{...form.getInputProps('phoneNumber')}
											/>
										</Group>

										<NativeSelect
											required
											label='What is your age?'
											data={['', ...new Array(87).fill(null).map((_, i) => (i + 13).toString())]}
											{...form.getInputProps('age')}
										/>
										<NativeSelect
											required
											label='In which country do you currently reside?'
											data={countries}
											{...form.getInputProps('country')}
										/>
										<Group grow={true}>
											<NativeSelect
												required
												label='T-Shirt Size'
												{...form.getInputProps('shirtSize')}
												data={['', 'XS', 'S', 'M', 'L', 'XL', 'XXL']}
											/>
											<MultiSelect
												label='Dietary Restrictions'
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
										</Group>
										<Group position='right' mt='md'>
											<Button
												onClick={() => {
													if (!form.validate().hasErrors) {
														setStep(step + 1);
													}
												}}
											>
												Next
											</Button>
										</Group>
									</Stack>
								</Box>
							</Stepper.Step>
							<Stepper.Step label='Education'>
								<Box sx={{ maxWidth: 700, marginTop: '2%' }} mx='auto'>
									<Stack>
										{/* <Switch
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
										/> */}
										<NativeSelect
											required
											label='In what type of educational institution are you currently enrolled?'
											data={levelsOfStudy}
											{...form.getInputProps('levelOfStudy')}
										/>
										<Group spacing={0}>
											<Autocomplete
												required
												data={schools}
												limit={15}
												maxDropdownHeight={300}
												label="What school do you currently attend? If you're no longer a student, what school/university did you most recently graduate from? If your school isn't listed, please type it out."
												{...form.getInputProps('school')}
											/>
											<Text fz='xs' color='white'>
												Don&apos;t use abbreviations -- please write the full name of the school / university. Enter &quot;None&quot;
												if you have never attended / graduated from a school/university.
											</Text>
										</Group>
										<Group grow>
											<NativeSelect
												required
												label='Graduation Month'
												data={[
													'',
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
											<NativeSelect
												required
												label='Graduation Year'
												{...form.getInputProps('graduationYear')}
												data={['', ...new Array(5).fill(null).map((_, i) => (i + new Date().getFullYear()).toString())]}
											/>
										</Group>

										{/* TODO: FileInput has a Capture prop has type boolean | "user" | "environment"
										Add after we know hosting server and resume site api */}
										{typeof form.values.resume === 'string' ? (
											<>
												<Input.Label>Resume</Input.Label>
												<Group>
													<Link href={form.values.resume} target='_blank' rel='noopener noreferrer'>
														<Text style={{ color: '#148648', fontWeight: 'bold' }}>View</Text>
													</Link>
													<Button onClick={() => form.setFieldValue('resume', null)}>Replace</Button>
												</Group>
											</>
										) : (
											<FileInput
												label='Upload your resume. PDF only!'
												description='Resume is optional, but highly encouraged for your application.'
												{...form.getInputProps('resume')}
												placeholder='Click here to submit your resume'
												accept='application/pdf'
												descriptionProps={{
													style: { color: 'white' }
												}}
											/>
										)}

										<Checkbox
											required
											label={
												<>
													<span style={{ color: 'red' }}>*</span> I have read and agree to the{' '}
													<a href='https://static.mlh.io/docs/mlh-code-of-conduct.pdf' target='_blank' rel='noopener noreferrer'>
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
													<a href='https://mlh.io/privacy' target='_blank' rel='noopener noreferrer'>
														MLH Privacy Policy
													</a>
													. I further I agree to the terms of both the{' '}
													<a
														href='https://github.com/MLH/mlh-policies/blob/main/contest-terms.md'
														target='_blank'
														rel='noopener noreferrer'
													>
														MLH Contest Terms and Conditions
													</a>{' '}
													and the{' '}
													<a href='https://mlh.io/privacy' target='_blank' rel='noopener noreferrer'>
														MLH Privacy Policy.
													</a>
												</>
											}
											{...form.getInputProps('dataAgreement')}
										/>
										<Checkbox
											label='I authorize MLH to send me an email where I can further opt into the MLH Hacker, Events, or Organizer
												Newsletters and other communications from MLH'
											{...form.getInputProps('mlhAgreement')}
										/>

										<Group position='right' mt='md'>
											<Button
												variant='default'
												disabled={submitted}
												onClick={() => {
													setStep(step - 1);
												}}
											>
												Back
											</Button>
											<Button type='submit' loading={submitted}>
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

export default Application;
