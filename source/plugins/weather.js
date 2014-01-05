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
		args.directreply(mode + ' - ' args);
		
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
			
			args.directreply(link + resp.data.METAR.raw_text.substring(4));
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
