// GitHub shows bad indentation - open with Notepad++

/* To do:

 * QC flags
 * use NOAA instead of FAA's ADDS for METARs... NOAA actually cares about all aerodromes
 * split >500
 * search by city/name
 
 Unrelated:
 
 * !!listcommands
 * parent room
 * !!help
 * whitelist so-chatbot-php-helper

*/

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
			SKC:	'Clear',
			CLR:	'Clear',
			CAVOK:	'Ceiling & visibility ok',
			FEW:	'Few',
			SCT:	'Scattered',
			BKN:	'Broken',
			OVC:	'Overcast',
			OVX:	'Obscured'
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
},

weather = {
	weather: function(args, cb)
	{
		weather.command(args, cb, 'weather');
	},
	
	metar: function(args, cb)
	{
		weather.command(args, cb, 'metar');
	},
	
	taf: function(args, cb)
	{
		weather.command(args, cb, 'taf');
	},
	
	command: function(args, cb, mode)
	{
		var	query = args.toString().toUpperCase();
		
		if(!query || (query.length !== 3 && query.length !== 4))
		{
			args.directreply('You must specify a 3-letter IATA or 4-letter ICAO airport code - e.g. `!!' + mode + ' LPL` or `!!' + mode + ' KJFK`');
			return;
		}
		
		IO.jsonp({
			url:		'http://dannybeckett.co.uk/AviationBot/Weather.php',
			jsonpName:	'callback',
			fun:		finish,
			data:		{
							a:	query,
							m:	mode.replace('weather', 'metar') + 's'
						}
		});
	
		function finish(resp)
		{
			// These errors are generated directly by Weather.php
			if(resp.hasOwnProperty('error'))
			{
				var errors = {
					'BadParams':	'Whoops, something went wrong! (@DannyBeckett)',
					'NoICAO':		'No matching ICAO code could be found for the IATA code ' + query + '! Check you typed the correct 3-letter IATA code, or type its 4-letter ICAO code instead.'
				};
				
				args.directreply(errors[resp.error]);
				return;
			}
			
			// Weather.php appends "airport" to the JSON
			var code = (resp.airport.hasOwnProperty('iata') ? resp.airport.iata + '/' : '') + resp.airport.icao,
				link = bot.adapter.link(code, resp.airport[mode.replace('weather', 'metar')]);
			
			if(resp.data['@attributes'].num_results === '0')
			{
				args.directreply('No data could be found within the last 24 hours for ' + link + '! Check you typed the correct 3-letter IATA or 4-letter ICAO airport code.')
				return;
			}
			
			var data = resp.data.METAR || resp.data.TAF,
				info = [],
				sky;
			
			if(data.hasOwnProperty('sky_condition'))
			{
				var	gotmultipleClouds = data.sky_condition instanceof Array;
					gotSingleCloud = data.sky_condition.hasOwnProperty('@attributes');
			
				var getCloud = function(conditions)
				{
					var ret = convert.toClouds(conditions['@attributes'].sky_cover);
					
					if(conditions['@attributes'].hasOwnProperty('cloud_base_ft_agl'))
					{
						ret += ' @ ' + convert.formatNumber(conditions['@attributes'].cloud_base_ft_agl) + 'ft';
					}
					
					return ret;
				}
				
				if(gotmultipleClouds)
				{
					var clouds = [];
					
					for(var i = 0; i < data.sky_condition.length; i++)
					{
						clouds.push(getCloud(data.sky_condition[i]));
					}
					
					sky = clouds.join('; ');
				}
				
				else if(gotSingleCloud)
				{
					sky = getCloud(data.sky_condition);
				}
				
				else
				{
					sky = 'Missing';
				}
			}
			
			else
			{
				sky = 'Missing';
			}
			
			if(mode === 'weather')
			{
				info = [
					'**Observed:** '	+ (data.observation_time ? convert.toHumanTime(data.observation_time) : 'Missing'),
					'**Wind:** '		+ (data.wind_dir_degrees && data.wind_speed_kt ? data.wind_dir_degrees + '\u00B0/' + convert.toCompass(parseInt(data.wind_dir_degrees), 10) + ' @ ' + data.wind_speed_kt + 'kts' + (data.wind_gust_kt ? '; gusts @ ' + data.wind_gust_kt + 'kts' : '') : 'Missing'),
					'**Visibility:** '	+ (data.visibility_statute_mi ? data.visibility_statute_mi + 'mi/' + convert.toKilometres(parseFloat(data.visibility_statute_mi)) + 'km' : 'Missing'),
					'**Clouds:** '		+ sky,
					'**Temperature:** '	+ (data.temp_c ? data.temp_c + '\u00B0C/' + convert.toFahrenheit(parseFloat(data.temp_c)) + '\u00B0F' : 'Missing'),
					'**Dewpoint:** '	+ (data.dewpoint_c ? data.dewpoint_c + '\u00B0C/' + convert.toFahrenheit(parseFloat(data.dewpoint_c)) + '\u00B0F' : 'Missing'),
					'**Pressure:** '	+ (data.altim_in_hg ? parseFloat(data.altim_in_hg).toFixed(2) + '" Hg/' + convert.toMillibars(parseFloat(data.altim_in_hg)) + 'mb' : 'Missing'),
					'**Conditions:** '	+ (data.flight_category || 'Missing')
				];
			}
			
			var	text = {
				weather:	resp.airport.name + ' \u2022 ' + info.join(' \u2022 '),
				metar:		data.metar_type + ' ' + data.raw_text,
				taf:		data.raw_text
			};
			
			var	output = '**' + link + ':** ' + text[mode],
				length = ':1234567890 '.length + output.length;
			
			args.directreply(length < 500 ? output : 'Sorry, the weather report retreived exceeded the maximum allowed length - try `!!metar ' + query + '` instead (CC: @DannyBeckett)');
		}
	}
};
	
bot.addCommand({
	name:			'weather',
	fun:			weather.weather,
	description:	'Retrieves the translated METAR weather data for a specified 3-letter IATA or 4-letter ICAO airport code - e.g. `!!weather LPL` or `!!weather KJFK`',
	async:			true,
	permissions:	{
						del:	'NONE'
					}
});

bot.addCommand({
	name:			'metar',
	fun:			weather.metar,
	description:	'Retrieves the raw METAR weather data for a specified 3-letter IATA or 4-letter ICAO airport code - e.g. `!!metar LPL` or `!!metar KJFK`',
	async:			true,
	permissions:	{
						del:	'NONE'
					}
});

bot.addCommand({
	name:			'taf',
	fun:			weather.taf,
	description:	'Retrieves the raw TAF weather data for a specified 3-letter IATA or 4-letter ICAO airport code - e.g. `!!taf LPL` or `!!taf KJFK`',
	async:			true,
	permissions:	{
						del:	'NONE'
					}
});
