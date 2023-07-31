import { getDBDateFormat } from 'src/wss-ui';
import { FilterOperatorTypes } from 'src/wss-ui/components/Table/filters/types';
import { ColDef, ColumnApi, GridApi, IServerSideGetRowsParams, SortModelItem } from 'ag-grid-community';
import { pageParams, PageSort, PaginationOptions } from '../../data/endpoints/common/url/pagination';
import { SearchParams } from '../../data/endpoints/common/url/schemaBuilder';
import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { LoadSuccessParams } from 'ag-grid-community/dist/lib/rowNodeCache/rowNodeBlock';
import { ServiceFunctionType } from '../../services/ApiService';
import { paginationDataLoad } from './paginationDataLoad';
import { ApiResponse } from '../../interfaces/ResponseInterface';

export interface IDatasourceParams {
	gridRef: React.RefObject<AgGridReact>;
}

export function datasourceSuccess(datasourceParams: IServerSideGetRowsParams, gridRef: React.RefObject<AgGridReact>, params: LoadSuccessParams) {
	if (params.rowCount) {
		gridRef.current?.api.hideOverlay();
	} else {
		gridRef.current?.api.showNoRowsOverlay();
	}
	datasourceParams.success(params);
}

export function handleService<T>(
	service: ServiceFunctionType<ApiResponse<T[]>>,
	datasourceParams: IServerSideGetRowsParams,
	gridRef: React.RefObject<AgGridReact>,
	paginationDataLoadHandler?: (data: ApiResponse<T[]>) => LoadSuccessParams
) {
	service()
		.then(paginationDataLoadHandler || paginationDataLoad)
		.then((params: LoadSuccessParams) => datasourceSuccess(datasourceParams, gridRef, params))
		.catch(() => {
			datasourceParams.fail();
		});
}

export function handleSingleResultService<T>(
	service: ServiceFunctionType<ApiResponse<T>>,
	datasourceParams: IServerSideGetRowsParams,
	gridRef: React.RefObject<AgGridReact>,
	paginationDataLoadHandler: (data: ApiResponse<T>) => LoadSuccessParams
) {
	service()
		.then(paginationDataLoadHandler)
		.then((params: LoadSuccessParams) => datasourceSuccess(datasourceParams, gridRef, params))
		.catch(() => {
			datasourceParams.fail();
		});
}

export function getSearchParams(
	gridApi: GridApi,
	columnApi: ColumnApi,
	filterModel: { [p: string]: any },
	sortModel: SortModelItem[],
	startRow: number | undefined,
	defaultSort?: SortModelItem,
	optionalColumns?: string[],
	toSetFilterOperatorType?: (type: string) => FilterOperatorTypes
): SearchParams {
	// sort
	let pageSort: PageSort | undefined = undefined;
	if (sortModel.length > 0) {
		const sortModelItem: SortModelItem = sortModel[0];
		pageSort = {
			by: sortModelItem.colId,
			order: sortModelItem.sort,
		};
	} else if (defaultSort) {
		pageSort = {
			by: defaultSort.colId,
			order: defaultSort.sort,
		};
	}

	// filter
	const searchQueries = Object.entries(filterModel).map(([filterName, filterElement]) => {
		let filterColumn = filterName.replace('ag-Grid-AutoColumn-', '');

		let operatorType = FilterOperatorTypes.EQUALS;
		let colDef = gridApi.getColumnDef(filterName);
		if (colDef) {
			// read filterOperatorType from ColDef
			let { filterOperatorType } = colDef.filterParams;
			if (filterOperatorType) {
				operatorType = filterOperatorType;
			}
			// read filterField from ColDef
			let { filterField } = colDef.filterParams;
			if (filterField) {
				filterColumn = filterField;
			}
		}

		if (filterElement.filterType === 'text') {
			const filter = encodeURIComponent(filterElement.filter);
			if (filterElement.type === 'contains') {
				return `${filterColumn}:LIKE:${filter}`;
			} else if (filterElement.type === 'equals') {
				return `${filterColumn}:EQUALS:${filter}`;
			}
		} else if (filterElement.filterType === 'number') {
			if (filterElement.type === 'greaterThan') {
				return `${filterColumn}:GT:${filterElement.filter}`;
			}
		} else if (filterElement.filterType === 'set' || filterElement.filterType === 'checkBoxFilter') {
			if (toSetFilterOperatorType) {
				operatorType = toSetFilterOperatorType(filterColumn);
			}

			let { values } = filterElement;
			if (values) {
				let filterValue;
				switch (operatorType) {
					case FilterOperatorTypes.IN:
						filterValue = values.join(',');
						break;
					case FilterOperatorTypes.REGEX:
						filterValue = values.join('%7C');
						break;
					case FilterOperatorTypes.EQUALS:
						filterValue = values[0];
						break;
					case FilterOperatorTypes.GT:
						values.sort();
						filterValue = values[values.length - 1];
						break;
				}
				return `${filterColumn}:${operatorType}:${filterValue}`;
			}
		} else if (filterElement.filterType === 'date') {
			let { dateFrom } = filterElement;
			let { dateTo } = filterElement;

			const filterType = filterElement.type;
			switch (filterType) {
				case 'greaterThan':
					dateTo = getDBDateFormat(new Date());
					break;
				case 'lessThan':
					dateTo = dateFrom;
					dateFrom = getDBDateFormat(new Date(0));
					break;
				case 'inRange':
					// do nothing
					break;
				case 'equals':
				default:
					dateTo = dateFrom;
					break;
			}

			// remove time from date
			dateFrom = dateFrom.split(' ')[0];
			dateTo = dateTo.split(' ')[0];

			return `${filterColumn}:BETWEEN:${dateFrom}%2C${dateTo}`;
		}

		// default case
		return '';
	});

	// pagination
	const pageSize = gridApi.paginationGetPageSize();
	const paginationOptions: PaginationOptions = {
		page: (startRow || 0) / pageSize,
		pageSize: pageSize,
		sort: pageSort,
		search: searchQueries.join(';'),
	};

	// optional columns
	const visibleOptionalColumns: string[] = [];
	optionalColumns?.forEach((optionalColumn) => {
		let column = columnApi.getColumn(optionalColumn);
		if (column?.isVisible()) {
			visibleOptionalColumns.push(optionalColumn);
		}
	});

	// search params
	const searchParams: SearchParams = { ...pageParams({ ...paginationOptions }) };
	if (visibleOptionalColumns?.[0]) {
		searchParams.optionalColumns = visibleOptionalColumns[0];
	}
	return searchParams;
}

