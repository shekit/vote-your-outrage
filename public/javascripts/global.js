$(document).ready(function(){
	console.log("hello");

	var socket = io();

	var voteOneCount = 0;
	var voteTwoCount = 0;

	var ul = $("#messages");

	var voteOneSpan = $(".voteOne");
	var voteTwoSpan = $(".voteTwo");

	voteOneSpan.html(voteOneCount);
	voteTwoSpan.html(voteTwoCount);

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
})