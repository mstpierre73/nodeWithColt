const request = require("request");

request("https://jsonplaceholder.typicode.com/users/1", (error, response, body) => {
	if(!error && response.statusCode === 200){
		const parsedData = JSON.parse(body);
		//console.log(parsedData);
		const id = parsedData.id;
		const name = parsedData.name;
		const username = parsedData.username;
		const city = parsedData.address.city;
		const street = parsedData.address.street;
		console.log(`The user ${id} is ${name}, has username of ${username} and live in ${city} on the ${street} street`);
	}
});		
		
		
		
