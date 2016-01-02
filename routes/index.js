var express = require('express');
var router = express.Router();
var socket = require('socket.io');
var io = socket();

//FILL THIS IN -- list of outrages and their details
var outrages = [
		{
			"id":0,  // must be unique and increment correctly
			"img":"../public/images/voting-photos_redcup.png",   // replace outrage1.jpg etc with image name. place image in public/images .. do not touch rest of the path
			"option_one":"#warOnChristmas",   //first hashtag
			"option_two":"#justACup",     // second hashtag
			"option_one_votes":0,   //start this off with zero
			"option_two_votes":0    // start this off with zero
	    },
	    {
			"id":1,
			"img":"../public/images/voting-photos_trump.png",
			"option_one":"#makeAmericaGreat",
			"option_two":"#racist",
			"option_one_votes":0,
			"option_two_votes":0
	    },
	    {
			"id":2,
			"img":"../public/images/voting-photos_paris.png",
			"option_one":"#empathy",
			"option_two":"#slacktivism",
			"option_one_votes":0,
			"option_two_votes":0
	    },
	    {
			"id":3,
			"img":"../public/images/voting-photos_confederate.png",
			"option_one":"#hate",
			"option_two":"#heritage",
			"option_one_votes":0,
			"option_two_votes":0
	    },
	    {
			"id":4,
			"img":"../public/images/voting-photos_cecil.png",
			"option_one":"#endangered",
			"option_two":"#maneater",
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
	io.emit("updated_data",{"outrages":outrages,"id":currently_displayed_outrage_id})

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

//routes to test code
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
