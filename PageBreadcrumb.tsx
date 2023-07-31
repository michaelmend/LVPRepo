import { Link } from 'react-router-dom';
import * as React from 'react';
import { useMemo } from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import { Tooltip } from 'src/wss-ui';
import useSearchQuery from '../../hooks/QuerySearchHook';
import { ContextType } from '../../helpers/ContextName';
import { useFullOrganizationContext } from '../../contexts/OrganizationContext';
import { IEntityBase, IProjectBase, ISimpleProject } from '../../interfaces/api/ProjectApiInterface';
import { AutocompleteBreadcrumb } from './AutocompleteBreadcrumb';
import { Skeleton } from '@material-ui/lab';
import { useAppRoutesContext } from '../../contexts/EntitiesContext';
import { useTranslation } from 'react-i18next';
import { searchQueryBuilder } from '../../helpers/UrlUtils';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';

export interface IPageBreadcrumb {
	id: string;
	label?: string;
	separator?: boolean;
	route?: string;
	project?: boolean;
	product?: boolean;
	scan?: boolean;
	loading?: boolean;
}

interface IProps {
	id: string;
	product?: IEntityBase;
	project?: ISimpleProject;
	scan?: IEntityBase;
	breadcrumbsToAdd?: IPageBreadcrumb[];
	showAllProjectsItem?: boolean;
}

const useStyle = makeStyles((theme: Theme) => ({
	breadcrumbWrapper: {
		display: 'flex',
		flexDirection: 'row',
		paddingTop: theme.spacing(1.5),
		gap: theme.spacing(1),
		alignItems: 'center',
		'& a': {
			color: theme.palette.text.secondary,
		},
		'& a:hover': {
			color: theme.palette.text.primary,
		},
		...theme.typography.body2,
	},
	breadcrumb: {
		'& a': {
			color: theme.palette.text.secondary,
		},
		'& a:hover': {
			color: theme.palette.text.primary,
		},
		fontWeight: 'normal',
		maxWidth: '200px',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		...theme.typography.body2,
	},
	breadcrumbActive: {
		'& a': {
			color: theme.palette.text.primary,
		},
		fontWeight: 'normal',
		maxWidth: '200px',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		...theme.typography.body2,
	},
	contextSelection: {
		minWidth: '300px',
		height: '20px',
		// marginLeft: theme.spacing(1.5),
		'& .MuiOutlinedInput-root': { height: '25px' },
		'& .MuiFormControl-root': { padding: '0px 8px !important' },
		'& .MuiFormControl-marginDense': { margin: '0px !important' },
		'& .MuiAutocomplete-inputRoot': {
			padding: '0px 6px !important',
			position: 'absolute',
			top: '-3px',
		},
		'& .MuiOutlinedInput-inputRoot': { padding: '0px 8px !important' },
		'& .MuiAutocomplete-endAdornment': { right: '0px !important' },
		'& .MuiOutlinedInput-notchedOutline': { border: '1px solid transparent !important' },
		// '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #CBD0D2 !important' },
		'& input': {
			fontFamily: theme.typography.fontFamily,
			fontWeight: 'bold',
			color: '#6B778C',
			textDecoration: 'underline',
			cursor: 'pointer',
			padding: '0px',
		},
	},
	productSelection: { minWidth: '200px' },
	projectAutocomplete: {
		maxWidth: '300px',
		display: 'flex',
		'& .MuiButtonBase-root': { fontSize: '12px', lineHeight: '12px' },
	},
	productAutocomplete: {
		width: '200px',
		position: 'absolute',
	},
	popper: {},
	option: {
		fontFamily: theme.typography.fontFamily,
		color: '#6B778C',
		fontSize: '12px !important',
	},
	skeleton: { width: '125px' },
}));

