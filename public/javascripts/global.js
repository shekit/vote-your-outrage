$(document).ready(function(){

	var socket = io();

	var img = $("#outrage-img");  //img to update
	var option_one = $("#option-one");  // option one text
	var option_two = $("#option-two");  // option two text
	var option_one_votes = $("#option-one-votes");   // vote counter for option one
	var option_two_votes = $("#option-two-votes");   // vote counter for option two

	var outrageTimerDuration = 15000;
	var outrageCount = 0;
	var outrageLoopRunning = false;

	// array containing details of outrages - filled by server
	var outrages = []

	//receive outrage list from server
	socket.on("data", function(msg){
		console.log("got outrages")

		//save copy of list in client
		outrages = msg;
		console.log(outrages)

		//start the outrage slideshow
		runOutrageLoop();
	})

	socket.on("updated_data", function(msg){

		//update client copy of data and set the new votes
		console.log("UPDATED")
		outrages = msg.outrages;
		var idOfSlide = msg.id;
		updateVotes(idOfSlide);
	})



	function runOutrageLoop(){
		console.log("START LOOP")
		outrageInterval = setInterval(function(){
			outrageLoopRunning = true;

			//send currently displayed outrage to server
			socket.emit("outrage", outrages[outrageCount]["id"]);

			//set the slide values
			updateText();

			if(outrageCount >= outrages.length-1){
				outrageCount = 0;
				return;
			}

			outrageCount++;
		}, outrageTimerDuration)
	}

	function updateText(){
		img.attr("src",outrages[outrageCount].img);
		option_one.html(outrages[outrageCount].option_one);
		option_two.html(outrages[outrageCount].option_two);
		option_one_votes.html(outrages[outrageCount].option_one_votes);
		option_two_votes.html(outrages[outrageCount].option_two_votes);
	}

	function updateVotes(id){
		option_one_votes.html(outrages[id]["option_one_votes"]);
		option_two_votes.html(outrages[id]["option_two_votes"]);
	}

	function stopLoopInterval(){
		console.log("Stop regular loop");
		clearInterval(outrageInterval);
		outrageLoopRunning = false;
		outrageCount = 0;
	}
})