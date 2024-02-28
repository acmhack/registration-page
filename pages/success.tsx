import { Stack, Text } from '@mantine/core';

const Success = () => {
	return (
		<>
			<a
				href='https://pickhacks.io'
				target='_blank'
				rel='noreferrer'
				style={{ display: 'flex', gap: '1em', position: 'absolute', top: '25px', left: '25px', textDecoration: 'none' }}
			>
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
			</a>
			<Stack justify='center' align='center' sx={{ height: '100vh' }} p={16}>
				<Text align='center'>Your application for PickHacks 2024 has been successfully submitted!</Text>
				<Text align='center'>
					You will receive an email later to confirm your attendance. Please{' '}
					<a href='https://discord.gg/weJVRv4Rk9' target='_blank' rel='noopener noreferrer'>
						join our discord
					</a>{' '}
					to stay up to date with all announcements!
				</Text>
				<a href='https://pickhacks.io' target='_blank' rel='noreferrer'>
					{'←'} Back to main website
				</a>
			</Stack>
		</>
	);
};

export default Success;