export const PageBreadcrumbs = (props: IProps) => {
	const classes = useStyle(props);
	const { id, product, project, scan, breadcrumbsToAdd, showAllProjectsItem } = props;
	const { context, switchContext } = useSearchQuery();
	const { appRoutes } = useAppRoutesContext();
	const { t } = useTranslation();

	const productUuid = product?.uuid;

	const breadcrumbs: IPageBreadcrumb[] = useMemo(() => {
		const breadcrumbArray: IPageBreadcrumb[] = [
			{
				id: 'products_breadcrumb',
				label: t('APPLICATIONS'),
				route: appRoutes.productSummaries(),
			},
			{
				id: 'product_name_breadcrumb',
				label: product?.name,
				route: appRoutes.applications().summary({ search: searchQueryBuilder(ContextType.PRODUCT, product) }),
				product: true,
				loading: product === undefined,
			},
		];

		if (showAllProjectsItem) {
			let projectBreadcrumbs: IPageBreadcrumb[];
			projectBreadcrumbs = [
				{
					id: 'projects_breadcrumb',
					label: 'Projects',
					route: appRoutes.applications().projects({
						search: searchQueryBuilder(ContextType.PRODUCT, product),
					}),
				},
				{
					id: 'project_name_breadcrumb',
					label: project ? project.name : 'All Projects',
					route: appRoutes.applications().summary({ search: searchQueryBuilder(ContextType.PROJECT, project) }),
					project: true,
					loading: product === undefined,
				},
			];
			breadcrumbArray.push(...projectBreadcrumbs);
		}

		if (scan) {
			const scansBreadcrumbs: IPageBreadcrumb[] = [
				{
					id: 'scans_breadcrumb',
					label: 'Scans',
					route: appRoutes.applications().scans({
						clearNonContextParams: true,
					}),
				},
				{
					id: 'scans_name_breadcrumb',
					label: scan.name,
					scan: true,
					loading: scan.name === '',
				},
			];
			breadcrumbArray.push(...scansBreadcrumbs);
		}

		if (breadcrumbsToAdd) {
			breadcrumbArray.push(...breadcrumbsToAdd);
		}

		let finalBreadcrumbs: IPageBreadcrumb[] = [];
		if (breadcrumbArray) {
			for (let i = 0; i < breadcrumbArray.length; i++) {
				const breadcrumb = breadcrumbArray[i];
				finalBreadcrumbs.push(breadcrumb);
				finalBreadcrumbs.push({
					id: `${breadcrumb.id}_separator`,
					separator: true,
				});
			}
			finalBreadcrumbs = finalBreadcrumbs.slice(0, -1);
		}
		return finalBreadcrumbs;
	}, [appRoutes, breadcrumbsToAdd, context, product, project, scan]);

	const breadcrumbMaxIndex = breadcrumbs.length - 1;

	// const { currentOrganization } = useOrganizationContext();
	const { allProjects: projects, allProducts: products } = useFullOrganizationContext();
	// const [scanOptions, setScanOptions] = useState<IScanSummary[]>([]);

	const productProjects = projects
		.filter((p) => p.productUuid === productUuid)
		.sort((a: IProjectBase, b: IProjectBase) => a.name.localeCompare(b.name));
	// add 'all projects' as first option - when selected switch to product scope
	productProjects.unshift({
		name: 'All Projects',
		uuid: '',
		productUuid: productUuid,
	} as IProjectBase);

	const productOptions = useMemo(() => products.map((pd) => pd.name).sort((a: string, b: string) => a.localeCompare(b)), [products]);

	const onProductChangeHandler = (value: string | null) => {
		if (value) {
			let selectedProduct = products.find((pd) => pd.name === value);
			if (selectedProduct) {
				switchContext(ContextType.PRODUCT, selectedProduct.uuid);
			}
		}
	};

	const onProjectChangeHandler = (value: string | null) => {
		if (value) {
			if (value === 'All Projects') {
				switchContext(ContextType.PRODUCT, productUuid || '');
			} else {
				const selectedProject = productProjects.find((p) => p.name === value);
				if (selectedProject) {
					switchContext(ContextType.PROJECT, selectedProject.uuid);
				}
			}
		}
	};

	return (
		<div id={id} className={classes.breadcrumbWrapper}>
			{breadcrumbs.map((breadcrumb: IPageBreadcrumb, index) => {
				if (breadcrumb.separator) {
					return (
						<div className={classes.breadcrumb} key={`breadcrumb_separator_${breadcrumb.id}`}>
							{'/'}
						</div>
					);
				} else if (breadcrumb.product) {
					return breadcrumb.loading ? (
						<Skeleton
							animation={'wave'}
							className={`${classes.breadcrumb} ${classes.skeleton}`}
							key={`breadcrumb_skeleton_${breadcrumb.id}`}
						/>
					) : (
						<div
							className={
								index < breadcrumbMaxIndex
									? `${classes.breadcrumb} ${classes.projectAutocomplete}`
									: `${classes.breadcrumbActive} ${classes.projectAutocomplete}`
							}
							key={`products_autocomplete_wrapper_${breadcrumb.id}`}
						>
							<Link id={breadcrumb.id} key={breadcrumb.id} to={breadcrumb.route!} className={classes.breadcrumb}>
								{breadcrumb.label}
							</Link>
							<AutocompleteBreadcrumb
								id={'products_context_selection_breadcrumb'}
								value={breadcrumb.label ? breadcrumb.label : ''}
								autocompleteOptions={productOptions}
								onValueChangeHandler={onProductChangeHandler}
								maxWidth={200}
							/>
						</div>
					);
				} else if (breadcrumb.project) {
					return breadcrumb.loading ? (
						<Skeleton
							animation={'wave'}
							className={`${classes.breadcrumb} ${classes.skeleton}`}
							key={`breadcrumb_skeleton_${breadcrumb.id}`}
						/>
					) : (
						<div
							className={
								index < breadcrumbMaxIndex
									? `${classes.breadcrumb} ${classes.projectAutocomplete}`
									: `${classes.breadcrumbActive} ${classes.projectAutocomplete}`
							}
							key={`products_autocomplete_wrapper_${breadcrumb.id}`}
						>
							<Link id={breadcrumb.id} key={breadcrumb.id} to={breadcrumb.route!} className={classes.breadcrumb}>
								{breadcrumb.label}
							</Link>
							<AutocompleteBreadcrumb
								id={'projects_context_selection_breadcrumb'}
								value={breadcrumb.label ? breadcrumb.label : ''}
								autocompleteOptions={productProjects.map((p) => p.name)}
								onValueChangeHandler={onProjectChangeHandler}
								maxWidth={300}
							/>
						</div>
					);
				} else if (breadcrumb.scan) {
					return breadcrumb.loading ? (
						<Skeleton
							animation={'wave'}
							className={clsx([classes.breadcrumb, classes.skeleton])}
							key={`breadcrumb_skeleton_${breadcrumb.id}`}
						/>
					) : (
						<Tooltip id="scan_breadcrumb_tooltip" key="scan_breadcrumb_tooltip" title={breadcrumb.label || ''} placement="top">
							<Typography
								variant="body2"
								className={
									index < breadcrumbMaxIndex
										? clsx(classes.breadcrumb, classes.option)
										: clsx(classes.breadcrumbActive, classes.option)
								}
							>
								{breadcrumb.label}
							</Typography>
						</Tooltip>
					);
				} else {
					return breadcrumb.loading ? (
						<Skeleton
							animation={'wave'}
							className={`${classes.breadcrumb} ${classes.skeleton}`}
							key={`breadcrumb_skeleton_${breadcrumb.id}`}
						/>
					) : breadcrumb.route ? (
						<Link id={breadcrumb.id} key={breadcrumb.id} to={breadcrumb.route} className={classes.breadcrumb}>
							{breadcrumb.label}
						</Link>
					) : (
						<Tooltip
							id={`breadcrumb_tooltip_${breadcrumb.id}`}
							key={`breadcrumb_tooltip_${breadcrumb.id}`}
							title={breadcrumb.label!}
							placement="bottom"
						>
							<div id={breadcrumb.id} className={classes.breadcrumb}>
								{breadcrumb.label}
							</div>
						</Tooltip>
					);
				}
			})}
		</div>
	);
};
