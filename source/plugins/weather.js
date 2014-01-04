var weather = {

	descrip: 'Retrieves the METAR weather data for a specified ICAO airport - e.g. `!!weather PHTO`',
	
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
