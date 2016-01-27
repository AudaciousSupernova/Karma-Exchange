var faker = require('faker');
var mainController = require('./mainController')
//'./db/dbControllers/populateMainDb'

//Sets the number of new users to add to the database
var numberOfNewUsers = 100;
var insertedUser = 1;
//loops through, generating new users until number of users is hit
for(var i = 0; i< numberOfNewUsers; i++){
	var randomUserObj = {
		name : faker.name.findName(), // Rowan Nikolaus
		password : faker.internet.password(),
		email : faker.internet.email(), // Kassandra.Haley@erich.biz
		karma : Math.floor(Math.random() * 20000),
		facebookKey : faker.random.uuid(),
		profile_photo : faker.image.avatar(),
	}
	mainController.addUser(randomUserObj, function(err, response){
		console.log("insertingUser", insertedUser)
		if(insertedUser === numberOfNewUsers){
			process.exit()
		}
		insertedUser++
	})
}
