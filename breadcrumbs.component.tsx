import * as React from 'react';
import { Breadcrumbs, Link, makeStyles, Paper, Theme } from '@material-ui/core';

interface IProps {}

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		justifyContent: 'center',
		flexWrap: 'wrap',
		borderBottom: theme.custom.borders.primary,
	},
	paper: { padding: theme.spacing(1, 3) },
	slimFont: { fontWeight: theme.typography.fontWeightLight as number },
	breadCrumbs: {
		fontSize: theme.typography.h4.fontSize,
		color: theme.custom.colors.secondary.gray[200],
		fontWeight: theme.typography.fontWeightLight as number,
	},
}));

const BreadcrumbsComponent: React.SFC<IProps> = () => {
	const classes = useStyles();
	return (
		<div className={classes.root}>
			<Paper elevation={0} className={classes.paper}>
				<Breadcrumbs className={classes.breadCrumbs} aria-label="Breadcrumb">
					<Link className={classes.breadCrumbs} href="/">
						Material-UI
					</Link>
					<Link className={classes.breadCrumbs} href="/getting-started/installation/">
						Core
					</Link>
				</Breadcrumbs>
			</Paper>
		</div>
	);
};

export default BreadcrumbsComponent;
