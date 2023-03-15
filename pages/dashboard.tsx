import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { Button, Checkbox, CheckboxProps, Group, Space, Stack, Switch, Text, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import axios, { AxiosError } from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NextPage } from 'next/types';
import { FC, useEffect, useState } from 'react';
import { calculateRemainingTime } from '../utils/utils';

interface Applicant {
	firstName: string;
	lastName: string;
	email: string;
	userStatus: UserStatus;
	age: string;
	phoneNumber: string;
	country: string;
	school: string;
	levelOfStudy: string;
	graduationMonth: string;
	graduationYear: string;
	shirtSize: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
	dietRestrictions: string[];
	hackathonCount: string;
	resume: string | null;
	linkedin?: string;
	github?: string;
	otherSites: string[];
	attendingPrehacks: boolean;
	lookingForTeam: boolean;
	codeOfConductAgreement: boolean;
	dataAgreement: boolean;
	mlhAgreement: boolean;
}

function makeIcon(checked: boolean): CheckboxProps['icon'] {
	const CheckboxIcon: CheckboxProps['icon'] = ({ className }) => (checked ? <IconCheck className={className} /> : <IconX className={className} />);

	return CheckboxIcon;
}

const Status: FC<{ applicant: Applicant; onConfirm: () => void; confirming: boolean }> = ({ applicant, onConfirm, confirming }) => {
	return (
		<Stack spacing={6}>
			<Title order={2}>Your Pre-Hackathon Checklist:</Title>
			<Stack spacing={6} ml="lg">
				<Group maw={640} sx={{ justifyContent: 'space-between' }}>
					<Group>
						<Checkbox
							readOnly
							checked
							icon={makeIcon(applicant.userStatus !== 'Profile Pending')}
							color={applicant.userStatus !== 'Profile Pending' ? 'green' : 'red'}
						/>
						<Text>Profile Completed</Text>
					</Group>
					{applicant.userStatus === 'Profile Pending' && (
						<Text weight="bold">
							Complete your application in the <Link href="/application">application tab</Link>
						</Text>
					)}
				</Group>
				<Group>
					<Checkbox
						readOnly
						checked
						icon={makeIcon(applicant.userStatus !== 'Profile Pending' && applicant.userStatus !== 'Admission Pending')}
						color={applicant.userStatus !== 'Profile Pending' && applicant.userStatus !== 'Admission Pending' ? 'green' : 'red'}
					/>
					<Text>Admitted</Text>
				</Group>
				<Group maw={640} sx={{ justifyContent: 'space-between' }}>
					<Group>
						<Checkbox
							readOnly
							checked
							icon={makeIcon(applicant.userStatus === 'Confirmed' || applicant.userStatus === 'Checked In')}
							color={applicant.userStatus === 'Confirmed' || applicant.userStatus === 'Checked In' ? 'green' : 'red'}
						/>
						<Text>Confirmed</Text>
					</Group>
					{applicant.userStatus === 'Confirmation Pending' && (
						<Group>
							<Button compact loading={confirming} onClick={onConfirm}>
								I will attend!
							</Button>
							<Text weight="bold">Confirmation Deadline: {new Date(2023, 3, 9).toLocaleDateString()}</Text>
						</Group>
					)}
				</Group>
				<Group>
					<Checkbox
						readOnly
						checked
						icon={makeIcon(applicant.userStatus === 'Checked In')}
						color={applicant.userStatus === 'Checked In' ? 'green' : 'red'}
					/>
					<Text>Checked In</Text>
				</Group>
			</Stack>
		</Stack>
	);
};

const Dashboard: NextPage = () => {
	const { user, isLoading } = useUser();
	const router = useRouter();
	const [lft, setLFT] = useState<boolean>(true);
	const [[days, hours, minutes, seconds], setCountdown] = useState<[number, number, number, number]>(calculateRemainingTime());
	const smol = useMediaQuery('screen and (max-width: 1000px)');
	const [applicant, setApplicant] = useState<Applicant | null>(null);
	const [confirming, setConfirming] = useState<boolean>(false);

	useEffect(() => {
		if (!user && !isLoading) {
			router.replace('/api/auth/login');
		} else if (!isLoading) {
			axios.get('/api/me').then((res) => {
				setApplicant(res.data);
			});
		}
	}, [user, router, isLoading]);

	useEffect(() => {
		const interval = setInterval(() => {
			setCountdown(calculateRemainingTime());
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	}, []);

	if (!applicant) {
		return (
			<div>
				<Title>Loading...</Title>
			</div>
		);
	}

	if (applicant.userStatus === 'Denied') {
		return (
			<div>
				<Title color="red">Sorry, your application has been denied.</Title>
			</div>
		);
	}

	return (
		<div>
			<Title>
				Welcome, {applicant.firstName} {applicant.lastName}
			</Title>
			<Status
				applicant={applicant}
				onConfirm={() => {
					axios
						.post('/api/confirm')
						.then((res) => {
							setConfirming(false);
							setApplicant(res.data);
						})
						.catch((err: AxiosError) => {
							if (err.response) {
								console.log(err.response);
								notifications.show({ message: err.response.data as string, title: 'Something went wrong...', autoClose: 5000, color: 'red' });
							}

							setConfirming(false);
						});

					setConfirming(true);
				}}
				confirming={confirming}
			/>
			<Space h="lg" />
			<Title order={2}>Team Status</Title>
			<Group>
				<Switch onChange={(evt) => setLFT(evt.target.checked)} checked={lft} />
				{lft ? <Text>I am still looking for a team</Text> : <Text>I am no longer looking for a team</Text>}
			</Group>
			<Space h="lg" />
			{applicant.attendingPrehacks && <Title order={4}>Prehacks Date: April 6th</Title>}
			<Title order={4}>Hackathon Date: April 14th-16th</Title>
			{!smol ? (
				<Group spacing={4} align="end">
					<Title mb={16} mr={16}>
						T-minus
					</Title>
					<Title order={1} size={96}>
						{days}
					</Title>
					<Title order={2} mb={16}>
						d
					</Title>
					<Title order={1} size={48} mb={32} mx={8}>
						:
					</Title>
					<Title order={1} size={96}>
						{hours < 10 ? '0' + hours : hours}
					</Title>
					<Title order={2} mb={16}>
						h
					</Title>
					<Title order={1} size={48} mb={32} mx={8}>
						:
					</Title>
					<Title order={1} size={96}>
						{minutes < 10 ? '0' + minutes : minutes}
					</Title>
					<Title order={2} mb={16}>
						m
					</Title>
					<Title order={1} size={48} mb={32} mx={8}>
						:
					</Title>
					<Title order={1} size={96}>
						{seconds < 10 ? '0' + seconds : seconds}
					</Title>
					<Title order={2} mb={16}>
						s
					</Title>
				</Group>
			) : (
				<Group spacing={0} align="end">
					<Title>T-minus</Title>
					<Space w={16} />
					<Title>{days}</Title>
					<Text size="sm">d</Text>
					<Title>:{hours}</Title>
					<Text size="sm">h</Text>
					<Title>:{minutes}</Title>
					<Text size="sm">m</Text>
					<Title>:{seconds}</Title>
					<Text size="sm">s</Text>
				</Group>
			)}
		</div>
	);
};

export default withPageAuthRequired(Dashboard, { returnTo: '/dashboard' });

