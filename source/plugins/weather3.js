(function(){
	bot.stoplog = true;
	
	var weather3 = {
		command: function(args, cb)
		{
			bot.log('hello');
			
			IO.xhr({
				url:		'/http://aviationweather.gov/adds/dataserver_current/httpparam?dataSource=metars&requestType=retrieve&format=xml&stationString=' + args + '&hoursBeforeNow=4',
				method:		'GET',
				complete:	finish
			});

			function finish(resp, xhr)
			{
				if(xhr.status === 200)
				{
					bot.log('got a 200');
					return;
				}

				cb("test");
			}
		}
	};

	bot.addCommand({
		name:			'weather3',
		description:	'Retreives METAR data for a specified ICAO airport',
		fun:			weather3.command,
		async:			true,
		permissions:	{
							use:	'ALL',
							del:	'NONE'
						}
	});
}());
