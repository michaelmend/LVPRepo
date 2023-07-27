interface IDateOptions {
	year: '2-digit' | 'numeric' | 'long';
	month: '2-digit' | 'numeric' | 'long';
	day: '2-digit' | 'numeric' | 'long';
	hour?: '2-digit';
	minute?: '2-digit';
	second?: '2-digit';
	weekday?: 'numeric' | 'long';
}

const dateOptions = (time?: boolean, weekday?: 'numeric' | 'long') => {
	const options: IDateOptions = {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	};

	if (time) {
		options.hour = '2-digit';
		options.minute = '2-digit';
		options.second = '2-digit';
	}

	if (weekday) {
		options.weekday = weekday;
	}

	return options;
};

/**
 * GET THE DATE FORMAT ACCORDING TO THE BROWSER'S LANGUAGE
 * @param date
 * @param time
 * @param weekday
 */
const getDateFormat = (date: string, time?: boolean, weekday?: 'numeric' | 'long') => {
	if (Date.parse(date)) {
		const event = new Date(date);
		// @ts-ignore
		return event.toLocaleDateString(navigator.language, dateOptions(time, weekday));
	}
	return '';
};

/**
 * GET THE DATE WITH THE DATABASE FORMAT (YYYY-MM-DD)
 * @param d
 * @returns
 */
export const getDBDateFormat = (d: Date) => {
	const month = `0${d.getMonth() + 1}`.slice(-2);
	const day = `0${d.getDate()}`.slice(-2);

	return `${d.getFullYear()}-${month}-${day}`;
};

export default getDateFormat;
