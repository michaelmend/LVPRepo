import { GridApi, ISetFilter, NumberFilter, TextFilter } from 'ag-grid-community';
import { ISimpleFilterModelType } from 'ag-grid-community/dist/lib/filter/provided/simpleFilter';
import { SetFilterModelValue } from 'ag-grid-community/dist/lib/interfaces/iSetFilter';

export function setTextFilter(api: GridApi, field: string, value: string | null) {
	const filterInstance = api.getFilterInstance(field) as TextFilter;
	if (filterInstance) {
		let type: ISimpleFilterModelType | null | undefined;
		let filterValue = null;
		if (value) {
			let split = value.split(':');
			type = split[0] as ISimpleFilterModelType;
			filterValue = split[1];
		}

		if (filterValue && type) {
			filterInstance.setModel({
				filter: filterValue,
				type: type,
			});
			filterInstance.applyModel();
		}
	}
}

export function setNumberFilter(api: GridApi, field: string, value: string | null) {
	const filterInstance = api.getFilterInstance(field) as NumberFilter;
	if (filterInstance) {
		let type: ISimpleFilterModelType | null | undefined;
		let filterValue = null;
		if (value) {
			let split = value.split(':');
			type = split[0] as ISimpleFilterModelType;
			filterValue = split[1];
		}

		if (filterValue && type) {
			filterInstance.setModel({
				filter: Number(filterValue),
				type: type,
			});
			filterInstance.applyModel();
		}
	}
}

export function setSetFilter(api: GridApi, field: string, value: string | null) {
	const filterInstance = api.getFilterInstance(field) as ISetFilter;
	if (filterInstance) {
		let filterValues: SetFilterModelValue = [];
		if (value) {
			filterValues = value.split(',');
		}

		if (filterValues.length > 0) {
			if (filterInstance.getValues().length === 0) {
				// this filter's values are fetched via server-side
				// for now, enter the provided filters as values, they will be fully populated later when the server-side request returns
				filterInstance.setFilterValues(filterValues);
			}
			filterInstance.setModel({ values: filterValues });
			filterInstance.applyModel();
		}
	}
}
