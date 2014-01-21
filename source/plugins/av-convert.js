// GitHub shows bad indentation - open with Notepad++

var convert = {
	formatNumber: function(integer)
	{
		// http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
		return integer.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	},
	
	toFahrenheit: function(celcius)
	{
		return (celcius * 9 / 5 + 32).toFixed();
	},
	
	toMiles: function(km)
	{
		return convert.formatNumber((km * 0.621371192).toFixed());
	},
	
	toNauticalMiles: function(km)
	{
		return convert.formatNumber((km * 0.539956803).toFixed());
	},
	
	toKilometres: function(miles)
	{
		return (miles * 1.609344).toFixed(2).toString().replace(/0$/, '');
	},
	
	toMillibars: function(inchesOfMercury)
	{
		return convert.formatNumber((inchesOfMercury * 33.86).toFixed());
	},
	
	toCompass: function(degrees)
	{
		// http://codereview.stackexchange.com/questions/38613/is-there-a-better-way-to-get-a-compass-point-from-140-than-a-series-of-ifs
		return ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW', 'N'][Math.round(degrees / 11.25 / 2)];
	},
	
	toClouds: function(abbreviation)
	{
		return {
			NSC:	'No significant',
			SKC:	'Clear',
			CLR:	'Clear',
			CAVOK:	'Ceiling & visibility ok',
			FEW:	'Few',
			SCT:	'Scattered',
			SKT:	'Scattered',
			BKN:	'Broken',
			OVC:	'Overcast',
			OVX:	'Obscured',
			OVCX:	'Overcast/obscured'
		}[abbreviation];
	},
	
	toHumanTime: function(iso8601)
	{
		var	milis	= Date.now() - Date.parse(iso8601),
			seconds	= parseInt((milis / 1000).toFixed(), 10),
			minutes	= parseInt((seconds / 60).toFixed(), 10),
			hours	= parseInt((minutes / 60).toFixed(), 10);
		
		return	minutes > 59 ? hours   + ' hour' + (hours   === 1 ? '' : 's') + ' ago' :
				seconds > 59 ? minutes + ' min'  + (minutes === 1 ? '' : 's') + ' ago' :
				seconds > 0  ? seconds + ' sec'  + (seconds === 1 ? '' : 's') + ' ago' :
				iso8601;
	}
};
