import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
	CellValueChangedEvent,
	ColDef,
	ColumnRowGroupChangedEvent,
	DisplayedColumnsChangedEvent,
	FilterChangedEvent,
	GetDataPath,
	GridReadyEvent,
	IServerSideDatasource,
	IsServerSideGroupOpenByDefaultParams,
	PaginationChangedEvent,
	RowClickedEvent,
	RowDataUpdatedEvent,
	RowDragEvent,
	RowGroupOpenedEvent,
	RowSelectedEvent,
	SelectionChangedEvent,
	SideBarDef,
	SortChangedEvent,
} from 'ag-grid-community';
import { IsRowSelectable, RowGroupingDisplayType } from 'ag-grid-community/dist/lib/entities/gridOptions';

export interface ISearchBarProps {
	placeholder: string;
	columnKeys: string[];
	treeData?: boolean;
}

export interface IServerSideProps {
	datasource: IServerSideDatasource;
	onGridReady?: (event: GridReadyEvent) => void;
}

export interface IClientSideProps {
	rowData: any[];
	onRowDragEnd?: (event: RowDragEvent) => void;
	onRowDragMove?: (event: RowDragEvent) => void;
	rowDragManaged?: boolean;
	rowDragMultiRow?: boolean;
	suppressMoveWhenRowDragging?: boolean;
	onGridReady?: (event: GridReadyEvent) => void;
	getDataPath?: GetDataPath;
	treeData?: boolean;
	excludeChildrenWhenTreeDataFiltering?: boolean;
}

export interface IAgGridProps {
	id: string;
	gridRef: React.RefObject<AgGridReact>;
	secondaryGridRefs?: React.RefObject<AgGridReact>[];
	title?: string;
	titleWithMarginLeft?: boolean;
	columnDefs: ColDef[];
	defaultColDef?: ColDef;
	onSelectionChanged?: (event: SelectionChangedEvent) => void;
	onDisplayedColumnsChanged?: (event: DisplayedColumnsChangedEvent) => void;
	pageSize?: number;
	cacheBlockSize?: number;
	sideBar?: SideBarDef | string | string[] | boolean | null;
	rowHeight?: number;
	headerHeight?: number;
	floatingFiltersHeight?: number;
	suppressPaginationPanel?: boolean;
	noOverflowYScroll?: boolean;
	searchBar?: ISearchBarProps;
	rowSelection?: 'single' | 'multiple' | null | undefined;
	isRowSelectable?: IsRowSelectable;
	onRowSelected?: (event: RowSelectedEvent) => void;
	animateRows?: boolean;
	actions?: JSX.Element[];
	controls?: JSX.Element[];
	controlsBeforeSearchBar?: JSX.Element[];
	getRowId?: (data: any) => any;
	groupDefaultExpanded?: any;
	groupMaintainOrder?: boolean;
	groupRowsSticky?: boolean;
	autoGroupColumnDef?: ColDef;
	onRowGroupOpened?: (event: RowGroupOpenedEvent) => void;
	onRowClicked?: (event: RowClickedEvent) => void;
	onRowDataUpdated?: (event: RowDataUpdatedEvent) => void;
	onColumnRowGroupChanged?: (event: ColumnRowGroupChangedEvent) => void;
	onCellValueChanged?: (event: CellValueChangedEvent) => void;
	groupDisplayType?: RowGroupingDisplayType;
	groupRowRenderer?: any;
	groupRowRendererParams?: any;
	groupSelectsChildren?: boolean;
	rowGroupPanelShow?: 'always' | 'onlyWhenGrouping' | 'never' | undefined;
	suppressAggFuncInHeader?: boolean;
	serverSide?: IServerSideProps;
	clientSide?: IClientSideProps;
	pagination?: boolean;
	noDataText?: string;
	noRowsOverlayComponent?: any;
	noRowsOverlayComponentParams?: any;
	tooltipHideDelay?: number;
	sortDescFirst?: boolean;
	gridStyle?: React.CSSProperties;
	onFilterChanged?: (event: FilterChangedEvent) => void;
	onSortChanged?: (event: SortChangedEvent) => void;
	onPaginationChanged?: (event: PaginationChangedEvent) => void;
	pageRoute?: () => string;
	defaultHiddenColDefs?: ColDef[];
	noBorder?: boolean;
	noBoxShadow?: boolean;
	noHeader?: boolean;
	noBottomBorderLastRow?: boolean;
	hideNoRowsOverlay?: boolean;
	pinnedTopRowData?: any;
	autoHeight?: boolean;
	getChildCount?: (dataItem: any) => number;
	paginateChildRows?: boolean;
	infoBarText?: string;
	getContextMenuItems?: any;
	isServerSideGroupOpenByDefault?: (params: IsServerSideGroupOpenByDefaultParams) => boolean;
}
