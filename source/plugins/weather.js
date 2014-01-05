var weather = {

	descrip: 'Retrieves the METAR weather data for a specified ICAO airport - e.g. `!!weather KJFK` or `!!weather EGGP`',
	
	command: function(args, cb)
	{
		var	icao = args.toString(),
			link = bot.adapter.link(icao, 'http://aviationweather.gov/adds/metars/?station_ids=' + icao + '&std_trans=translated&chk_metars=on&hoursStr=most+recent+only&chk_tafs=on&submitmet=Submit');
		
		if(!icao)
		{
			args.directreply(weather.descrip);
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
			
			args.directreply(resp.data.METAR.raw_text);
		}
	}
};
	
bot.addCommand({
	name:		'weather',
	fun:		weather.command,
	description:	weather.descrip,
	async:		true,
	permissions:	{
				del:	'NONE'
			}
});
