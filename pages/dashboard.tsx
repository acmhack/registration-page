import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import {
  Anchor,
  Button,
  Checkbox,
  CheckboxProps,
  Group,
  Stack,
  Switch,
  Text,
  Title,
  Flex,
  MediaQuery,
  Image,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { NextPage } from "next/types";
import { FC, useCallback, useEffect, useState } from 'react';
import { calculateRemainingTime } from "../utils/utils";
import localFont from 'next/font/local';
import { Merriweather_Sans } from 'next/font/google';

const WelcomeFont = localFont({ src: './fonts/IntroScript.otf' });
const MerriweatherFont = Merriweather_Sans({ subsets: ['latin'], weight: ["300", "400", "700"] });

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
	const CheckboxIcon: CheckboxProps['icon'] = ({ className }) => (checked ? <IconCheck className={className}/> : <IconX className={className} />);

	return CheckboxIcon;
}

const Status: FC<{
	applicant: Applicant;
	onConfirm: () => void;
	confirming: boolean;
	smol: boolean;
}> = ({ applicant, onConfirm, confirming, smol }) => {
	return (
		<Stack
			px={25}
			py={35}
			justify="space-between"
			align="center"
			bg="rgba(12, 135, 70, .7)"
			style={{
				borderRadius: 45,
			}}>
			<Title order={2} inline align="center" color={'white'} weight={"bold"} fz={smol ? 22 : 31} mb={8} className={MerriweatherFont.className}>
				PickHacks Checklist
			</Title>
			<Group bg={applicant.userStatus !== 'Profile Pending' ? "rgba(12, 135, 70, .8)" : "#E84343"} style={{ borderRadius: 45 }} p={smol ? 15 : 22} w="100%" position="center">
				{/* <Checkbox
					readOnly
					checked
					icon={makeIcon(applicant.userStatus !== 'Profile Pending')}
					color={applicant.userStatus !== 'Profile Pending' ? 'green' : 'red'}
				/> */}
				{applicant.userStatus !== 'Profile Pending' && <Text color="white" weight={300} className={MerriweatherFont.className} fz={smol ? 15 : 18}>Profile Completed</Text>}
				{(applicant.userStatus === 'Profile Pending' &&
					<Link href="/application" style={{color: "white", fontWeight: 300, fontSize: (smol ? "15px" : "18px"), textAlign: "center"}} className={MerriweatherFont.className}>Complete your application</Link>
				)}
			</Group>
			<Group w="100%" bg={(applicant.userStatus !== 'Profile Pending' && applicant.userStatus !== 'Admission Pending') ? "rgba(12, 135, 70, .8)" : "#E84343"} style={{ borderRadius: 45 }} p={smol ? 15 : 22} position="center">
				{/* <Checkbox
					readOnly
					checked
					icon={makeIcon(applicant.userStatus !== 'Profile Pending' && applicant.userStatus !== 'Admission Pending')}
					color={applicant.userStatus !== 'Profile Pending' && applicant.userStatus !== 'Admission Pending' ? 'green' : 'red'}
				/> */}
				<Text color="white" weight={300} className={MerriweatherFont.className} fz={smol ? 15 : 18}>Admitted</Text>
			</Group>
			<Group w="100%" bg={(applicant.userStatus === 'Confirmed' || applicant.userStatus === 'Checked In') ? "rgba(12, 135, 70, .8)" : "#E84343"} style={{ borderRadius: 45}} p={smol ? 15 : 22} position="center">
				{/* <Checkbox
					readOnly
					checked
					icon={makeIcon(applicant.userStatus === 'Confirmed' || applicant.userStatus === 'Checked In')}
					color={applicant.userStatus === 'Confirmed' || applicant.userStatus === 'Checked In' ? 'green' : 'red'}
				/> */}
				{applicant.userStatus !== 'Confirmation Pending' && <Text color="white" weight={300} className={MerriweatherFont.className} fz={smol ? 15 : 18}>Confirmed</Text>}
				{applicant.userStatus === 'Confirmation Pending' && (
				<Group>
					<Button compact loading={confirming} onClick={onConfirm}>
						I will attend!
					</Button>
					<Text className={MerriweatherFont.className} fz={smol ? 15 : 18} color="white">Deadline: {new Date(2023, 3, 9).toLocaleDateString()}</Text>
				</Group>
				)}
			</Group>
			<Group w="100%" bg={(applicant.userStatus === 'Checked In') ? "rgba(12, 135, 70, .8)" : "#E84343"} style={{ borderRadius: 45}} p={smol ? 15 : 22} position="center">
				{/* <Checkbox
					readOnly
					checked
					icon={makeIcon(applicant.userStatus === 'Checked In')}
					color={applicant.userStatus === 'Checked In' ? 'green' : 'red'}
				/> */}
				<Text color="white" weight={300} className={MerriweatherFont.className} fz={smol ? 15 : 18}>Checked In</Text>
			</Group>
			<Text color="white" align="center" weight={300} className={MerriweatherFont.className} fz={smol ? 15 : 18}>
				For additional information, see the <Anchor href="https://pickhacks.io" color="#5C4E43" className={MerriweatherFont.className} weight={700} fz={smol ? 15 : 18}>main PickHacks page.</Anchor>{' '}
				Make sure to <Anchor href="https://discord.gg/K6uwZUcaff" color="#3254DC" className={MerriweatherFont.className} weight={700} fz={smol ? 15 : 18}>join our Discord</Anchor> to keep up with announcements!
			</Text>
		</Stack>
	);
};

