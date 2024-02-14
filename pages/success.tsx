import { Group, Stack, Text } from '@mantine/core';

const Success = () => {
	return (
		<>
            <Group sx={{position: 'absolute'}} top={15} left={25}>
                <img src="/Logo2024.png" height={35} width={35}></img>
                <Text weight={"bold"} sx={{background: 'linear-gradient(45deg, #fc77d9 0%, #a369f5 40%, #544bd6 65%, #5c52e0 92%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '1.3em'}}>PickHacks 2024</Text>
            </Group>
			<Stack justify="center" align="center" sx={{ height: '100vh' }} p={16}>
				<Text align="center">Your application for PickHacks 2024 has been successfully submitted!</Text>
				<Text align="center">
					You will receive an email later to confirm your attendance. Please{' '}
					<a href="https://discord.gg/weJVRv4Rk9" target="_blank" rel="noopener noreferrer">
						join our discord
					</a>{' '}
					to stay up to date with all announcements!
				</Text>
				<a href="/">{'←'} Back to application</a>
			</Stack>
		</>
	);
};

export default Success;
