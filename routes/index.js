var express = require('express');
var router = express.Router();
var socket = require('socket.io');
var io = socket();

//fill this in -- list of outrages and their details
var outrages = [
		{
			"id":0,  // must be unique and ideally incremented
			"img":"../public/images/outrage1.jpg",
			"option_one":"#warOnChristmas",
			"option_two":"#jstACup",
			"option_one_votes":0,
			"option_two_votes":0
	    },
	    {
			"id":1,
			"img":"../public/images/outrage2.jpg",
			"option_one":"#idiot",
			"option_two":"#patriot",
			"option_one_votes":0,
			"option_two_votes":0
	    },
	    {
			"id":2,
			"img":"../public/images/outrage3.jpg",
			"option_one":"#freetochoose",
			"option_two":"#bornthisway",
			"option_one_votes":0,
			"option_two_votes":0
	    }
]

var currently_displayed_outrage_id = 0;

io.on('connection', function(socket){
	console.log("a user connected");

	//send outrage list to client on connection
	socket.emit("data", outrages)

	//receive currently displayed outrage from client so you know what to update
	socket.on("outrage", function(msg){
		currently_displayed_outrage_id = msg;
		console.log("CURRENT ID: "+currently_displayed_outrage_id)
	})

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

	if(!msg){
		return;
	}

	if(msg === '001'){
		incrementOutrage("option_one_votes")
		//io.emit("one","yes")
	}

	if(msg === '002'){
		incrementOutrage("option_two_votes")
		//io.emit("two","yes")
	}

	//send updated data to client
	io.emit("updated_data",outrages)

	console.log("Phone: " + phone);
	console.log("Message: " + msg);

	res.type('text/xml');
	res.render('twiml');
});

//pass in whether to increase option one or two
function incrementOutrage(option){
	for(var i in outrages){
		//find outrage with current id and increment the appropriate option
		if(outrages[i].id == currently_displayed_outrage_id){
			
			var currentVoteCount = outrages[i][option]
			console.log("CURRENT VOTE COUNT: "+currentVoteCount)
			outrages[i][option] = currentVoteCount+1;
			console.log("NEW VOTE COUNT: "+ outrages[i][option])
			console.log(outrages[currently_displayed_outrage_id])
			break;
		}
	}
}

router.get('/one', function(req, res,next){
	incrementOutrage("option_one_votes")
	console.log(outrages);
	io.emit("updated_data",{"outrages":outrages,"id":currently_displayed_outrage_id})
	res.send("one")
})

router.get('/two', function(req, res,next){
	incrementOutrage("option_two_votes")
	console.log(outrages);
	io.emit("updated_data",{"outrages":outrages,"id":currently_displayed_outrage_id})
	res.send("two")
})


router.get('/', function(req, res, next) {
  res.render('index');
});

module.exports = {"router":router, "io":io};
