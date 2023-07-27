type IFilters = 'name' | 'tag' | 'lastScanned' | 'Product';

interface ISearchQuery {
	filter: IFilters;
	searchText: string;
}

export function getSearchQuery(str: string): ISearchQuery {
	const arr = str.includes(': ') ? str.split(': ') : ['name', str];

	return {
		filter: arr[0] as IFilters,
		searchText: arr[1].toLowerCase(),
	};
}
