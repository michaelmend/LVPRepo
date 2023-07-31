// inspiration taken from https://v4.mui.com/components/autocomplete/#githubs-picker

import ButtonBase from '@material-ui/core/ButtonBase';
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { InputBase, Popper, Theme } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/pro-solid-svg-icons';
import { AutocompletePartial } from '../Autocomplete/AutocompletePartial';
import { Tooltip } from 'src/wss-ui';

interface IProps {
	id: string;
	value: string;
	autocompleteOptions: string[];
	onValueChangeHandler: (newValue: string) => void;
	maxWidth: number;
}

interface IStyleProps extends IProps {
	open: boolean;
}

const useStyle = makeStyles((theme: Theme) => ({
	button: {
		fontFamily: theme.typography.fontFamily,
		fontWeight: 'bold',
		color: '#6B778C',
		// textDecoration: 'underline',
	},
	popper: {
		border: '1px solid rgba(27,31,35,.15)',
		boxShadow: '0 3px 12px rgba(27,31,35,.15)',
		borderRadius: 3,
		width: 500,
		zIndex: 3,
		fontSize: 13,
		color: '#586069',
		backgroundColor: '#f6f8fa',
	},
	header: {
		borderBottom: '1px solid #e1e4e8',
		padding: '8px 10px',
		fontWeight: 600,
	},
	inputBase: {
		padding: 10,
		width: '100%',
		borderBottom: '1px solid #dfe2e5',
		'& input': {
			borderRadius: 4,
			backgroundColor: theme.palette.common.white,
			padding: 8,
			transition: theme.transitions.create(['border-color', 'box-shadow']),
			border: '1px solid #ced4da',
			fontSize: 14,
			'&:focus': { borderColor: theme.palette.primary.main },
		},
	},
	paper: {
		boxShadow: 'none',
		margin: 0,
		color: '#586069',
		fontSize: 13,
	},
	option: {
		minHeight: 'auto',
		alignItems: 'flex-start',
		padding: 8,
		fontFamily: theme.typography.fontFamily,
		color: '#6B778C',
		fontSize: '14px !important',
		'&[aria-selected="true"]': { backgroundColor: 'transparent' },
		'&[data-focus="true"]': { backgroundColor: theme.palette.action.hover },
	},
	popperDisablePortal: { position: 'relative' },
	iconSelected: {
		width: 17,
		height: 17,
		marginRight: 5,
		marginLeft: -2,
	},
	color: {
		width: 14,
		height: 14,
		flexShrink: 0,
		borderRadius: 3,
		marginRight: 8,
		marginTop: 2,
	},
	text: { flexGrow: 1 },
	close: {
		opacity: 0.6,
		width: 18,
		height: 18,
	},
	chevronIcon: {
		marginLeft: theme.spacing(1),
		transform: (props: IStyleProps) => (props.open ? 'rotate(180deg)' : ''),
		// transition: 'transform 300ms',
	},
	label: {
		maxWidth: (props: IStyleProps) => `calc(${props.maxWidth}px - 25px)`,
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
	},
}));

export const AutocompleteBreadcrumb = (props: IProps) => {
	const { id, value, autocompleteOptions, onValueChangeHandler } = props;
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const classes = useStyle({
		...props,
		open: open,
	} as IStyleProps);

	const handleClick = (event: any) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = (event: any, reason: any) => {
		if (reason === 'toggleInput') {
			return;
		}
		setAnchorEl(null);
	};

	const popperId = open ? `${id}_popper` : undefined;

	return (
		<>
			<Tooltip id={`${id}_tooltip`} title={value} placement="top">
				<ButtonBase disableRipple className={classes.button} aria-describedby={popperId} onClick={handleClick}>
					{/*<span className={classes.label}>{value}</span>*/}
					<FontAwesomeIcon icon={faChevronDown} className={classes.chevronIcon} />
				</ButtonBase>
			</Tooltip>
			<Popper id={popperId} open={open} anchorEl={anchorEl} placement="bottom-start" className={classes.popper}>
				<AutocompletePartial
					open
					onClose={handleClose}
					disableClearable={true}
					batchSize={100}
					classes={{
						paper: classes.paper,
						option: classes.option,
						popperDisablePortal: classes.popperDisablePortal,
					}}
					defaultValue={value}
					onChange={(event, newValue) => {
						if (newValue) {
							onValueChangeHandler(newValue);
							// this will close the popper
							setAnchorEl(null);
						}
					}}
					disableCloseOnSelect
					disablePortal
					renderTags={() => null}
					renderOption={(option) => <div className={classes.text}>{option}</div>}
					options={autocompleteOptions}
					// getOptionLabel={option => option.name}
					renderInput={(params) => (
						<InputBase ref={params.InputProps.ref} inputProps={params.inputProps} autoFocus className={classes.inputBase} />
					)}
				/>
			</Popper>
		</>
	);
};
