const { ObjectModel } = require('../models//objectModels');


async function createObject(req, res) {
	const { img, title, description, apartments, doneApartments, feld, status } = req.body;

	const objectExists = await ObjectModel.findOne({ title });
	if (objectExists) res.status(400).send({
		message: "Object is already exists",
	})
	else {
		const newObject = new ObjectModel({
			img, title, description, apartments, doneApartments, feld, status
		})
		try {
			await newObject.save()
			res.status(200).send({
				message: "Object has been created"
			})
		} catch (error) {
			console.log(error)
		}
	}
}

async function getObjects(req, res) {
	const objects = await ObjectModel.find()
	res.send(objects)
}
module.exports = {
	createObject,
	getObjects
}