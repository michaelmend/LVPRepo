import * as React from 'react';
import { makeStyles } from '@material-ui/core';
import { ReactComponent as Lobby } from '../icon/svgs/Backgrounds/login.svg';

const useStyle = makeStyles(() => ({
	background: {
		top: '50%',
		left: '50%',
		position: 'absolute',
		transform: 'translate(-50%, -50%)',
		zIndex: 1,
	},
}));

const LoginBackground: React.FC = () => {
	const classes = useStyle();

	return (
		<div className={classes.background}>
			<Lobby />
			{/* <img compo={Lobby} alt="lobby" /> */}
		</div>
	);
};

export default LoginBackground;
