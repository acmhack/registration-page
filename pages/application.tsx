import { NextPage } from 'next/types';
import MyButton from '../components/MyButton';

const Application: NextPage = () => {
	return (
		<div>
			<MyButton onClick={() => alert('Hello')} />
		</div>
	);
};

export default Application;
