var func = function(args) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'http://aviationweather.gov/adds/dataserver_current/httpparam?dataSource=metars&requestType=retrieve&format=xml&stationString=' + args.parse() + '&hoursBeforeNow=4', true);
	
	xhr.onreadystatechange = function(args) {
		if(xhr.readyState === 4 && xhr.status === 200) {
			var xml = xhr.responseXML;
			args.send(xml.getElementsByTagName('response')[0].getElementsByTagName('data')[0].getElementsByTagName('METAR')[0].getElementsByTagName('raw_text')[0].textContent);
		}
	};
	
	xhr.send();
};

bot.addCommand({
	name:			'weather2',
	description:	'Retreives METAR data for a specified ICAO airport',
	fun:			func,
	async:			true,
	permissions:	{
						use:	'ALL',
						del:	'NONE'
					}
});
