import { AppShell, CSSObject, Image, MantineProvider, Navbar, Space } from '@mantine/core';
import { AppProps } from 'next/app';
import Head from 'next/head';

const NAV_LINK_STYLE: CSSObject = {
	borderTop: '2px solid rgba(210, 80, 110, 0.5)',
	padding: '0.75rem 1.5rem',
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
							<Image src="/logo-small.png" alt="Logo" width={200} mx="auto" my="lg" />
							<Space h={50} />
							<Navbar.Section className={router.route === '/' ? 'active' : ''} sx={NAV_LINK_STYLE}>
								Dashboard
							</Navbar.Section>
							<Navbar.Section className={router.route === '/application' ? 'active' : ''} sx={NAV_LINK_STYLE}>
								Application
							</Navbar.Section>
							<Navbar.Section className={router.route === '/team' ? 'active' : ''} sx={NAV_LINK_STYLE}>
								Team
							</Navbar.Section>
							<Navbar.Section className={router.route === '/admin' ? 'active' : ''} sx={NAV_LINK_STYLE}>
								Admin
							</Navbar.Section>
							<Navbar.Section sx={NAV_LINK_STYLE}>Logout</Navbar.Section>
						</Navbar>
					}>
					<Component {...pageProps} />
				</AppShell>
			</MantineProvider>
		</>
	);
}

