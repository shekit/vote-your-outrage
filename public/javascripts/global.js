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

	var slideInterval = 5000;
	var slideCounter = 0;

	// array containing details of outrages - filled by server
	var outrages = []

	voteOneSpan.html(voteOneCount);
	voteTwoSpan.html(voteTwoCount);

	//receive outrage list from server
	socket.on("data", function(msg){
		console.log("got outrages")

		//save copy of list in client
		outrages = msg;

		//start the outrage slideshow

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



	function runSlides(){
		slideTimer = setInterval(function(){
			console.log("hello")
		}, slideInterval)
	}
})