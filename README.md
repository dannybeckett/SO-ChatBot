This is the bot that lives in [The Hangar](http://chat.stackexchange.com/rooms/12036/the-hangar) - for more info, ping [@DannyBeckett](http://aviation.stackexchange.com/users/97/danny-beckett).

I've deleted some commands that were specific to programming, or just unnecessary: `awsm colors cowsay domain firefly github hangman jquery mdn mustache norris stop urban vendetta xkcd zalgo`

Ping me with ideas for new commands! Here are some that have been suggested:

- Aerodrome data - airnav or worldaerodata.com
- [Weather frequencies & phone numbers](https://www.faa.gov/air_traffic/weather/asos/)

So far, using a 4-character ICAO airport code, you can try:

- `!!weather KJFK` to get English weather info
- `!!metar KJFK` to get raw METAR data

You can check out the source code for the above commands at [./source/plugins/weather.js](https://github.com/dannybeckett/SO-ChatBot/blob/master/source/plugins/weather.js)

A couple of small PHP scripts ([../so-chatbot-php-helper](https://github.com/dannybeckett/so-chatbot-php-helper)) aid in converting XML to JSONP for use in JS.

I've also edited [./source/adapter.js](https://github.com/dannybeckett/SO-ChatBot/commit/d257d954f405f194670a24b59d781c974fffaf0e) to be slightly more helpful.
