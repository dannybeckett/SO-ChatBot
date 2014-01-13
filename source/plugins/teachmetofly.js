// GitHub shows bad indentation - open with Notepad++

var teachmetofly = {
	tidbits: [
		"Don't forget to lower the landing gear before landing!",
		"Keep the shiny side up!",
		"Right rudder!",
		"Push forward: buildings get bigger. Pull back: buildings get smaller.",
		"Aviate, Navigate, Communicate, in that order!",
		"There are old pilots, and there are bold pilots, but there are no old bold pilots!",
		"If a pilot screws up, the pilot dies; if ATC screws up, the pilot dies.",
		"Takeoffs are optional. Landings are mandatory.",
		"To land: Airspeed, Centerline, PAPI *(repeat)*",
		"The propeller is just a giant fan to keep the pilot cool; if it stops, the pilot starts sweating!",
	],
	
	command: function(args, cb)
	{
		var random = Math.floor(Math.random() * teachmetofly.tidbits.length);
		
		args.send('**Lesson #' + (random + 1) + '**: ' + teachmetofly.tidbits[random]);
	}
};
	
bot.addCommand({
	name:			'teachmetofly',
	fun:			teachmetofly.command,
	description:	'Retrieves a random tip!',
	async:			false,
	permissions:	{
						del:	'NONE'
					}
});
