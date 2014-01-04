(function () {
"use strict";

var message = "Welcome to Aviation chat! Feel free to jump in the conversation!";

function welcome ( name ) {
	return bot.adapter.reply( name ) + " " + message; ;
}

bot.addCommand({
	name : 'welcome',
	fun : function ( args ) {
		if (!args.length) {
			return message;
		}

		return args.send( welcome(args) );
	},
	permission : {
		del : 'NONE'
	},
	description : 'Welcomes a user. `/welcome user`'
});
}());
