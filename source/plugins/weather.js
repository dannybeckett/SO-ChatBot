(function () {
"use strict";

	var weather = {
		icao: function(icao, cb) {
			IO.xhr({
				url: 'http://aviationweather.gov/adds/dataserver_current/httpparam',
				data: {
					dataSource:		'metars',
					requestType:	'retrieve',
					format:			'xml',
					stationString:	icao,
					hoursBeforeNow:	'4'
				},
				complete: this.finishCb(data, cb)
			});
		},

		finishCb : function(data, cb) {
			return bot.adapter.link(data.stationString, 'http://aviationweather.gov/adds/metars/?station_ids=' + data.stationString + '&std_trans=translated&chk_metars=on&hoursStr=most+recent+only&submitmet=Submit') + ': ';
		}
	};

	function weatherCommand(args) {
		if(!args.content)
		{
			return 'You must specify an ICAO airport name - e.g. `!!weather PHTO`';
		}
		
		weather.icao(args.content, args.reply.bind(args));
	}

	bot.addCommand({
		name:	'weather',
		fun:	weatherCommand,
		permissions: {
			del : 'NONE'
		},
		async: true,
		description: 'Gets current METAR weather data for a specified ICAO airport: `/weather PHTO`'
	});
}());
