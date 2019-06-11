const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Comment = require('./models/comment');

const data = [
	{name: "Réserve faunique de Port-Cartier-Sept-îles",
	 image: "http://www.villeport-cartier.com/upload/villeport-cartier/editor/image/Chute%20MacDonald_JB%C3%A9langer%20(10).JPG",
	 description: "Des paysages grandioses, une qualité de pêche exceptionnelle assortie d'une limite de prise élevée, un territoire immense et des lacs à l'avenant... La réserve faunique de Port-Cartier–Sept-Îles vous offre un pays de démesure! Cette nature généreuse vous assure des moments de tranquillité inoubliables. Un séjour dans la réserve faunique de Port-Cartier–Sept-Îles vous fera découvrir un décor à couper le souffle. Vos vacances dans la belle région de la Côte-Nord vous laisseront un souvenir impérissable que vous voudrez partager."
	},
	
	{name: "Parc national d'Anticosti",
	 image: "https://www.quebecoriginal.com/fiche/images/800x600/0e264df0-eae4-492a-9c5f-d7fa0129c5cb/parc-national-danticosti-parc-national-danticosti.jpg",
	 description: "Imaginez! Dans le golfe du Saint-Laurent, une île sauvage et envoûtante baignée dans la lumière transparente du Nord. Imaginez des falaises blanches que l'océan vient caresser, inlassablement. Imaginez des canyons vertigineux et le fracas des chutes puissantes. Imaginez d'immenses grottes secrètes, des cerfs de Virginie qui broutent des algues, des saumons qui ondulent dans des fosses émeraude et des phoques allongés sur des rochers, au soleil. Imaginez-vous, dans le parc national d'Anticosti."
	},
	
	{name: "Parc national de l'Île-Bonaventure-et-du-Rocher-Percé",
	 image: "https://www.aventurequebec.ca/public_upload/images/Parcs%20Nationaux/thumbnails/parc-national-ile-bonaventure-et-rocher-perc%C3%A9-1200x630-000000.jpg",
	 description: "Le parc national de l'Île-Bonaventure-et-du-Rocher-Percé s'affiche par son riche patrimoine naturel, historique et géologique. Sculpté par le temps et la mer, à l'extrémité de la péninsule gaspésienne, il possède comme forteresse l'île Bonaventure et comme vaisseau de pierre le majestueux rocher Percé, emblème touristique du Québec. Sa flore et sa faune singulières, dont sa célèbre colonie de fous de Bassan, en font une destination incontournable, tout comme le patrimoine bâti de l'île, dernier témoin de la vie des insulaires du siècle dernier."
	}
];


function seedDB(){
	//Remove all campgrounds
	Campground.deleteMany({}, (err) =>{
		if(err){
			console.log(err);
		} else {
			console.log("removed all campgrounds!!!!");
		}
		
		//Remove all comments
		Comment.deleteMany({}, (err) =>{
			if(err){
				console.log(err);
			} else{
				console.log("removed all comments!");
			}
		});
		
		//Add a few campgrounds
		data.forEach((seed) =>{
			Campground.create(seed, (err, campground) =>{
				if(err){
					console.log(err);
				} else {
					console.log("Added a campground!!!");
					
					//create a comment
					Comment.create(
						{
							text: "This place is great but I wish there was internet connexion",
							author:"Homer"
						}, (err, comment) =>{
							if(err){
								console.log(err);
							} else {
								campground.comments.push(comment);
								campground.save();
								console.log("Created new comment!");
							}
						}
					); //end of create a comment
					
				}//end of else statement of campground.create
			});
		}); //end of forEach loop
		
	}); //end of Campground.deleteMany
		
}//end of seedDB function

module.exports = seedDB;




