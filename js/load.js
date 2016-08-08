// Client ID from Developer Console, https://console.developers.google.com
//developement ID (testing)
//var CLIENT_ID = '64593916339-5dda72dnh58548dqc6pitg0dm0608ljb.apps.googleusercontent.com';

//heroku
var CLIENT_ID = '64593916339-ngnshl729pn27m0gpgih2ikcc13rkop1.apps.googleusercontent.com';
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
		var events = resp.items,
			todayEvents = [];

		console.log(resp);

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

					console.log(when)
					console.log(eventdesc)
				//dates for all-day events
				if (!when) {
					when = moment(event.start.date).format('l')
				}

				if (date != today) {
					todayEvents.push(1)
				}

				if(date === today){
					addToAgenda(eventdesc, hour, location, day, true)
				}
				else if (date === tomorrow) {
					addToAgenda(eventdesc, hour, location, day, false)
				}
			}//end for

			// add a happy message if no more events for the day found
			if(todayEvents.length){
				var disDiv = document.getElementById('todayanchor')
					noEventsDiv = document.getElementById('noevents')
				disDiv.className += " done"
				noEventsDiv.innerHTML = "(No more events today)"
				console.log(disDiv)
			}


		}



	});
}

function addToAgenda(eventDescription, dateTime, location, day, istoday){

	var div = document.createElement('div'),
		hourdiv = document.createElement('div'),
		descdiv = document.createElement('div'),
		eventDiv = document.createElement('div'),
		descText = document.createTextNode(eventDescription),
		timeText = document.createTextNode(dateTime),
		calendarDay = document.createTextNode(day),
		pre,
		locationText,
		dateLocationDiv = document.createElement('div');

	if(istoday){
		pre = document.getElementById('today')
	}else{
		pre = document.getElementById('tomorrow')
	}

	eventDiv.className += "eventdiv"
	dateLocationDiv.className += "date-location"
	div.className += "event wow"
	hourdiv.className += "hourdiv"
	descdiv.className += "descdiv"


	hourdiv.appendChild(timeText)
	descdiv.appendChild(descText)
	// dateLocationDiv.appendChild(calendarDay)

	div.appendChild(hourdiv)
	eventDiv.appendChild(descdiv)
	eventDiv.appendChild(dateLocationDiv)
	div.appendChild(eventDiv)

	//handdle location
	if(location){
		locationText = document.createTextNode(" @"+location.split('\n')[0])
		dateLocationDiv.appendChild( locationText)
	}

	pre.appendChild(div)
}
