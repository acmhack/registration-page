import { AppShell, CSSObject, Image, MantineProvider, Navbar, Space } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
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

	'& a, & button': {
		color: 'white',
		textDecoration: 'none',
		padding: '0.75rem 1.5rem',
		display: 'block'
	},

	'& button': {
		background: 'none',
		border: 'none',
		cursor: 'pointer',
		fontSize: '1rem',
		fontWeight: 500,
		textAlign: 'left',
		width: '100%'
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
				<ModalsProvider>
				<AppShell
					navbar={
						<Navbar width={{ base: 300 }} bg="#E96281" style={{ color: 'white' }}>
							<Image src="/logo-small.png" alt="Logo" width={200} mx="auto" my="lg" />
							<Space h={50} />
							<Navbar.Section className={router.route === '/' ? 'active' : ''} sx={NAV_LINK_STYLE}>
								<Link href="/">Dashboard</Link>
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
								<button onClick={() => console.log('logging out')}>Logout</button>
							</Navbar.Section>
						</Navbar>
					}>
					<Component {...pageProps} />
				</AppShell>
				</ModalsProvider>
			</MantineProvider>
		</>
	);
}

