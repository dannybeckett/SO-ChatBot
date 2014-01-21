// GitHub shows bad indentation - open with Notepad++

var distance = {
	command: function(args, cb)
	{
		var	query = args.toString().toUpperCase().split(' ');
		
		if(!query || query.length !== 2 || (query[0].length !== 3 && query[0].length !== 4) || (query[1].length !== 3 && query[1].length !== 4))
		{
			args.directreply('You must specify two 3-letter IATA or 4-letter ICAO airport codes - e.g. `!!distance LPL KJFK`');
			return;
		}
		
		IO.jsonp({
			url:		'http://dannybeckett.co.uk/AviationBot/Commands/Distance.php',
			jsonpName:	'callback',
			fun:		finish,
			data:		{
							a1:	query[0],
							a2:	query[1]
						}
		});
	
		function finish(resp)
		{
			// These errors are generated directly by Distance.php
			if(resp.hasOwnProperty('error'))
			{
				var errors = {
					'BadParams':	'Whoops, something went wrong! (CC: @DannyBeckett)',
					'NoSQL':		'Sorry, our database is currently down; distances cannot currently be retrieved. (CC: @DannyBeckett)',
					'NoMatch1':		'No matching airport could be found for the code ' + query[0] + '! Check you typed the correct 3-letter IATA code or 4-letter ICAO code.',
					'NoMatch2':		'No matching airport could be found for the code ' + query[1] + '! Check you typed the correct 3-letter IATA code or 4-letter ICAO code.'
				};
				
				args.directreply(errors[resp.error]);
				return;
			}
			
			var time = {
				cessna: parseInt((resp.distance_km/230).toFixed(), 10),
				airbus: parseInt((resp.distance_km/902).toFixed(), 10)
			};
			
			var output = [
				resp.airport1 + ' - ' + resp.airport2,
				(time.cessna === 0 ? '<1' : time.cessna) + ' hour' + (time.cessna <= 1 ? '' : 's') + ' by Cessna Skyhawk' + ' \u2022 ' + (time.airbus === 0 ? '<1' : time.airbus) + ' hour' + (time.airbus <= 1 ? '' : 's') + ' by Airbus A380',
				convert.formatNumber(resp.distance_km.toFixed()) + 'km \u2022 ' + convert.toMiles(resp.distance_km) + 'mi \u2022 ' + convert.toNauticalMiles(resp.distance_km) + 'nm'
			].join('\n');
			
			var	length = /*':1234567890 '.length +*/ output.length;
						// Used for args.directreply()
			
			if(length < 500)
			{
				args.send(output);
			}
			
			else
			{
				args.directreply('Sorry, the distance report retreived exceeded the maximum allowed length. (CC: @DannyBeckett)');
			}
		}
	}
};
	
bot.addCommand({
	name:			'distance',
	fun:			distance.command,
	description:	'Retrieves the distance between two 3-letter IATA or 4-letter ICAO airport codes - e.g. `!!distance LPL AMS` or `!!distance MAN KJFK`',
	async:			true,
	permissions:	{
						del:	'NONE'
					}
});
