const request = require("request");

request("https://www.youtube.com/iframe_api", function(error, response, body){
	if(error){
		console.log("Something went wrong!");
		console.log(error);
	}
	else if(!error && response.statusCode === 200){
		console.log(body);
	}
});		
		
		
		
