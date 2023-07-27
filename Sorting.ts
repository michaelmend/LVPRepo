import { DropdownAutocompleteOptions } from '../components/DropdownAutocomplete';

/**
 * Sort the items by case insensitive (by comparing the strings with their locale)
 */
export function sortByLocale(a: string, b: string) {
	return !a || !b ? 0 : a.localeCompare(b);
}

/**
 * Sort booleans, returning true values first
 */
export function sortBoolean(a: boolean, b: boolean) {
	return a === b ? 0 : a ? -1 : 1;
}

/**
 * Sort the severities using the value
 */
export function sortSeverity(a: number, b: number) {
	return a - b;
}

/**
 * Sorting the dates by turning strings into dates, and then subtract them
 */
export function sortDates(a: string, b: string) {
	return new Date(a).getTime() - new Date(b).getTime();
}

/**
 * Sort by Vulnerability Severity (HIGH > MEDIUM > LOW > OTHER)
 */
export function sortByVulnerabilitySeverity(a: string, b: string) {
	if (a === b) {
		return 0;
		// eslint-disable-next-line no-mixed-operators
	}
	if ((a === 'HIGH' && (b === 'MEDIUM' || b === 'LOW')) || (a === 'MEDIUM' && b === 'LOW')) {
		return 1;
	}
	return -1;
}

/**
 * Sort data for the Export File in the same way the table is sorted
 * @param data
 * @param columnID
 * @param sortFunction
 */
function sortTableData(data: any, columnID: string, sortFunction: string) {
	switch (sortFunction) {
		case 'sortBoolean':
			return data.sort((a: any, b: any) => sortBoolean(a[columnID], b[columnID]));
		case 'sortSeverity':
			return data.sort((a: any, b: any) => sortSeverity(a.vulnerabilitiesWeight, b.vulnerabilitiesWeight));
		case 'sortDates':
			return data.sort((a: any, b: any) => sortDates(a[columnID], b[columnID]));
		default:
			return data.sort((a: any, b: any) => sortByLocale(a[columnID], b[columnID]));
	}
}

/**
 * Sort the Filter Options Data
 */
export function sortOptionsByVulnerabilitySeverity(options: DropdownAutocompleteOptions[]) {
	return options.sort((a, b) => sortByVulnerabilitySeverity(a.name, b.name));
}

/**
 * Sort the effective Options Data
 */
export function sortOptionsByEffective(options: DropdownAutocompleteOptions[]) {
	return options.sort((a, b) => sortSeverity(parseInt(a.value, 10), parseInt(b.value, 10)));
}

export default sortTableData;
