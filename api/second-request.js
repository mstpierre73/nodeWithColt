const rp = require('request-promise');

rp('https://jsonplaceholder.typicode.com/users/2')
	.then((htmlstring) => {
		const parsedData = JSON.parse(htmlstring);
		const id = parsedData.id;
		const name = parsedData.name;
		const username = parsedData.username;
		const city = parsedData.address.city;
		const street = parsedData.address.street;
		console.log(`The user ${id} is ${name}, has username of ${username} and live in ${city} on the ${street} street`);
	})
	.catch((err) =>{
		console.log('Error = ', err);
	});
