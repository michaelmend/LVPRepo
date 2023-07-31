/* eslint-disable @typescript-eslint/no-unused-vars */
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { IFilterParams } from 'ag-grid-community';
import { IFilterReactComp } from 'ag-grid-react';
import { makeStyles } from '@material-ui/core';
import { DateRangePicker, Range } from 'react-date-range';
// import { DateRangePicker } from 'materialui-daterange-picker';

const useStyles = makeStyles({ wrapper: {} });

export const DateRangeFilter = forwardRef((props: IFilterParams, ref: any) => {
	const [range, setRange] = useState<Range>({ key: 'selection' });
	const classes = useStyles();

	// expose AG Grid Filter Lifecycle callbacks
	useImperativeHandle<any, IFilterReactComp>(ref, () => ({
		doesFilterPass(params) {
			const { api, colDef, column, columnApi, context } = props;
			const { node } = params;

			const value = props.valueGetter({
				api,
				colDef,
				column,
				columnApi,
				context,
				data: node.data,
				getValue: (field) => node.data[field],
				node,
			});

			if (range === undefined || !range.startDate) return false;

			return !!(range.startDate && value > range.startDate && range.endDate && range.endDate > value);
		},

		isFilterActive() {
			return !!range && !!range.startDate;
		},

		getModel() {
			if (!this.isFilterActive()) {
				return null;
			}

			return {
				startDate: range?.startDate,
				endDate: range?.endDate,
				filterType: 'date',
			};
		},

		setModel(model: Range) {
			setRange(model);
		},
	}));

	useEffect(() => {
		props.filterChangedCallback();
	}, [props, range]);

	return (
		<div>
			<DateRangePicker
				editableDateInputs={true}
				onChange={(item) => setRange(item.selection)}
				moveRangeOnFirstSelection={false}
				showPreview
				ranges={[range]}
			/>
			<button onClick={() => setRange({ key: 'selection' })}>Reset</button>
		</div>
	);
});
