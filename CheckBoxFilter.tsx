import * as React from 'react';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { ICellRendererParams, IFilterParams } from 'ag-grid-community';

interface IProps extends IFilterParams {
	keyValuePairs: { key: string; value: string }[];
}

export const CheckBoxFilter = forwardRef((props: IProps, ref: any) => {
	const [filterState, setFilterState] = useState<string>(props.keyValuePairs[0].value);

	// expose AG Grid Filter Lifecycle callbacks
	useImperativeHandle(ref, () => ({
		doesFilterPass(params: ICellRendererParams) {
			const { field } = props.colDef;
			// @ts-ignore
			return params.data[field] === filterState;
		},

		isFilterActive() {
			return true;
		},
		getModel() {
			if (filterState === 'off') {
				return undefined;
			}
			return {
				filterType: 'checkBoxFilter',
				values: [filterState],
			};
		},
		setModel(model: {
			filterType: string;
			keyValuePairs: {
				key: string;
				value: string;
			};
		}) {
			if (model === null) {
				setFilterState(props.keyValuePairs[0].value);
			} else {
				setFilterState(model.keyValuePairs.value);
			}
		},
	}));

	const onYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setFilterState(event.target.value);
	};

	useEffect(() => {
		props.filterChangedCallback();
	}, [filterState]);

	return (
		<>
			<div style={{ display: 'inline-block' }} onChange={onYearChange}>
				{props.keyValuePairs.map((pair, index) => (
					<label
						key={pair.key}
						style={{
							margin: '10px',
							display: 'inline-block',
						}}
					>
						<input type="radio" name="status" value={pair.value} defaultChecked={index === 0} />
						{pair.key}
					</label>
				))}
			</div>
		</>
	);
});
