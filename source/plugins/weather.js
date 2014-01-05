var weather = {

	descrip: 'Retrieves the METAR weather data for a specified ICAO airport - e.g. `!!weather KJFK` or `!!weather EGGP`',
	
	command: function(args, cb)
	{
		var icao = args.toString();
		
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
			if(r.data['@attributes'].num_results === '0')
			{
				args.directreply('No METAR data could be found within the last 24 hours for ' + icao + '! Check you input the correct ICAO code.')
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
