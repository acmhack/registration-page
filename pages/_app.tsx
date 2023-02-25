import { UserProvider } from '@auth0/nextjs-auth0/client';
import { AppShell, CSSObject, Image, MantineProvider, Navbar, Space } from '@mantine/core';
import { AppProps } from 'next/app';
import Head from 'next/head';
import Link from 'next/link';

const NAV_LINK_STYLE: CSSObject = {
	borderTop: '2px solid rgba(210, 80, 110, 0.5)',
	cursor: 'pointer',
	position: 'relative',

	'&:hover': {
		background: 'rgba(255, 102, 134, 0.7)'
	},

	'&:last-child': {
		borderBottom: '2px solid rgba(210, 80, 110, 0.5)'
	},

	'&.active:before': {
		content: '""',
		position: 'absolute',
		top: 0,
		left: 0,
		height: '100%',
		borderLeft: '8px solid #FF7090'
	},

	'& a': {
		color: 'white',
		textDecoration: 'none',
		padding: '0.75rem 1.5rem',
		display: 'block'
	}
};

export default function App(props: AppProps) {
	const { Component, pageProps, router } = props;

	return (
		<>
			<Head>
				<title>PickHacks Registration</title>
				<meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
			</Head>

			<MantineProvider
				withGlobalStyles
				withNormalizeCSS
				theme={{
					colorScheme: 'light'
				}}>
				<AppShell
					navbar={
						<Navbar width={{ base: 300 }} bg="#E96281" style={{ color: 'white' }}>
							<Link href="/">
								<Image src="/logo-small.png" alt="Logo" width={200} mx="auto" my="lg" />
							</Link>
							<Space h={50} />
							<Navbar.Section className={router.route === '/dashboard' ? 'active' : ''} sx={NAV_LINK_STYLE}>
								<Link href="/dashboard">Dashboard</Link>
							</Navbar.Section>
							<Navbar.Section className={router.route === '/application' ? 'active' : ''} sx={NAV_LINK_STYLE}>
								<Link href="/application">Application</Link>
							</Navbar.Section>
							<Navbar.Section className={router.route === '/team' ? 'active' : ''} sx={NAV_LINK_STYLE}>
								<Link href="/team">Team</Link>
							</Navbar.Section>
							<Navbar.Section className={router.route === '/admin' ? 'active' : ''} sx={NAV_LINK_STYLE}>
								<Link href="/admin">Admin</Link>
							</Navbar.Section>
							<Navbar.Section sx={NAV_LINK_STYLE}>
								<a href="/api/auth/logout">Logout</a>
							</Navbar.Section>
						</Navbar>
					}>
					<UserProvider>
						<Component {...pageProps} />
					</UserProvider>
				</AppShell>
			</MantineProvider>
		</>
	);
}

