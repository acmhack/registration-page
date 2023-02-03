import { Button } from '@mantine/core';
import React from 'react';

interface Props {
	onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const MyButton: React.FC<Props> = ({ onClick }) => {
	return <Button onClick={onClick}>My Button</Button>;
};

export default MyButton;

