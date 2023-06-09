const months = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec',
];

export const dateFormatter = (d, sec = false) => {
	const date = new Date(d);

	if (isNaN(date.getDate())) return null;

	const day = date.getDate();
	const month = date.getMonth();
	const year = date.getFullYear();
	return `${months[month]} ${day} '${year % 100} at ${date
		.toTimeString()
		.slice(0, sec ? 8 : 5)}`;
};
