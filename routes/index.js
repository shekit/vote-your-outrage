var express = require('express');
var router = express.Router();
var socket = require('socket.io');
var io = socket();

var outrages = [
		{
			"id":1,
			"img":"../public/images/outrage1.jpg",
			"option_one":"#warOnChristmas",
			"option_two":"#jstACup",
			"option_one_votes":0,
			"option_two_votes":0
	    },
	    {
			"id":2,
			"img":"../public/images/outrage2.jpg",
			"option_one":"#idiot",
			"option_two":"#patriot",
			"option_one_votes":0,
			"option_two_votes":0
	    },
	    {
			"id":3,
			"img":"../public/images/outrage3.jpg",
			"option_one":"#freetochoose",
			"option_two":"#bornthisway",
			"option_one_votes":0,
			"option_two_votes":0
	    }
]

io.on('connection', function(socket){
	console.log("a user connected");

	//send outrage list to client
	socket.emit("data", outrages)

	socket.on('disconnect', function(){
		console.log("user disconnected")
	})
})

/* GET home page. */
router.post('/message', function(req, res, next){
	// get users number
	var phone = req.body.From;
	var msg = req.body.Body || '';

	msg = msg.toLowerCase().trim();
	if(msg === 'one'){
		io.emit("one","yes")
	}

	if(msg === 'two'){
		io.emit("two","yes")
	}

	console.log("Phone: " + phone);
	console.log("Message: " + msg);

	res.type('text/xml');
	res.render('twiml');
});

router.get('/', function(req, res, next) {
  res.render('index');
});

module.exports = {"router":router, "io":io};
