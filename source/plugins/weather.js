(function () {

	function command(args, cb)
	{
		IO.jsonp({
			url:		'http://dannybeckett.co.uk/AviationBot/Weather.php',
			jsonpName:	'callback',
			fun:		finish,
			data:		{
						a : args.toString()
					}
		});
	
		function finish(resp)
		{
			args.reply(resp.data.METAR.raw_text);
		}
	}
	
	bot.addCommand({
		name:		'weather',
		fun:		command,
		description:	'Retrieves the METAR weather data for a specified ICAO airport - e.g. !!weather PHTO',
		async:		true,
		permissions:	{
					del:	'NONE'
				}
	});

})();