const Dashboard: NextPage = () => {
	const { user, isLoading } = useUser();
	const router = useRouter();
	const [confirming, setConfirming] = useState<boolean>(false);
	const [lft, setLFT] = useState<boolean>(false);
	const [togglingLFT, setTogglingLFT] = useState<boolean>(false);
	const [[days, hours, minutes, seconds], setCountdown] = useState<[number, number, number, number]>(calculateRemainingTime());
	const [applicant, setApplicant] = useState<Applicant | null>(null);
	const smol = useMediaQuery("screen and (max-width: 700px)");

	const toggleLFT = useCallback(() => {
		setTogglingLFT(true);
		axios
			.post('/api/lft')
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
		if (!user && !isLoading) {
			router.replace('/api/auth/login');
		} else if (!isLoading) {
			axios.get<Applicant>('/api/me').then((res) => {
				setApplicant(res.data);
				setLFT(res.data.lookingForTeam);
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
			<Flex
			justify="center"
			align="center"
			direction="column"
			gap={40}
			style={{ height: "100%" }}
			>
				<Title>Loading...</Title>
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
    <MediaQuery query="(min-width: 701px)" styles={{ paddingLeft: "min(250px, 15vw)" }}>
		<Flex
			align="center"
			direction="column"
			style={{ height: "100%" }}
		>
			<Flex w="100%" bg="#E9FFF2" justify={"center"} p={10}>
				<Title size={smol ? 30 : 50} inline align="center" className={WelcomeFont.className} color="#0C8746" style={{filter: "drop-shadow(2px 3px rgba(12, 135, 70, .4))", fontWeight: "normal"}}>
					Welcome, {applicant.firstName} {applicant.lastName}!
				</Title>
			</Flex>
			<Flex wrap="wrap" gap={10} p={smol ? 10 : 30} h="100%" w="100%">
				<Flex direction="column" gap={30} style={{flex: 1, justifyContent: "space-evenly"}}>
					<Status
						applicant={applicant}
						onConfirm={() => {
							axios
							.post("/api/confirm")
							.then((res) => {
							setConfirming(false);
							setApplicant(res.data);
							})
							.catch((err: AxiosError) => {
								if (err.response) {
									console.log(err.response);
									notifications.show({
									message: err.response.data as string,
									title: "Something went wrong...",
									autoClose: 5000,
									color: "red",
									});
								}
								setConfirming(false);
							});
							setConfirming(true);
						}}
						confirming={confirming}
						smol={smol}
					/>
					<Flex
						direction="column"
						justify="center"
						align="center"
						gap={10}
						p={25}
						bg="rgba(12, 135, 70, .7)"
						style={{
							borderRadius: 45,
						}}>
						<Title order={2} align="center" inline color="white" weight={"bold"} fz={smol ? 22 : 31} mb={8} className={MerriweatherFont.className}>
							Team Status
						</Title>
						<Group position="center" noWrap>
							<Switch disabled={togglingLFT} onChange={toggleLFT} checked={lft} />
							<Text inline color="#004420" className={MerriweatherFont.className} weight={300} style={{ whiteSpace: 'nowrap' }}>
								Looking for a team
							</Text>
						</Group>
					</Flex>
				</Flex>

				<Flex direction="column" style={{flex: 1, justifyContent: "space-evenly"}}>
					{applicant.attendingPrehacks && <Title order={4}>Prehacks Date: April 6th</Title>}
					<Flex direction="column" align="center">
						<Title color="#0C8746" className={MerriweatherFont.className} weight="bold" align="center">PickHacks Calendar</Title>
						<Image src="/calendar.png" alt="Apr 14 - 16" my={10} style={{maxWidth: "350px", width: "20vw"}}/>
					</Flex>
					<Flex direction="column" align="center">
						<Title color="#0C8746" className={MerriweatherFont.className} weight="bold" align="center">PickHacks Countdown</Title>
						{!smol ? (
							<Flex style={{ color: "rgba(12, 135, 70, .7)", fontFamily: MerriweatherFont.style.fontFamily, fontWeight: 300 }} align="center">
								<Title size={36} ff="inherit" fw="inherit">{days}</Title>
								<Title order={2}  ff="inherit" fw="inherit">
									d
								</Title>
								<Title size={36} mx={8} ff="inherit" fw="inherit">
									:
								</Title>
								<Title size={36} ff="inherit" fw="inherit">{hours < 10 ? '0' + hours : hours}</Title>
								<Title order={2}  ff="inherit" fw="inherit">
									h
								</Title>
								<Title size={36} mx={8} ff="inherit" fw="inherit">
									:
								</Title>
								<Title size={36} ff="inherit" fw="inherit">{minutes < 10 ? '0' + minutes : minutes}</Title>
								<Title order={2} ff="inherit" fw="inherit">
									m
								</Title>
								<Title size={36} mx={8} ff="inherit" fw="inherit">
									:
								</Title>
								<Title size={36} ff="inherit" fw="inherit">{seconds < 10 ? '0' + seconds : seconds}</Title>
								<Title order={2} ff="inherit" fw="inherit">
									s
								</Title>
							</Flex>
						) : (
							<Flex style={{ color: "rgba(12, 135, 70, .7)", fontFamily: MerriweatherFont.style.fontFamily, fontWeight: 300 }}>
								<Title ff="inherit" fw="inherit">{days}</Title>
								<Title size="sm" mb={5} style={{ alignSelf: 'flex-end' }} ff="inherit" fw="inherit">
									d
								</Title>
								<Title mx={5} ff="inherit" fw="inherit">:</Title>
								<Title ff="inherit" fw="inherit">{hours}</Title>
								<Title size="sm" mb={5} style={{ alignSelf: 'flex-end' }} ff="inherit" fw="inherit">
									h
								</Title>
								<Title mx={5} ff="inherit" fw="inherit">:</Title>
								<Title ff="inherit" fw="inherit">{minutes}</Title>
								<Title size="sm" mb={5} style={{ alignSelf: 'flex-end' }} ff="inherit" fw="inherit">
									m
								</Title>
								<Title mx={5} ff="inherit" fw="inherit">:</Title>
								<Title ff="inherit" fw="inherit">{seconds}</Title>
								<Title size="sm" mb={5} style={{ alignSelf: 'flex-end' }} ff="inherit" fw="inherit">
									s
								</Title>
							</Flex>
						)}
					</Flex>
				</Flex >
				<Flex direction="column" style={{flex: 1}}>
					<Flex
						direction="column"
						justify="center"
						align="center"
						gap={10}
						px={25}
						py={20}
						style={{
							backgroundColor: 'rgba(20, 134, 72, .2)',
							borderRadius: 15
						}}>
						<Title order={2} align="center" color="#148648" inline>
							PickHacks Date &amp; Location:
						</Title>
						<Title order={2} align="center" inline>
							April 14th-16th, Gale-Bullman Hall
						</Title>
						<Title order={3} align="center" inline>
							705 W 10th St, Rolla, MO 65409
						</Title>
					</Flex>
				</Flex>
			</Flex>
		</Flex>
	</MediaQuery>
	);
};

export default withPageAuthRequired(Dashboard, { returnTo: '/dashboard' });

