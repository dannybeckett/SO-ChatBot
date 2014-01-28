// GitHub shows bad indentation - open with Notepad++

var ntsb = {
	ntsb: function(args, cb)
	{
		ntsb.command(args, cb);
	},
	
	command: function(args, cb)
	{
		var	query = args.toString().toUpperCase();
                var     mode  = 't'; // Default mode - Tail Number
		
		if(!query)
		{
			args.directreply('You must specify an event date (MM/DD/YYYY), Tail number, or NTSB file number (prefixed with #)');
			return;
		}

		if (query.match(/\d{1,2}\/\d{1,2}\/\d{4}/) != null) {
			mode='d';			// Accident Date
		} else if (query.match(/^#/) != null) {
			mode = 'f';			// NTSB File Number
			query = query.substring(1);	// Strip leading "#"
		}
		
		IO.jsonp({
			url:		'http://dannybeckett.co.uk/AviationBot/Commands/NTSB.php',
			jsonpName:	'callback',
			fun:		finish,
			data:		{
						mode:	mode,
						q:	query,
					}
		});
	
		function finish(resp)
		{
			// These errors are generated directly by NTSB.php
			if(resp.hasOwnProperty('error'))
			{
				// TODO: Build a more complete error list...
				var errors = {
					'BadParams':	'Whoops, something went wrong! (CC: @DannyBeckett)',
					'NoSQL':		'Sorry, our database is currently down; You are going to have to [search the main NTSB database yourself](http://www.ntsb.gov/aviationquery/index.aspx) (CC: @DannyBeckett)',
					'NoFile':		'No data could be found for ' + query + '! Check the date, file number, or tail number you entered.',
				};
				
				args.directreply(errors[resp.error]);
				return;
			}
			
			// TODO: Build reasonable "output" from resp
			var output;
			output = resp.raw_text;
			
			args.send(output);
			
		}
	}
};
	
bot.addCommand({
	name:			'ntsb',
	fun:			ntsb.ntsb,
	description:	'Retrieves NTSB accident information for a specified date (MM/DD/YYYY), File ID (#file), or tail number',
	async:			true,
	permissions:	{
				del:	'NONE'
			}
});
