import { Anchor, Button, Flex, Group, Image, MediaQuery, Stack, Switch, Text, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { Merriweather_Sans } from 'next/font/google';
import localFont from 'next/font/local';
import { useRouter } from 'next/router';
import { NextPage } from 'next/types';
import { FC, useCallback, useEffect, useState } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { calculateRemainingTime, http } from '../utils/utils';

const WelcomeFont = localFont({ src: './fonts/IntroScript.otf' });
const MerriweatherFont = Merriweather_Sans({ subsets: ['latin'], weight: ['300', '400', '700'] });

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

const Status: FC<{
	applicant: Applicant;
	onConfirm: () => void;
	confirming: boolean;
	smol: boolean;
}> = ({ applicant, onConfirm, confirming, smol }) => {
	return (
		<Stack justify="space-between" align="center" w={302}>
			<Title order={2} inline align="center" color={'white'} weight={'bold'} fz={smol ? 22 : 31} mb={8} className={MerriweatherFont.className}>
				PickHacks Checklist
			</Title>
			<Group bg={'rgba(12, 135, 70, .8)'} style={{ borderRadius: 45 }} p={smol ? 15 : 22} w="100%" position="center">
				{applicant.userStatus === 'Admission Pending' && (
					<Text color="white" weight="bold" className={MerriweatherFont.className} fz={smol ? 15 : 18}>
						Profile Completed
					</Text>
				)}
			</Group>
			<Group
				w="100%"
				bg={applicant.userStatus !== 'Admission Pending' ? 'rgba(12, 135, 70, .8)' : 'rgba(27, 90, 127, .4)'}
				style={{ borderRadius: 45 }}
				p={smol ? 15 : 22}
				position="center">
				<Text color="white" weight={'bold'} className={MerriweatherFont.className} fz={smol ? 15 : 18}>
					Admitted
				</Text>
			</Group>
			<Group
				w="100%"
				bg={applicant.userStatus === 'Confirmed' || applicant.userStatus === 'Checked In' ? 'rgba(12, 135, 70, .8)' : 'rgba(27, 90, 127, .4)'}
				style={{ borderRadius: 45 }}
				p={smol ? 15 : 22}
				position="center">
				{applicant.userStatus !== 'Confirmation Pending' && (
					<Text color="white" weight={'bold'} className={MerriweatherFont.className} fz={smol ? 15 : 18}>
						Confirmed
					</Text>
				)}
				{applicant.userStatus === 'Confirmation Pending' && (
					<Group>
						<Button compact loading={confirming} onClick={onConfirm}>
							I will attend!
						</Button>
					</Group>
				)}
			</Group>
			<Group
				w="100%"
				bg={applicant.userStatus === 'Checked In' ? 'rgba(12, 135, 70, .8)' : 'rgba(27, 90, 127, .4)'}
				style={{ borderRadius: 45 }}
				p={smol ? 15 : 22}
				position="center">
				<Text color="white" weight={'bold'} className={MerriweatherFont.className} fz={smol ? 15 : 18}>
					Checked In
				</Text>
			</Group>
		</Stack>
	);
};

const Dashboard: NextPage = () => {
	const router = useRouter();
	const [confirming, setConfirming] = useState<boolean>(false);
	const [lft, setLFT] = useState<boolean>(false);
	const [togglingLFT, setTogglingLFT] = useState<boolean>(false);
	const [[days, hours, minutes, seconds], setCountdown] = useState<[number, number, number, number]>(calculateRemainingTime());
	const [applicant, setApplicant] = useState<Applicant | null>(null);
	const smol = useMediaQuery('screen and (max-width: 700px)');

	const toggleLFT = useCallback(() => {
		setTogglingLFT(true);
		http.post('/api/lft')
			.then(() => {
				setLFT((lft) => !lft);
			})
			.catch((err: AxiosError) => {
				if (err.response) {
					console.log(err.response);
					notifications.show({ message: err.response.data as string, title: 'Something went wrong...', autoClose: 5000, color: 'red' });
				}
			})
			.finally(() => {
				setTogglingLFT(false);
			});
	}, []);

	useEffect(() => {
		if (Cookies.get('ph-registration::id') === undefined) {
			router.replace('/api/auth/login');
		} else {
			http.get<Applicant>('/api/me').then((res) => {
				setApplicant(res.data);
				setLFT(res.data.lookingForTeam);
			});
		}
	}, [router]);

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
			<Flex justify="center" align="center" direction="column" gap={40} style={{ height: '100%' }}>
				<Title color="white">Loading...</Title>
			</Flex>
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
		<MediaQuery query="(min-width: 701px)" styles={{ paddingLeft: 'min(200px, 15vw)' }}>
			<Flex align="center" direction="column" style={{ height: '100%' }}>
				<Flex w="100%" bg="rgba(32, 191, 177, .1)" justify={'center'} px={15} py={25}>
					<Title
						size={smol ? 40 : 60}
						inline
						align="center"
						className={WelcomeFont.className}
						color="#0C8746"
						style={{ filter: 'drop-shadow(2px 3px rgba(12, 135, 70, .4))', fontWeight: 'normal' }}>
						Welcome, {applicant.firstName} {applicant.lastName}!
					</Title>
				</Flex>
				<Flex wrap="wrap" gap={smol ? 30 : 10} px={smol ? 10 : 30} h="100%" w="100%" my={'auto'} py={10} align="center" justify="center">
					<Flex
						direction="column"
						gap={smol ? 30 : 50}
						align="center"
						style={{ flex: 1, justifyContent: 'space-between', borderRadius: 45 }}
						bg="rgba(12, 135, 70, .7)"
						w={'100%'}
						maw={600}
						miw={350}
						h={smol ? 500 : 700}
						px={25}
						py={smol ? 35 : 55}>
						<Status
							applicant={applicant}
							onConfirm={() => {
								http.post('/api/confirm')
									.then((res) => {
										setConfirming(false);
										setApplicant(res.data);
									})
									.catch((err: AxiosError) => {
										if (err.response) {
											console.log(err.response);
											notifications.show({
												message: err.response.data as string,
												title: 'Something went wrong...',
												autoClose: 5000,
												color: 'red'
											});
										}
										setConfirming(false);
									});
								setConfirming(true);
							}}
							confirming={confirming}
							smol={smol}
						/>

						<Stack justify="space-between" align="center" w={302}>
							<Title
								order={2}
								align="center"
								inline
								color="white"
								weight="bold"
								ff={MerriweatherFont.style.fontFamily}
								fz={smol ? 22 : 31}
								px={30}>
								Team Status
							</Title>
							<Group position="center" noWrap bg="rgba(12, 135, 70, .8)" w={302} p={smol ? 15 : 22} align="center" style={{ borderRadius: 45 }}>
								<Switch disabled={togglingLFT} onChange={toggleLFT} checked={lft} color={'cyan.9'} />
								<Text
									color="white"
									className={MerriweatherFont.className}
									weight={'bold'}
									style={{ whiteSpace: 'nowrap' }}
									fz={smol ? 15 : 18}>
									Looking for a team
								</Text>
							</Group>
						</Stack>
					</Flex>

					<Flex direction="column" style={{ flex: 1 }} gap={20} maw={600} h={smol ? 650 : 700} miw={350} justify="space-between" align="center">
						<Title color="#0C8746" className={MerriweatherFont.className} weight="bold" align="center">
							PickHacks Countdown
						</Title>
						<Image src="/calendar.png" alt="Apr 14 - 16" my={10} style={{ minWidth: '225px', maxWidth: '300px', width: '18vw' }} />
						<CountdownCircleTimer
							isPlaying
							duration={(new Date(2023, 3, 14, 16).valueOf() - new Date(2023, 2, 20, 16).valueOf()) / 1000}
							initialRemainingTime={(new Date(2023, 3, 14, 16).valueOf() - Date.now()) / 1000}
							colors={['#004420', '#004420']}
							colorsTime={[(new Date(2023, 3, 14, 16).valueOf() - new Date(2023, 2, 20, 16).valueOf()) / 1000, 0]}
							strokeLinecap="butt"
							trailColor="#0C8746"
							strokeWidth={30}
						/>
						{!smol ? (
							<Flex style={{ color: 'rgba(12, 135, 70, .7)', fontFamily: MerriweatherFont.style.fontFamily, fontWeight: 'bold' }} align="center">
								<Title size={45} ff="inherit" fw="bold">
									{days}
								</Title>
								<Title order={2} mt={10} ff="inherit" fw="inherit">
									d
								</Title>
								<Title size={45} mx={5} ff="inherit" fw="inherit">
									:
								</Title>
								<Title size={45} ff="inherit" fw="bold">
									{hours < 10 ? '0' + hours : hours}
								</Title>
								<Title order={2} mt={10} ff="inherit" fw="inherit">
									h
								</Title>
								<Title size={45} mx={5} ff="inherit" fw="inherit">
									:
								</Title>
								<Title size={45} ff="inherit" fw="bold">
									{minutes < 10 ? '0' + minutes : minutes}
								</Title>
								<Title order={2} mt={10} ff="inherit" fw="inherit">
									m
								</Title>
								<Title size={45} mx={5} ff="inherit" fw="inherit">
									:
								</Title>
								<Title size={45} ff="inherit" fw="bold">
									{seconds < 10 ? '0' + seconds : seconds}
								</Title>
								<Title order={2} mt={10} ff="inherit" fw="inherit">
									s
								</Title>
							</Flex>
						) : (
							<Flex style={{ color: 'rgba(12, 135, 70, .7)', fontFamily: MerriweatherFont.style.fontFamily, fontWeight: 'bold' }}>
								<Title ff="inherit" fw="bold">
									{days}
								</Title>
								<Title size="sm" mb={5} style={{ alignSelf: 'flex-end' }} ff="inherit" fw="inherit">
									d
								</Title>
								<Title mx={5} ff="inherit" fw="inherit">
									:
								</Title>
								<Title ff="inherit" fw="bold">
									{hours}
								</Title>
								<Title size="sm" mb={5} style={{ alignSelf: 'flex-end' }} ff="inherit" fw="inherit">
									h
								</Title>
								<Title mx={5} ff="inherit" fw="inherit">
									:
								</Title>
								<Title ff="inherit" fw="bold">
									{minutes}
								</Title>
								<Title size="sm" mb={5} style={{ alignSelf: 'flex-end' }} ff="inherit" fw="inherit">
									m
								</Title>
								<Title mx={5} ff="inherit" fw="inherit">
									:
								</Title>
								<Title ff="inherit" fw="bold">
									{seconds}
								</Title>
								<Title size="sm" mb={5} style={{ alignSelf: 'flex-end' }} ff="inherit" fw="inherit">
									s
								</Title>
							</Flex>
						)}
					</Flex>
					<Flex
						direction="column"
						justify="space-between"
						align="center"
						px={25}
						py={smol ? 35 : 55}
						bg="rgba(12, 135, 70, .7)"
						w={'100%'}
						maw={600}
						h={smol ? 500 : 700}
						miw={350}
						style={{ flex: 1, borderRadius: 45 }}
						gap={10}>
						<Stack justify="space-between" align="center" w={302}>
							<Title
								order={2}
								inline
								align="center"
								color={'white'}
								weight={'bold'}
								fz={smol ? 22 : 31}
								mb={8}
								className={MerriweatherFont.className}>
								PickHacks Links
							</Title>
							<Anchor
								href="https://goo.gl/maps/KgLMuRjvQqJCcHjU6"
								target="_blank"
								w={'100%'}
								bg="rgba(12, 135, 70, .8)"
								p={smol ? 15 : 22}
								style={{ borderRadius: 45 }}>
								<Text color="white" weight={'bold'} className={MerriweatherFont.className} fz={smol ? 15 : 18} align="center">
									PickHacks Location
								</Text>
							</Anchor>
							<Anchor
								href="https://pickhacks.io"
								target="_blank"
								w={'100%'}
								bg="rgba(12, 135, 70, .8)"
								p={smol ? 15 : 22}
								style={{ borderRadius: 45 }}>
								<Text color="white" weight={'bold'} className={MerriweatherFont.className} fz={smol ? 15 : 18} align="center">
									PickHacks Website
								</Text>
							</Anchor>
							<Anchor
								href="https://linktr.ee/pickhacks"
								target="_blank"
								w={'100%'}
								bg="rgba(12, 135, 70, .8)"
								p={smol ? 15 : 22}
								style={{ borderRadius: 45 }}>
								<Text color="white" weight={'bold'} className={MerriweatherFont.className} fz={smol ? 15 : 18} align="center">
									PickHacks Socials
								</Text>
							</Anchor>
							<Anchor
								href="https://discord.gg/K6uwZUcaff"
								target="_blank"
								w={'100%'}
								bg="rgba(12, 135, 70, .8)"
								p={smol ? 15 : 22}
								style={{ borderRadius: 45 }}>
								<Text color="white" weight={'bold'} className={MerriweatherFont.className} fz={smol ? 15 : 18} align="center">
									PickHacks Discord
								</Text>
							</Anchor>
						</Stack>
						<Stack justify="space-between" align="center" w={302}>
							<Title
								order={2}
								align="center"
								inline
								color="white"
								weight="bold"
								ff={MerriweatherFont.style.fontFamily}
								fz={smol ? 22 : 31}
								px={30}>
								PreHacks Info
							</Title>
							<Group position="center" noWrap bg="rgba(12, 135, 70, .8)" w={302} p={smol ? 15 : 22} align="center" style={{ borderRadius: 45 }}>
								<Text
									color="white"
									className={MerriweatherFont.className}
									weight={'bold'}
									style={{ whiteSpace: 'nowrap' }}
									fz={smol ? 15 : 18}>
									Date and time TBA
								</Text>
							</Group>
						</Stack>
					</Flex>
				</Flex>
			</Flex>
		</MediaQuery>
	);
};

export default Dashboard;

