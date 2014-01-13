// GitHub shows bad indentation - open with Notepad++

var teachmetofly = {
	tidbits: [
		"Don't forget to lower the landing gear before landing!",
		"Keep the shiny side up!",
		"Right rudder!",
		"Push forward: buildings get bigger. Pull back: buildings get smaller. Pull back harder: buildings get bigger again.",
		"Aviate, Navigate, Communicate, in that order!",
		"There are old pilots, and there are bold pilots, but there are no old bold pilots!",
		"If a pilot screws up, the pilot dies; if ATC screws up, the pilot dies.",
        	"Likelihood of surviving a crash is inversely proportional to angle of arrival.",
        	"Small mountains will kill you just as dead as big ones.",
        	"A superior pilot is one who uses his superior judgement so that he does not have to use his superior skills.",
		"Takeoffs are optional. Landings are mandatory.",
		"To land: Airspeed, Centerline, PAPI *(repeat)*",
		"The propeller is just a giant fan to keep the pilot cool; if it stops, the pilot starts sweating!",
        	"Give me a mile of road and I can go a mile.  Give me a mile of runway and I can go anywhere.",
        	"A super cub is the safest airplane.  It can just barely kill you.",
        	"The only things an FO should say on his first day are V1, gear up, and I'll take the fat one.",
        	"Whats the difference between a fighter pilot and his aircraft? The plane stops whining when you shut down the engines.",
        	"Q: What's the difference between God and a fighter pilot? A: God doesn't think he's a fighter pilot.",
        	"You've never been lost until you've been lost at Mach 3.",
        	"The only time you have too much fuel is when you're on fire.",
        	"When one engine fails on a twin-engine airplane you always have enough power left to get you to the scene of the crash.",
        	"Never trade luck for skill.",
        	"The three most common last words in aviation are: 'Why is it doing that?', 'Where are we?' and 'Oh Shit!'",
        	"Weather forecasts are horoscopes with numbers.",
       		"Airspeed, altitude and brains. Two are always needed to successfully complete the flight.",
        	"Flashlights are tubular metal containers kept in a flight bag for the purpose of storing dead batteries",
        	"When a flight is proceeding incredibly well, something has been forgotten.",
        	"If you crash because of weather, your funeral will be held on a sunny day.",
        	"When a crash seems inevitable, endeavor to strike the softest, cheapest object in the vicinity as slowly and gently as possible.",
        	"Never fly in the same cockpit with someone braver than you.",
       		"There is no reason to fly through a thunderstorm in peacetime.",
        	"The three best things in life are a good landing, a good orgasm, and, a good bowel movement. The night carrier landing is one of the few opportunities in life where you get to experience all three at the same time.",
        	"You know that your landing gear is up and locked when it takes full power to taxi to the terminal.",
        	"Try to stay in the middle of the air. Do not go near the edges of it. The edges of the air can be recognized by the appearance of ground, buildings, sea, trees and interstellar space. It is much more difficult to fly there.",
        
        
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
