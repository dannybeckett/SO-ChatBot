(function () {
"use strict";

var weather = {
	city : function ( city, cb ) {
		IO.jsonp({
			url : 'http://dannybeckett.co.uk/AviationBot/Weather.php',
			jsonpName : 'callback',
			data : {
				a : city
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
		/*var ret = bot.adapter.link(
				data.name, 'http://openweathermap.org/city/' + data.id
			) + ': ';

		return ret;*/
		return data.data.METAR.raw_text;
	}
};

function weatherCommand ( args ) {
	if ( args.content ) {
		weather.city( args.content, args.reply.bind(args) );
	}
	else {
		return 'See `/help weather` for usage info';
	}
}

bot.addCommand({
	name : 'weather',
	fun : weatherCommand,
	permissions : {
		del : 'NONE'
	},
	async : true,

	description : 'Gets current weather: ' +
		'`/weather ICAO`'
});
}());
