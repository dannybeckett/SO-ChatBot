(function () {

	function command ( args, cb ) {
		args.reply('Working...');
		
		IO.jsonp({
			url : 'http://dannybeckett.co.uk/AviationBot/Weather.php',
			jsonpName : 'callback',
			data : {
				a : 'PHTO' /*args.toString()*/
			},
			fun : finish
		});
	
		function finish ( resp ) {
			args.reply( 'ok' /*resp.data.METAR.raw_text*/ );
		}
	}
	
	bot.addCommand({
		name : 'weather',
		fun : command,
		permissions : {
			del : 'NONE'
		},
	
		description : 'testing',
		async : true
	});

})();
