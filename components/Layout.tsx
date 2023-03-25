import { useUser } from '@auth0/nextjs-auth0/client';
import { AppShell, Burger, CSSObject, Header, Image, Navbar, Space, Text } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import axios from 'axios';
import { Merriweather_Sans } from 'next/font/google';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const MerriweatherFont = Merriweather_Sans({ subsets: ['latin'], weight: ['300', '400', '700'] });

const NAV_LINK_STYLE: CSSObject = {
	// borderTop: '2px solid rgba(210, 80, 110, 0.5)',
	borderTop: '2px solid rgba(43, 165, 104, 0.5)',
	cursor: 'pointer',
	position: 'relative',

	'@media screen and (max-width: 800px)': {
		fontSize: '0.8rem'
	},

	'&:hover': {
		background: 'rgba(23, 145, 84, 0.7)'
	},

	'&:last-child': {
		borderBottom: '2px solid rgba(43, 165, 104, 0.5)'
	},

	'&.active:before': {
		content: '""',
		position: 'absolute',
		top: 0,
		left: 0,
		height: '100%',
		borderLeft: '8px solid #00673a',

		'@media screen and (max-width: 400px)': {
			borderLeft: '4px solid #00673a'
		}
	},

	'& a': {
		color: 'white',
		textDecoration: 'none',
		padding: '0.75rem 1.5rem',
		display: 'block',

		'@media screen and (max-width: 600px)': {
			paddingLeft: '0.8rem'
		}
	}
};

const Layout: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
	const [opened, { toggle }] = useDisclosure(false);
	const mobile = useMediaQuery('screen and (max-width: 700px)');
	const router = useRouter();
	const [admin, setAdmin] = useState<boolean>(false);
	const { user } = useUser();

	useEffect(() => {
		if (user) {
			axios.get<DBEntry>(`/api/users/${user.sub}`).then((res) => {
				setAdmin(res.data.admin);
			});
		}
	}, [user]);

	return (
		<>
			<Notifications position="top-right" />
			<ModalsProvider>
				<AppShell
					padding={0}
					navbar={
						mobile ? (
							<>
								{opened && (
									<Navbar bg="#0d874a" style={{ color: 'white', width: '100vw', border: 'none' }}>
										<Link href="/">
											<Image src="/logo-small.png" alt="Logo" mx="auto" my="lg" style={{ maxWidth: '100px', width: '20vw' }} />
										</Link>
										<Space h="2vh" />
										<Navbar.Section className={router.route === '/dashboard' ? 'active' : ''} sx={NAV_LINK_STYLE}>
											<Link href="/dashboard" onClick={toggle} className={MerriweatherFont.className} style={{ fontWeight: 'bold' }}>
												Dashboard
											</Link>
										</Navbar.Section>
										<Navbar.Section className={router.route === '/application' ? 'active' : ''} sx={NAV_LINK_STYLE}>
											<Link href="/application" onClick={toggle} className={MerriweatherFont.className} style={{ fontWeight: 'bold' }}>
												Application
											</Link>
										</Navbar.Section>
										{admin && (
											<Navbar.Section className={router.route === '/admin' ? 'active' : ''} sx={NAV_LINK_STYLE}>
												<Link href="/admin" onClick={toggle} className={MerriweatherFont.className} style={{ fontWeight: 'bold' }}>
													Admin
												</Link>
											</Navbar.Section>
										)}
										<Navbar.Section sx={NAV_LINK_STYLE}>
											<a href="/api/auth/logout" onClick={toggle} className={MerriweatherFont.className} style={{ fontWeight: 'bold' }}>
												Logout
											</a>
										</Navbar.Section>
									</Navbar>
								)}
							</>
						) : (
							<Navbar bg="#0d874a" style={{ color: 'white', maxWidth: '200px', minWidth: '100px', width: '15vw', border: 'none' }}>
								<Link href="/">
									<Image src="/logo-small.png" alt="Logo" mx="auto" my="lg" style={{ maxWidth: '115px', width: '12vw' }} />
								</Link>
								<Space h="2vh" />
								<Navbar.Section className={router.route === '/dashboard' ? 'active' : ''} sx={NAV_LINK_STYLE}>
									<Link href="/dashboard" className={MerriweatherFont.className} style={{ fontWeight: 'bold' }}>
										Dashboard
									</Link>
								</Navbar.Section>
								<Navbar.Section className={router.route === '/application' ? 'active' : ''} sx={NAV_LINK_STYLE}>
									<Link href="/application" className={MerriweatherFont.className} style={{ fontWeight: 'bold' }}>
										Application
									</Link>
								</Navbar.Section>
								{/* <Navbar.Section className={router.route === '/team' ? 'active' : ''} sx={NAV_LINK_STYLE}>
									<Link href="/team">Team</Link>
								</Navbar.Section> */}
								{admin && (
									<Navbar.Section className={router.route === '/admin' ? 'active' : ''} sx={NAV_LINK_STYLE}>
										<Link href="/admin" className={MerriweatherFont.className} style={{ fontWeight: 'bold' }}>
											Admin
										</Link>
									</Navbar.Section>
								)}
								<Navbar.Section sx={NAV_LINK_STYLE}>
									<a href="/api/auth/logout" className={MerriweatherFont.className} style={{ fontWeight: 'bold' }}>
										Logout
									</a>
								</Navbar.Section>
							</Navbar>
						)
					}
					header={
						mobile ? (
							<Header height={{ base: 50, md: 70 }} p="md" bg="#148648" sx={{ border: 'none' }}>
								<div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
									<Burger opened={opened} onClick={toggle} size="sm" mr="xl" color="white" />
									<Text color="white" className={MerriweatherFont.className} weight="bold">
										PickHacks 2023
									</Text>
								</div>
							</Header>
						) : (
							<></>
						)
					}>
					{children}
				</AppShell>
			</ModalsProvider>
		</>
	);
};

export default Layout;

