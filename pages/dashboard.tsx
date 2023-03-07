import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { Checkbox, CheckboxProps, Group, Space, Stack, Switch, Text, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconCheck, IconX } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NextPage } from 'next/types';
import { FC, useEffect, useState } from 'react';
import { calculateRemainingTime } from '../utils/utils';

interface Applicant {
	profile: {
		adult: boolean;
		codeAgreement: boolean;
		dataAgreement: boolean;
		name: string;
		phone: string;
		school: string;
		graduationYear: string;
		major: string;
		participationCount: 'N' | 'S' | 'M' | 'L';
		diet: string;
		resume: boolean;
		travel: 'F';
		attendingPrehacks: boolean;
	};
	confirmation: {
		dietaryRestrictions: string[];
		signaturePhotoRelease: string;
		dateSig: string;
	};
	status: {
		completedProfile: boolean;
		admitted: boolean;
		confirmed: boolean;
		declined: boolean;
		checkedIn: boolean;
		reimbursementGiven: boolean;
		admittedBy: string;
		confirmBy: number;
		rejected: boolean;
		checkInTime: number;
	};
	admin: boolean;
	timestamp: number;
	lastUpdated: number;
	verified: boolean;
	email: string;
	resume: string;
	teamCode: string | null;
}

function makeIcon(checked: boolean): CheckboxProps['icon'] {
	const CheckboxIcon: CheckboxProps['icon'] = ({ className }) => (checked ? <IconCheck className={className} /> : <IconX className={className} />);

	return CheckboxIcon;
}

const Status: FC<{ applicant: Applicant }> = ({ applicant }) => {
	return (
		<Stack spacing={6}>
			<Title order={2}>Your Pre-Hackathon Checklist:</Title>
			<Stack spacing={6} ml="lg">
				<Group maw="40%" sx={{ justifyContent: 'space-between' }}>
					<Group>
						<Checkbox
							readOnly
							checked
							icon={makeIcon(applicant.status.completedProfile)}
							color={applicant.status.completedProfile ? 'green' : 'red'}
						/>
						<Text>Profile Completed</Text>
					</Group>
					{!applicant.status.completedProfile && (
						<Text weight="bold">
							Complete your application in the <Link href="/application">application tab</Link>
						</Text>
					)}
				</Group>
				<Group>
					<Checkbox readOnly checked icon={makeIcon(applicant.status.admitted)} color={applicant.status.admitted ? 'green' : 'red'} />
					<Text>Admitted</Text>
				</Group>
				<Group maw="40%" sx={{ justifyContent: 'space-between' }}>
					<Group>
						<Checkbox readOnly checked icon={makeIcon(applicant.status.confirmed)} color={applicant.status.confirmed ? 'green' : 'red'} />
						<Text>Confirmed</Text>
					</Group>
					{applicant.status.admitted && !applicant.status.confirmed && (
						<Text weight="bold">Confirmation Deadline: {new Date(applicant.status.confirmBy).toLocaleDateString()}</Text>
					)}
				</Group>
				<Group>
					<Checkbox readOnly checked icon={makeIcon(applicant.status.checkedIn)} color={applicant.status.checkedIn ? 'green' : 'red'} />
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
	const [applicant, setApplicant] = useState<Applicant>({
		profile: {
			adult: true,
			codeAgreement: true,
			dataAgreement: true,
			name: 'Christopher Gu',
			phone: '6366750378',
			school: 'Missouri University of Science and Technology',
			graduationYear: '2020',
			major: 'Computer Science',
			participationCount: 'L',
			diet: 'N',
			resume: true,
			travel: 'F',
			attendingPrehacks: true
		},
		confirmation: {
			dietaryRestrictions: [] as string[],
			signaturePhotoRelease: 'Alan',
			dateSig: '01/31/2020'
		},
		status: {
			completedProfile: true,
			admitted: true,
			confirmed: false,
			declined: false,
			checkedIn: false,
			reimbursementGiven: false,
			admittedBy: 'msthackathon@umsystem.edu',
			confirmBy: 1.58286954e12,
			rejected: false,
			checkInTime: 1.580878859514e12
		},
		admin: true,
		timestamp: 1.570421527505e12,
		lastUpdated: 1.580751936035e12,
		verified: true,
		email: 'msthackathon@umsystem.edu',
		resume: '',
		teamCode: null
	});

	useEffect(() => {
		if (!user && !isLoading) {
			router.replace('/api/auth/login');
		} else if (!isLoading) {
			console.log(user);
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

	return (
		<div>
			<Title>Welcome, {applicant.profile.name}</Title>
			<Status applicant={applicant} />
			<Space h="lg" />
			<Title order={2}>Team Status</Title>
			<Group>
				<Switch onChange={(evt) => setLFT(evt.target.checked)} checked={lft} />
				{lft ? <Text>I am still looking for a team</Text> : <Text>I am no longer looking for a team</Text>}
			</Group>
			<Space h="lg" />
			{applicant.profile.attendingPrehacks && <Title order={4}>Prehacks Date: April 5-8</Title>}
			<Title order={4}>Hackathon Date: April 9-11</Title>
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

