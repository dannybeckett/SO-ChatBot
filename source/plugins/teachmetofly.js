var teachmetofly = {
	tidbits: [
		"Don't forget to lower the landing gear before landing!",
		"Keep the shiny side up!",
		"Right rudder!",
		"Push forward: buildings get bigger. Pull back: buildings get smaller.",
		"Aviate, Navigate, Communicate, in that order!",
		"There are old pilots, and there are bold pilots, but there are no old bold pilots!",
		"If a pilot screws up, the pilot dies; if ATC screws up, the pilot dies."
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
