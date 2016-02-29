     // Your Client ID can be retrieved from your project in the Google
      // Developer Console, https://console.developers.google.com
      //developement
      //var CLIENT_ID = '64593916339-5dda72dnh58548dqc6pitg0dm0608ljb.apps.googleusercontent.com';
      //dist
      //heroku
      var CLIENT_ID = '64593916339-ngnshl729pn27m0gpgih2ikcc13rkop1.apps.googleusercontent.com';
      //var CLIENT_ID = '64593916339-p0vll5ijitdej20dk4h9h5pj5oif7p74.apps.googleusercontent.com';
      //chrome ext
      //var CLIENT_ID = '64593916339-cqb7679dfsildvuk0buu7shsh5glo28v.apps.googleusercontent.com';
      var SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

      /**
       * Check if current user has authorized this application.
       */
      function checkAuth() {
        gapi.auth.authorize(
          {
            'client_id': CLIENT_ID,
            'scope': SCOPES.join(' '),
            'immediate': true
          }, handleAuthResult);
      }

      /**
       * Handle response from authorization server.
       *
       * @param {Object} authResult Authorization result.
       */
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

      /**
       * Initiate auth flow in response to user clicking authorize button.
       *
       * @param {Event} event Button click event.
       */
      function handleAuthClick(event) {
        gapi.auth.authorize(
          {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
          handleAuthResult);
        return false;
      }

      /**
       * Load Google Calendar client library. List upcoming events
       * once client library is loaded.
       */
      function loadCalendarApi() {
        gapi.client.load('calendar', 'v3', listUpcomingEvents);
      }

      /**
       * Print the summary and start datetime/date of the next ten events in
       * the authorized user's calendar. If no events are found an
       * appropriate message is printed.
       */
      function listUpcomingEvents() {
        var request = gapi.client.calendar.events.list({
          'calendarId': 'primary',
          'timeMin': (new Date()).toISOString(),
          'showDeleted': false,
          'singleEvents': true,
          'maxResults': 10,
          'orderBy': 'startTime'
        });

        request.execute(function(resp) {
          var events = resp.items;
          
  /*        appendPre('Upcoming events:');*/

          if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
              var event = events[i];
              var when = event.start.dateTime;
              if (!when) {
                when = event.start.dateTime;
              }

              var day = when.slice(0,10);
              // sólo la hora
              var time = when.slice(11,16);
              
              //punto fancy a la hora
              String.prototype.replaceAt=function(index, character) {
                return this.substr(0, index) + character + this.substr(index+character.length);
              }
              time = time.replaceAt(2, ".");
              //fin de punto fancy

              //yyyy-mm-dd              
              function formatDate(date) {
                  var d = new Date(date),
                      month = '' + (d.getMonth() + 1),
                      day = '' + d.getDate(),
                      year = d.getFullYear();

                  if (month.length < 2) month = '0' + month;
                  if (day.length < 2) day = '0' + day;

                  return [year, month, day].join('-');
              }

              //mañana
              Date.prototype.addDays = function(days){
                  var dat = new Date(this.valueOf());
                  dat.setDate(dat.getDate() + days);
                  return dat;
              }

              var today = new Date();
              var tomorrow = today.addDays(1);
             
              tomorrow = tomorrow.toString().slice(0,15)

              today = today.toString().slice(0,15);
              when = when.toString().slice(0,10);

              console.log(when);
              console.log(formatDate(today));
              console.log(formatDate(tomorrow));
              tomorrow = formatDate(tomorrow);
              today = formatDate(today);

              


              if (when === today) {
                day = 'Today';
              }else if (when === tomorrow) {
                day = 'Tomorrow';
              } 
              else{
                day = day;
              }








              /*appendPre(time);*/
              appendPre(event.summary, time, day);

 /*             var span = document.createElement('span');
              var finaltime = span.appendChild(time);*/
            }
          } else {
            appendPre('No se encontraron eventos próximos.');
          }

        });
      }

      /**
       * Append a pre element to the body containing the given message
       * as its text node.
       *
       * @param {string} message Text to be placed in pre element.
       */
      function appendPre(message, tiempo, dia) {

          var pre = document.getElementById('output');
          var mensaje = document.createTextNode(message);
          var day = document.createTextNode(dia)
          var temp = document.createTextNode(tiempo);
          var cf = document.createElement("div");
          cf.className += "cf";

          //parent
          var evento = document.createElement("div");
          evento.className += "evento wow fadeInUp";
          evento.setAttribute("data-wow-duration", "2s");

          //first-child
          var timediv = document.createElement("div");
          timediv.className += "time";
          var timespan = document.createElement("span");
          timespan.appendChild(temp);
          timediv.appendChild(timespan);
          evento.appendChild(timediv);

          //second-child  BIG INFO
          var eventdiv = document.createElement("div");
          var title = document.createElement("div");
          var when = document.createElement("div");
          when.className += "when";
          eventdiv.className += "apointment";
          title.appendChild(mensaje);
          when.appendChild(day);
          eventdiv.appendChild(title);
          eventdiv.appendChild(when);

          //hora y evento en un solo elemento
          evento.appendChild(timediv);
          evento.appendChild(eventdiv);
          //agregar al stream y clearfix
          pre.appendChild(evento);
          pre.appendChild(cf);
          

      }