export function getAgGridSearchParams(
	datasourceParams: IServerSideGetRowsParams,
	defaultSort?: SortModelItem,
	optionalColumns?: string[],
	toSetFilterOperatorType?: (type: string) => FilterOperatorTypes
): SearchParams {
	const { request } = datasourceParams;
	const { sortModel } = request;
	const filterModel = request.filterModel as { [key: string]: any };
	const gridApi = datasourceParams.api;
	const { columnApi } = datasourceParams;
	const { startRow } = request;

	return getSearchParams(gridApi, columnApi, filterModel, sortModel, startRow, defaultSort, optionalColumns, toSetFilterOperatorType);
}

export interface IAgGridFilter {
	key: string;
	value: string;
	displayName: string;
	displayValue: string;
	displayType?: string;
}

export function getAgGridFilters(gridRef: React.RefObject<AgGridReact>): IAgGridFilter[] {
	let currentGridRef = gridRef.current!;
	if (currentGridRef && currentGridRef.columnApi && currentGridRef.api) {
		const filterModel = currentGridRef.api.getFilterModel() as { [key: string]: any };
		const gridApi = currentGridRef.api;

		return Object.entries(filterModel).map(([filterName, filterElement]) => {
			let filterColumn = filterName.replace('ag-Grid-AutoColumn-', '');

			let headerName = '';
			let colDef: ColDef | null = gridApi.getColumnDef(filterName);
			if (colDef) {
				headerName = colDef.headerName || '';
				let filterField = colDef.filterParams.filterName;
				if (filterField) {
					filterColumn = filterField;
				}
			}
			if (filterElement.filterType === 'set' || filterElement.filterType === 'checkBoxFilter') {
				const keyValuePairs = colDef?.filterParams?.keyValuePairs;
				const displayValues: string[] = [];
				if (keyValuePairs) {
					for (const pair of keyValuePairs) {
						for (const value of filterElement.values) {
							if (pair.value === value) {
								displayValues.push(pair.key);
							}
						}
					}
				}

				return {
					key: filterColumn,
					value: filterElement.values.join(','),
					displayName: headerName,
					displayValue: `[${displayValues.length ? displayValues.join(', ') : filterElement.values.join(', ')}]`,
				};
			} else if (filterElement.filterType === 'date') {
				let { dateFrom } = filterElement;
				let { dateTo } = filterElement;

				let displayValue;
				let displayType = '';
				const filterType = filterElement.type;
				switch (filterType) {
					case 'greaterThan':
						dateTo = getDBDateFormat(new Date());
						displayValue = dateTo.split(' ')[0];
						displayType = 'greater than';
						break;
					case 'lessThan':
						dateTo = dateFrom;
						dateFrom = getDBDateFormat(new Date(0));
						displayValue = dateFrom.split(' ')[0];
						displayType = 'less than';
						break;
					case 'inRange':
						// do nothing
						displayValue = dateTo.split(' ')[0] + ' and ' + dateFrom?.split(' ')[0];
						displayType = 'between';
						break;
					case 'equals':
					default:
						dateTo = dateFrom;
						displayValue = dateTo.split(' ')[0];
						break;
				}

				// remove time from date
				dateFrom = dateFrom.split(' ')[0];
				dateTo = dateTo.split(' ')[0];

				return {
					key: filterColumn,
					value: dateFrom + 'To ' + dateTo,
					displayName: headerName,
					displayValue: displayValue,
					displayType: displayType,
				};
			} else {
				return {
					key: filterColumn,
					value: filterElement.filter,
					displayName: headerName,
					displayValue: `'${filterElement.filter}'`,
					displayType: filterElement.type,
				};
			}
		});
	}
	return [];
}
