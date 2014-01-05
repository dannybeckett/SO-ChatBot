/* To do:

 * Human time for Observed at
 * QC flags
 * -us, -uk, -eu

*/

var convert = {
	toFahrenheit: function(celcius)
	{
		return celcius * 9 / 5 + 32;
	},
	
	toKilometres: function(miles)
	{
		return miles * 1.609344;
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
			FEW:	'Few clouds',
			SCT:	'Scattered clouds',
			BKN:	'Broken clouds',
			OVC:	'Overcast',
			OVX:	'Obscured'
		}[abbreviation];
	}
},

weather = {
	metar: function(args, cb)
	{
		weather.command(args, cb, 'metar');
	},
	
	weather: function(args, cb)
	{
		weather.command(args, cb, 'weather');
	},
	
	command: function(args, cb, mode)
	{
		var	icao = args.toString().toUpperCase(),
			link = bot.adapter.link(icao, 'http://aviationweather.gov/adds/metars/?station_ids=' + icao + '&std_trans=translated&chk_metars=on&hoursStr=most+recent+only&chk_tafs=on&submitmet=Submit');
		
		if(!icao)
		{
			args.directreply('You must specify an ICAO airport code - e.g. `!!' + mode + ' KJFK` or `!!' + mode + ' EGGP`');
		}
		
		IO.jsonp({
			url:		'http://dannybeckett.co.uk/AviationBot/Weather.php',
			jsonpName:	'callback',
			fun:		finish,
			data:		{
							a:	icao
						}
		});
	
		function finish(resp)
		{
			if(resp.data['@attributes'].num_results === '0')
			{
				args.directreply('No METAR data could be found within the last 24 hours for ' + link + '! Check you input the correct ICAO code.')
			}
			
			var data = resp.data.METAR,
				info = [],
				sky,
				gotmultipleClouds = data.sky_condition instanceof Array;
				gotSingleCloud = data.sky_condition.hasOwnProperty('@attributes');
			
			var getCloud = function(conditions)
			{
				var ret = convert.toClouds(conditions['@attributes'].sky_cover);
				
				if(conditions['@attributes'].hasOwnProperty('cloud_base_ft_agl'))
				{
					ret += ' @ ' + conditions['@attributes'].cloud_base_ft_agl.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + 'ft AGL';
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
				sky = 'Unavailable';
			}
			
			if(mode === 'weather')
			{
				info = [
													data.flight_category,
					'**Observed at:** '				+ data.observation_time,
					'**Wind:** '					+ data.wind_dir_degrees + '\u00B0/' + convert.toCompass(parseInt(data.wind_dir_degrees), 10) + ' @ ' + data.wind_speed_kt + 'kts',
					'**Visibility:** '				+ data.visibility_statute_mi + 'mi/' + convert.toKilometres(parseFloat(data.visibility_statute_mi)).toFixed(2) + 'km',
					'**Sky:** '						+ sky,
					'**Temperature:** '				+ data.temp_c + '\u00B0C/' + convert.toFahrenheit(parseFloat(data.temp_c)).toFixed() + '\u00B0F',
					'**Dewpoint:** '				+ data.dewpoint_c + '\u00B0C/' + convert.toFahrenheit(parseFloat(data.dewpoint_c)).toFixed() + '\u00B0F',
					'**Pressure (altimeter):** '	+ parseFloat(data.altim_in_hg).toFixed(2) + '" Hg/' + (parseFloat(data.altim_in_hg) * 33.86).toFixed().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + 'mb'
				];
			}
			
			var text = {
				metar:		data.raw_text.substring(4),
				weather:	info.join(' \u2022 ')
			};
			
			args.directreply('**' + link + ':** ' + text[mode]);
		}
	}
};
	
bot.addCommand({
	name:			'weather',
	fun:			weather.weather,
	description:	'Retrieves the translated METAR weather data for a specified ICAO airport - e.g. `!!weather KJFK` or `!!weather EGGP`',
	async:			true,
	permissions:	{
						del:	'NONE'
					}
});

bot.addCommand({
	name:			'metar',
	fun:			weather.metar,
	description:	'Retrieves the standard METAR weather data for a specified ICAO airport - e.g. `!!metar KJFK` or `!!metar EGGP`',
	async:			true,
	permissions:	{
						del:	'NONE'
					}
});
