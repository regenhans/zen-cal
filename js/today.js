var d = new Date(),
    todayis = moment(d).format('[Today is] dddd'),
    theDate = moment(d).format("MMMM D [,]"),
    todaytext = document.createTextNode(todayis),
    dateText = document.createTextNode(theDate),
    daydiv = document.getElementById('day'),
    datediv = document.getElementById('datetime')
    hourId = document.getElementById('hour');

//day&date
datediv.appendChild(dateText)
daydiv.appendChild(todaytext)


var myVar = setInterval(myTimer, 1000);

function myTimer() {
    var d = new Date(),
        theHour = moment(d).format("HH:mm");
    hourId.innerHTML = theHour;
}
