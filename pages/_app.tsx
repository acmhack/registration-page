import { MantineProvider, Tuple } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { AppProps } from 'next/app';
import Head from 'next/head';

export default function App(props: AppProps) {
	const { Component, pageProps } = props;

	return (
		<>
			<Head>
				<title>PickHacks Registration</title>
				<meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
				<link rel="shortcut icon" href="favicon.ico" />
			</Head>

			<MantineProvider
				withGlobalStyles
				withNormalizeCSS
				theme={{
					colorScheme: 'dark',
					loader: 'oval',
					colors: {
						green: [
							...(new Array(10).fill(null).map(
								() =>
									'#' +
									[23, 155, 94]
										.map((val) => val.toString(16))
										.map((hex) => (hex.length < 2 ? '0' + hex : hex))
										.join('')
							) as Tuple<string, 10>)
						],
						pink: [
							...(new Array(10).fill(null).map(
								() =>
									'#' +
									[255, 82, 210]
										.map((val) => val.toString(16))
										.map((hex) => (hex.length < 2 ? '0' + hex : hex))
										.join('')
							) as Tuple<string, 10>)
						]
					},
					primaryColor: 'pink'
				}}>
				<Notifications position="top-right" />
				{/* <Layout> */}
				<Component {...pageProps} />
				{/* </Layout> */}
			</MantineProvider>
		</>
	);
}

