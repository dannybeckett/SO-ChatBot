(function () {

	function command ( args, cb ) {
		// args.reply('Working...');
		
		IO.jsonp({
			url : 'http://dannybeckett.co.uk/AviationBot/Weather.php',
			jsonpName : 'callback',
			data : {
				a : args.toString()
			},
			fun : finish
		});
	
		function finish ( resp ) {
			args.reply(resp.data.METAR.raw_text);
		}
	}
	
	bot.addCommand({
		name : 'weather',
		fun : command,
		permissions : {
			del : 'NONE'
		},
	
		description : 'Retrieves the METAR weather data for a specified ICAO airport - e.g. !!weather PHTO',
		async : true
	});

})();
