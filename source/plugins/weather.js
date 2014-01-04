(function () {
"use strict";

var weather = {
	icao : function ( icao, cb ) {
		IO.xhr({
			url : 'http://aviationweather.gov/adds/dataserver_current/httpparam',
			jsonpName : 'callback',
			data : {
				dataSource:	'metars',
				requestType:	'retrieve',
				format:		'xml',
				stationString:	icao,
				hoursBeforeNow:	4
			},

			fun : this.finishCb( cb ),
			error : this.errorCb( cb )
		});
	},

	finishCb : function ( cb ) {
		var self = this;

		return function ( resp ) {
			cb( self.format(resp) );
		};
	},
	
	errorCb : function ( cb ) {
		return cb;
	},

	format : function ( resp ) {
		var main = resp.main;

		if ( !main ) {
			console.error( resp );
			return 'Sorry, I couldn\'t get the data: ' + resp.message;
		}

		return this.formatter( resp );
	},
	
	formatter : function ( data ) {
		ret =
			bot.adapter.link(
				data.name, 'http://aviationweather.gov/adds/metars/?station_ids=' + data.id + '&std_trans=translated&chk_metars=on&hoursStr=most+recent+only&submitmet=Submit'
			) + ': ' + data.main;

		return ret;
	}
};

function weatherCommand ( args ) {
	if ( args.content ) {
		weather.icao( args.content, args.reply.bind(args) );
	}
	else {
		return 'You must specify an ICAO airport name - e.g. `!!weather PHTO`';
	}
}

bot.addCommand({
	name : 'weather',
	fun : weatherCommand,
	permissions : {
		del : 'NONE'
	},
	async : true,
	description : 'Gets current METAR weather data for a specified ICAO airport: ' +
		'`/weather PHTO`'
});
}());
