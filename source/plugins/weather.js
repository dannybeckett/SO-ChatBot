(function () {
"use strict";

function command ( args, cb ) {
	IO.jsonp({
		url : 'http://dannybeckett.co.uk/AviationBot/Weather.php',
		jsonpName : 'callback',
		data : {
			a : args.toString()
		},
		fun : finish
	});

	function finish ( resp ) {
		args.reply( resp.data.METAR.raw_text );
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
