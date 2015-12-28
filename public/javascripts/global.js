$(document).ready(function(){
	console.log("hello");

	var socket = io();

	var voteOneCount = 0;
	var voteTwoCount = 0;

	var ul = $("#messages");

	var voteOneSpan = $(".voteOne");
	var voteTwoSpan = $(".voteTwo");

	var img = $("#outrage-img");  //img to update
	var option_one = $("#option-one");  // option one text
	var option_two = $("#option-two");  // option two text
	var option_one_votes = $("#option-one-votes");   // vote counter for option one
	var option_two_votes = $("#option-two-votes");   // vote counter for option two

	var outrageTimerDuration = 5000;
	var outrageCount = 0;
	var outrageLoopRunning = false;

	// array containing details of outrages - filled by server
	var outrages = []

	voteOneSpan.html(voteOneCount);
	voteTwoSpan.html(voteTwoCount);

	//receive outrage list from server
	socket.on("data", function(msg){
		console.log("got outrages")

		//save copy of list in client
		outrages = msg;
		console.log(outrages)

		//start the outrage slideshow
		//runOutrageLoop();
	})

	socket.on("one", function(msg){
		console.log("voted yes")
		voteOneCount++;
		voteOneSpan.html(voteOneCount);
	})

	socket.on("two", function(msg){
		console.log("voted no")
		voteTwoCount++;
		voteTwoSpan.html(voteTwoCount);
	})



	function runOutrageLoop(){
		console.log("START LOOP")
		outrageInterval = setInterval(function(){
			outrageLoopRunning = true;

			//set the slide values
			img.attr("src",outrages[outrageCount].img);
			option_one.html(outrages[outrageCount].option_one);
			option_two.html(outrages[outrageCount].option_two);
			option_one_votes.html(outrages[outrageCount].option_one_votes);
			option_two_votes.html(outrages[outrageCount].option_two_votes);

			if(outrageCount >= outrages.length-1){
				outrageCount = 0;
				return;
			}

			outrageCount++;
		}, outrageTimerDuration)
	}

	function stopLoopInterval(){
		console.log("Stop regular loop");
		clearInterval(outrageInterval);
		outrageLoopRunning = false;
		outrageCount = 0;
	}
})