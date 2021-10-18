const path = require("path");
const { Types } = require('mongoose');
const { ObjectModel } = require('../models//objectModels');
const { PhasesModel } = require('../models/phasesModels');
const { rename, unlink } = require("../utiles");

const handleError = (err, res) => {
	// console.log("ERROR", err);
	res
		.status(500)
		.contentType("text/plain")
		.send({ message: "Oops! Something went wrong!" });
};

async function saveImg(req, res) {
	const tempPath = req.file.path;
	let originalName = req.file.originalname;

	function addDateTime(name) {
		const newDate = new Date()
		const orginalNameArr = name.split(".")
		const fileType = orginalNameArr.pop()
		const getDate = newDate.toLocaleDateString().split('/').join('_');
		const getTime = newDate.toLocaleTimeString().split(' ')[0].split(':').join('_');
		orginalNameArr.push(`_${getDate}_${getTime}`);
		orginalNameArr.push(`.${fileType}`);
		return orginalNameArr.join('');
	}

	originalName = addDateTime(originalName);
	const targetPath = path.join(__dirname, `./../data/images/${originalName}`);

	// Create Img
	if (path.extname(req.file.originalname).toLowerCase() && (".png" || ".svg" || ".jpg")) {
		const resultRename = await rename(tempPath, targetPath)
		if (!resultRename) handleError('', res);
		else return originalName;
	} else {
		// Delete cache
		const resUnlik = await unlink(tempPath);
		if (!resUnlik) handleError('', res);
		else {
			res
				.status(403).contentType("text/plain")
				.send({ message: "Only .png, .svg, .jpg files are allowed!" });
		}
	}
}

async function createObject(req, res) {
	const { title, description, apartments, doneApartments, feld, status } = req.body;

	if (!req.file || !title || !description || !apartments || !doneApartments || !feld) res.status(400).send({ message: "Bad request" })
	else {
		const objectExists = await ObjectModel.findOne({ title });
		if (objectExists) res.status(400).send({
			message: "Object is already exists",
		})
		else {
			const newImg = await saveImg(req, res);
			const newObject = new ObjectModel({
				img: `/api/data/${newImg}`, title, description,
				apartments, doneApartments, feld, status, assignedTo: req.user.userId
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
}

async function getObjects(req, res) {
	try {
		const objects = await ObjectModel.aggregate([
			{
				$lookup:
				{
					from: "phases",
					localField: "_id",
					foreignField: "object_id",
					as: "phases"
				}
			}
		])
		// .populate("assignedTo","username") // populate bir birga bog'langan modellarni olib beradi. bu func ishlashi uchun ref: "User" bo'lishi kerak
		res.send(objects)
	} catch (error) {
		console.log(error);
	}
}

async function getObjectById(req, res) {
	try {
		const { id } = req.params;
		let object = await ObjectModel.findOne({ _id: id })
		if (!object) res.status(404).send({ message: "Object not found" });
		else {
			object = await ObjectModel.aggregate([
				{
					$match: {
						_id: Types.ObjectId(id)
					}
				},
				{
					$lookup:
					{
						from: "phases",
						localField: "_id",
						foreignField: "object_id",
						as: "phases"
					}
				}
			])
			res.send(object)
		}
	} catch (error) {
		console.log(error);
	}
}

async function deleteObjectById(req, res) {
	const { id } = req.params;
	try {
		const object = await ObjectModel.findOne({ _id: id })
		if (!object) res.status(404).send({ message: "Object not found" })
		else {
			const delObject = await ObjectModel.deleteOne({ _id: id }); // return deletedCount: 1
			const imagesFolderPath = path.join(__dirname, `./../data/images`);
			const img = object.img.replace('/api/data/', '');
			try {
				await unlink(`${imagesFolderPath}/${img}`)
			} catch (error) { console.log(error) }
			res.send({ message: "Object has been deleted" })
		}
	} catch (error) {
		console.log(error)
	}
}

async function updateObjectById(req, res) {
	const { id } = req.params
	const { title, description, apartments, doneApartments, feld, status } = req.body;
	try {
		const object = await ObjectModel.findOne({ _id: id })
		if (!object) {
			res.status(404).send({
				message: "Object not found"
			})
		} else {
			const update = await ObjectModel.findOneAndUpdate({ _id: id }, {
				title: title || object.title,
				description: description || object.description,
				apartments: apartments || object.apartments,
				doneApartments: doneApartments || object.doneApartments,
				feld: feld || object.feld,
				status: status || object.status
			})

			res.send({
				message: "Object has been updated successfuly"
			})
		}
	} catch (error) {
		console.log(error);
	}
}
module.exports = {
	createObject,
	getObjects,
	getObjectById,
	updateObjectById,
	deleteObjectById
}