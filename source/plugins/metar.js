// Not sure why GitHub previews the indents wrongly; they look fine on the Edit page

var metar = {

	descrip: 'Retrieves the METAR weather data for a specified ICAO airport - e.g. `!!metar KJFK` or `!!metar EGGP`',
	
	command: function(args, cb)
	{
		var	icao = args.toString().toUpperCase(),
			link = bot.adapter.link(icao, 'http://aviationweather.gov/adds/metars/?station_ids=' + icao + '&std_trans=translated&chk_metars=on&hoursStr=most+recent+only&chk_tafs=on&submitmet=Submit');
		
		if(!icao)
		{
			args.directreply(metar.descrip);
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
	name:		'metar',
	fun:		metar.command,
	description:	metar.descrip,
	async:		true,
	permissions:	{
				del:	'NONE'
			}
});
