const valueToBase32 = new Array(32)
	.fill()
	.map((_, i) => i < 26 ? String.fromCharCode(65 + i) : i - 26 + 2 + '');

module.exports.encode = (buffer) => {
	let temp = '';
	let res = '';
	for (let byte of buffer) {
		temp += byte.toString(2).padStart(8, '0');
		while (temp.length >= 5) {
			const value = parseInt(temp.substr(0, 5), 2);
			temp = temp.substr(5);
			res += valueToBase32[value];
		}
	}
	if (temp.length) {
		const value = parseInt(temp.padEnd(5, '0').substr(0, 5), 2);
		res += valueToBase32[value];
	}
	return res;
};
