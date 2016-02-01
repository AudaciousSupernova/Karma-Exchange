var monthIndexBy3Letters = {
	"Jan" : 0,
	"Feb" : 1,
	"Mar" : 2,
	"Apr" : 3,
	"May" : 4,
	"Jun" : 5,
	"Jul" : 6,
	"Aug" : 7,
	"Sep" : 8,
	"Oct" : 9,
	"Nov" : 10,
	"Dec" : 11,
}

var daysInMonthByIndex = [31,29,31,30,31,30,31,31,30,31,30,31]

module.exports = {
	monthIndexBy3Letters: monthIndexBy3Letters,
	daysInMonthByIndex: daysInMonthByIndex
}