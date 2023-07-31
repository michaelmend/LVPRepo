import * as React from 'react';
import { makeStyles } from '@material-ui/core';

interface IProps {
	background: JSX.Element;
}

const useStyle = makeStyles(() => ({
	background: {
		position: 'absolute',
		zIndex: 1,
		top: 0,
		left: 'calc(50% - 381.5px)',
	},
}));

const BackgroundWrapper: React.FC<IProps> = (props) => {
	const classes = useStyle();
	const { background } = props;

	return <div className={classes.background}>{background}</div>;
};

export default BackgroundWrapper;
