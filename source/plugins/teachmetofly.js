// GitHub shows bad indentation - open with Notepad++

var teachmetofly = {

	// Do NOT change the order of these - that means no adding in the middle, or deleting!
	// This way, !!TeachMeToFly 42 will always link to the same lesson
	
	tidbits: [
		"Don't forget to lower the landing gear before landing!",
		"Keep the shiny side up!",
		"Right rudder!",
		"Push forward: buildings get bigger. Pull back: buildings get smaller. Pull back harder: buildings get bigger again.",
		"Aviate, Navigate, Communicate, in that order!",
		"There are old pilots, and there are bold pilots, but there are no old bold pilots!",
		"If a pilot screws up, the pilot dies; if ATC screws up, the pilot dies.",
		"The likelihood of surviving a crash is inversely proportional to the angle of arrival.",
		"Small mountains will kill you just as dead as big ones.",
		"A superior pilot is one who uses his superior judgement so that he does not have to use his superior skills.",
		"Takeoffs are optional. Landings are mandatory.",
		"To land: Airspeed, Centerline, PAPI *(repeat)*",
		"The propeller is just a giant fan to keep the pilot cool; if it stops, the pilot starts sweating!",
		"With a mile of road, a car can go a mile; with a mile of track, a train can go a mile; with a mile of river, a boat can go a mile; But with a mile of runway, an airplane can go *anywhere*!",
		"A super cub is the safest airplane.  It can just barely kill you.",
		"The only things an FO should say on his first day are V1, gear up, and I'll take the fat one.",
		"What's the difference between a fighter pilot and his aircraft? The plane stops whining when you shut down the engines.",
		"What's the difference between God and a fighter pilot? God doesn't think he's a fighter pilot.",
		"You've never been lost until you've been lost at Mach 3.",
		"The only time you have too much fuel is when you're on fire.",
		"When one engine fails on a twin-engine airplane you always have enough power left to get you to the scene of the crash.",
		"Never trade luck for skill.",
		'The three most common last words in aviation are: "Why is it doing that?", "Where are we?" and "Oh Shit!"',
		"Weather forecasts are horoscopes with numbers.",
		"Airspeed, altitude and brains. Two are always needed to successfully complete the flight.",
		"Flashlights are tubular metal containers kept in a flight bag for the purpose of storing dead batteries",
		"If your flight is going remarkably well, you obviously forgot something.",
		"If you crash because of weather, your funeral will be held on a sunny day.",
		"When a crash seems inevitable, endeavor to strike the softest, cheapest object in the vicinity as slowly and gently as possible.",
		"Never fly in the same cockpit with someone braver than you.",
		"There is no reason to fly through a thunderstorm in peacetime.",
		"You know that your landing gear is up and locked when it takes full power to taxi to the terminal.",
		"Try to stay in the middle of the air. Do not go near the edges of it. The edges of the air can be recognized by the appearance of ground, buildings, sea, trees and interstellar space. It is much more difficult to fly there.",
		"Don't kill yourself to save the plane. The plane is there to save the pilot.",
		"Speed is life; altitude is insurance.",
		"Good judgment comes from experience; experience comes from bad judgment!",
		"I am serious, and please don't call me Shirley!",
		"Co-pilot checklist: *1.* Don't touch anything. *2.* Shut up *3.* Repeat",
		"It is always better to be on the ground wishing you were up in the air, than up in the air wishing you were on the ground!",
		'"We\'re not happy until you\'re not happy" - Motto of the FAA',
		"Pilots talk about women when flying, and flying when with women.",
		"Some pilots will declare an emergency for high oil pressure. Others, upon losing a wing, will ask for a lower altitude.",
		"In order to be legal, the weight of the paperwork must equal the weight of the aircraft."
	],
	
	command: function(args, cb)
	{
		var	total = teachmetofly.tidbits.length,
			lesson,
			output;
		
		if(args.toString().length > 0)
		{
			var selected = parseInt(args, 10);
			
			if(selected >= 1 && selected <= total)
			{
				lesson = selected;
				output = selected - 1;
			}
			
			else
			{
				args.directreply('You must choose a number between 1 - ' + total + ' (or omit the number entirely).');
				return;
			}
		}
		
		else
		{
			var random = Math.floor(Math.random() * total);
			
			lesson = random + 1;
			output = random;
		}
		
		args.send('**Lesson #' + lesson + '**: ' + teachmetofly.tidbits[output]);
	}
};
	
bot.addCommand({
	name:			'teachmetofly',
	fun:			teachmetofly.command,
	description:	'Retrieves a random tip, or a specific lesson!',
	async:			false,
	permissions:	{
						del:	'NONE'
					}
});

bot.addCommand({
	name:			'lesson',
	fun:			teachmetofly.command,
	description:	'Retrieves a random tip, or a specific lesson!',
	async:			false,
	permissions:	{
						del:	'NONE'
					}
});
