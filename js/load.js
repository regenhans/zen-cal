// Client ID from Developer Console, https://console.developers.google.com
//developement ID (testing)
var CLIENT_ID = '64593916339-5dda72dnh58548dqc6pitg0dm0608ljb.apps.googleusercontent.com';

//heroku
//var CLIENT_ID = '64593916339-ngnshl729pn27m0gpgih2ikcc13rkop1.apps.googleusercontent.com';
//var CLIENT_ID = '64593916339-p0vll5ijitdej20dk4h9h5pj5oif7p74.apps.googleusercontent.com';
//chrome ext
//var CLIENT_ID = '64593916339-cqb7679dfsildvuk0buu7shsh5glo28v.apps.googleusercontent.com';
var SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

// check if the user has autorized this app before
//checkauth(clientParams,callback)
function checkAuth() {
	gapi.auth.authorize(
		{
			'client_id': CLIENT_ID,
			'scope': SCOPES.join(' '),
			'immediate': true
		}, handleAuthResult);
}

// Handle response from authorization server.
function handleAuthResult(authResult) {
	var authorizeDiv = document.getElementById('authorize-div');
	if (authResult && !authResult.error) {
		// Hide auth UI, then load client library.
		authorizeDiv.style.display = 'none';
		loadCalendarApi();
	} else {
		// Show auth UI, allowing the user to initiate authorization by
		// clicking authorize button.
		authorizeDiv.style.display = 'inline';
	}
}

// Initiate auth flow in response to user clicking authorize button.
function handleAuthClick(event) {
	gapi.auth.authorize(
		{client_id: CLIENT_ID, scope: SCOPES, immediate: false},
		handleAuthResult);
	return false;
}

// Load Google Calendar API.
function loadCalendarApi() {
	gapi.client.load('calendar', 'v3', listUpcomingEvents)
}

//request the last 10 events object
function listUpcomingEvents() {
	var request = gapi.client.calendar.events.list({
		'calendarId': 'primary',
		'timeMin': new Date().toISOString(),
		'showDeleted': false,
		'singleEvents': true,
		'maxResults': 10,
		'orderBy': 'startTime'
	});
	// what to do with the response
	request.execute(function(resp) {

		// the last 10 events
		var events = resp.items;
		console.log(resp.items)


		//get just the events for today and tomorrow


		if(events.length){
			for (var i = 0; i < events.length; i++) {
				var event = events[i],
					when  = moment(event.start.dateTime),
					date = when.format('l'),
					today = moment(new Date()).format('l'),
					tomorrow = moment(new Date()).add(1, 'days').format('l'),
					eventdesc = event.summary,
					day = moment(when).calendar(),
					hour = moment(when).format('H[.]mm'),
					location = event.location

				if (!when) {
					when = moment(event.start.date).format('l')
				}
				if(date === today){
					addToStream(eventdesc, hour, location, day)
				}
				else if (date === tomorrow) {
					addToStream(eventdesc, hour, location, day)
				}
				else{
					console.log('other day');
				}
			}
		}

		//format each event and add it to stream
		// if (events.length) {
		// 	for (i = 0; i < events.length; i++) {
		// 		var event = events[i],
		// 		when = event.start.dateTime,
		// 		eventdesc = event.summary,
		// 		day = moment(when).calendar(),
		// 		hour = moment(when).format('H[.]mm'),
		// 		location = event.location
		// 		console.log(day)
		//
		//
		// 		//correction for all-day events
		// 		if (!when) {
		// 			when = event.start.date
		// 		}
		// 		addToStream(eventdesc, hour, location, day)
		// 	}
		// } else {
		// 	appendPre('No upcoming events found.')
		// }

	});
}



//function to format the info and append it to the site
function addToStream(eventDescription, dateTime, location, day){

	var div = document.createElement('div'),
		hourdiv = document.createElement('div'),
		descdiv = document.createElement('div'),
		descText = document.createTextNode(eventDescription),
		timeText = document.createTextNode(dateTime),
		calendarDay = document.createTextNode(day),
		pre = document.getElementById('output'),
		locationText,
		dateLocationDiv = document.createElement('div');

	dateLocationDiv.className += "date-location"
	div.className += "event"
	hourdiv.className += "hourdiv"
	descdiv.className += "descdiv"
	hourdiv.appendChild(timeText)
	descdiv.appendChild(descText)
	dateLocationDiv.appendChild(calendarDay)

	div.appendChild(hourdiv)
	div.appendChild(descdiv)
	div.appendChild(dateLocationDiv)

	//handdle location
	if(location){
		locationText = document.createTextNode(" @"+location.split('\n')[0])
		dateLocationDiv.appendChild( locationText)
	}

	pre.appendChild(div)
}
