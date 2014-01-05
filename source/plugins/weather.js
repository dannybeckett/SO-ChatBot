var convert = {
	toFahrenheit: function(celcius)
	{
		return celcius * 9 / 5 + 32;
	},
	
	toKilometres: function(miles)
	{
		return miles * 1.609344;
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
	},
	
	toCompass: function(degrees)
	{
		if(degrees >= 0 && degrees <= 11.25)
		{
			return 'N';
		}

		else if(degrees > 11.25 && degrees <= 33.75)
		{
			return 'NNE';
		}

		else if(degrees > 33.75 && degrees <= 56.25)
		{
			return 'NE';
		}

		else if(degrees > 56.25 && degrees <= 78.75)
		{
			return 'ENE';
		}

		else if(degrees > 78.75 && degrees <= 101.25)
		{
			return 'E';
		}

		else if(degrees > 101.25 && degrees <= 123.75)
		{
			return 'ESE';
		}

		else if(degrees > 123.75 && degrees <= 146.25)
		{
			return 'SE';
		}

		else if(degrees > 146.25 && degrees <= 168.75)
		{
			return 'SSE';
		}

		else if(degrees > 168.75 && degrees <= 191.25)
		{
			return 'S';
		}

		else if(degrees > 191.25 && degrees <= 213.75)
		{
			return 'SSW';
		}

		else if(degrees > 213.75 && degrees <= 236.25)
		{
			return 'SW';
		}

		else if(degrees > 236.25 && degrees <= 258.75)
		{
			return 'WSW';
		}

		else if(degrees > 258.75 && degrees <= 281.25)
		{
			return 'W';
		}

		else if(degrees > 281.25 && degrees <= 303.75)
		{
			return 'WNW';
		}

		else if(degrees > 303.75 && degrees <= 326.25)
		{
			return 'NW';
		}

		else if(degrees > 326.25 && degrees <= 348.75)
		{
			return 'NNW';
		}

		else if(degrees > 348.75 && degrees <= 360)
		{
			return 'N';
		}
	}
};

var weather = {
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
				gotClouds = data.sky_condition.hasOwnProperty('@attributes');
			
			if(gotmultipleClouds)
			{
				sky = 'found ' + data.sky_condition.length + ' clouds';
			}
			
			else if(gotClouds)
			{
				sky = convert.toClouds(data.sky_condition['@attributes'].sky_cover);
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
					'**(not functional) Sky:** '	+ sky,
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
