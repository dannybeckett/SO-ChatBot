// GitHub shows bad indentation - open with Notepad++

var weather = {
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
		
		var sources = {
			'weather':	'adds',
			'metar':	'noaa',
			'taf':		'noaa'
		};
		
		IO.jsonp({
			url:		'http://dannybeckett.co.uk/AviationBot/Commands/Weather.php',
			jsonpName:	'callback',
			fun:		finish,
			data:		{
							a:	query,
							m:	mode.replace('weather', 'metar') + 's',
							s:	sources[mode]
						}
		});
	
		function finish(resp)
		{
			// These errors are generated directly by Weather.php
			if(resp.hasOwnProperty('error'))
			{
				var errors = {
					'BadParams':	'Whoops, something went wrong! (CC: @DannyBeckett)',
					'NoSQL':		'Sorry, our database is currently down; this means the 3-letter IATA code you entered cannot be converted to the required 4-letter ICAO code. Type its 4-letter ICAO code instead. (CC: @DannyBeckett)',
					'NoWeather':	'Sorry, http://aviationweather.gov is currently down; weather reports cannot currently be retrieved. Try `!!metar ' + query + '` instead (uses an alternate data source).',
					'NoFile':		'No data could be found for ' + query + '! Check you typed the correct 3-letter IATA or 4-letter ICAO airport code.',
					'NoICAO':		'No matching ICAO code could be found for the IATA code ' + query + '! Check you typed the correct 3-letter IATA code, or type its 4-letter ICAO code instead.'
				};
				
				args.directreply(errors[resp.error]);
				return;
			}
			
			var output;
			
			if(mode === 'weather')
			{
				// Weather.php appends "airport" to the JSON
				var code = (resp.airport.hasOwnProperty('iata') ? resp.airport.iata + '/' : '') + resp.airport.icao,
					link = bot.adapter.link(code, resp.airport[mode.replace('weather', 'metar')]);
				
				if(resp.data['@attributes'].num_results === '0')
				{
					args.directreply('No data could be found within the last 24 hours for ' + link + '! Try `!!metar ' + query + '` instead (uses an alternate data source), or check you typed the correct 3-letter IATA or 4-letter ICAO airport code.');
					return;
				}
				
				var data = resp.data.METAR || resp.data.TAF,
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
				
				var info = [
					'**Observed:** '	+ (data.observation_time ? convert.toHumanTime(data.observation_time) : 'Missing'),
					'**Wind:** '		+ (data.wind_dir_degrees && data.wind_speed_kt ? data.wind_dir_degrees + '\u00B0/' + convert.toCompass(parseInt(data.wind_dir_degrees), 10) + ' @ ' + data.wind_speed_kt + 'kts' + (data.wind_gust_kt ? '; gusts @ ' + data.wind_gust_kt + 'kts' : '') : 'Missing'),
					'**Visibility:** '	+ (data.visibility_statute_mi ? data.visibility_statute_mi + 'mi/' + convert.toKilometres(parseFloat(data.visibility_statute_mi)) + 'km' : 'Missing'),
					'**Clouds:** '		+ sky,
					'**Temperature:** '	+ (data.temp_c ? data.temp_c + '\u00B0C/' + convert.toFahrenheit(parseFloat(data.temp_c)) + '\u00B0F' : 'Missing'),
					'**Dewpoint:** '	+ (data.dewpoint_c ? data.dewpoint_c + '\u00B0C/' + convert.toFahrenheit(parseFloat(data.dewpoint_c)) + '\u00B0F' : 'Missing'),
					'**Pressure:** '	+ (data.altim_in_hg ? parseFloat(data.altim_in_hg).toFixed(2) + '" Hg/' + convert.toMillibars(parseFloat(data.altim_in_hg)) + 'mb' : 'Missing'),
					'**Conditions:** '	+ (data.flight_category || 'Missing')
				];
				
				output = '**' + link + ':** ' + resp.airport.name + ' \u2022 ' + info.join(' \u2022 ');
			}
			
			// mode !== 'weather'
			else
			{
				output = resp.raw_text;
			}
			
			var	length = /*':1234567890 '.length +*/ output.length;
						// Used for args.directreply()
			
			if(length < 500)
			{
				args.send(output);
			}
			
			else
			{
				args.directreply('Sorry, the weather report retreived exceeded the maximum allowed length - try `!!metar ' + query + '` instead (CC: @DannyBeckett)');
			}
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
