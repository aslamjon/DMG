const path = require("path");

// const { DwellingModel } = require('../models/dwellingModels');
const { FloorModel } = require('../models/floorModels');
const { ApartmentModel } = require("../models/apartmentModels");
const { saveImgs, unlink } = require("../utiles");

// name,description,viewbox,path,floor_id = data
// img,  = files
async function createApartment(req, res) {
  const { name, description, viewbox, path, floor_id } = req.body;
  try {
    if (!name || !description || !viewbox || !path || !floor_id) res.status(400).send({ message: "Bad request" });
    else {
      const obj = await FloorModel.find({ _id: floor_id }, { object_id: 1, phase_id: 1, dwelling_id: 1, _id: 0 });
      if (!obj.length) res.status(404).send({ message: "Floor not found" });
      else {
        const { img } = await saveImgs(req, res, ['img']);

        const newObj = new ApartmentModel({
          name, description, viewbox, path,
          floor_id,
          phase_id: obj[0].phase_id,
          object_id: obj[0].object_id,
          dwelling_id: obj[0].dwelling_id,
          img: `/api/data/${img}`,
        })
        await newObj.save();
        res.status(200).send({
          message: "Apartment has been created"
        })
      }
    }
  } catch (error) {
    console.log(error)
    throw new Error('APARTMENT_HAS_NOT_CREATED')
  }
}

async function getApartments(req, res) {
  try {
    const obj = await ApartmentModel.find()
    res.send(obj);
  } catch (error) {
    // console.log(error)
    throw new Error('APARTMENTS_HAS_NOT_GOOTEN')
  }
}

async function getApartmentById(req, res) {
  const { id } = req.params;
  try {
    const obj = await ApartmentModel.findOne({ _id: id })
    res.send(obj);
  } catch (error) {
    // console.log(error)
    throw new Error('APARTMENT_HAS_NOT_GOOTEN')
  }
}

async function deleteApartmentById(req, res) {
  const { id } = req.params;
  try {
    const obj = await ApartmentModel.findOne({ _id: id })
    if (!obj) res.status(404).send({ message: "Apartment not found" });
    else {
      await ApartmentModel.deleteOne({ _id: id });
      const imagesFolderPath = path.join(__dirname, `./../data/images`);
      const img = obj.img.replace('/api/data/', '');
      const logo = obj.logo.replace('/api/data/', '');
      try {
        await unlink(`${imagesFolderPath}/${img}`)
        await unlink(`${imagesFolderPath}/${logo}`)
      } catch (error) {
        console.log(error)
      }
      res.send({ message: "Apartment has been deleted" })
    }
  } catch (error) {
    console.log(error)
    throw new Error('APARTMENT_HAS_NOT_GOOTEN')
  }
}

// name,description,viewbox,path,floor_id
async function updateApartmentById(req, res) {
  const { name, description, viewbox, path, status, floor_id } = req.body;
  const { id } = req.params;
  try {
    if (!name && !description && !viewbox && !path && !status && !floor_id) res.status(400).send({ message: "Bad request" });
    else {
      const object = await ApartmentModel.findOne({ _id: id })
      if (!object) {
        res.status(404).send({
          message: "Apartment not found"
        })
      } else {
        const update = await ApartmentModel.findOneAndUpdate({ _id: id }, {
          name: name || object.name,
          description: description || object.description,
          viewbox: viewbox || object.viewbox,
          path: path || object.path,
          status: (status == 'true' || status == 'false') ? status : object.status,
          floor_id: floor_id || object.floor_id
        })

        res.send({
          message: "Apartment has been updated successfuly",
          update
        })
      }
    }
  } catch (error) {
    console.log(error);
    throw new Error("APARTMENT_HAS_NOT_UPDATED")
  }
}

module.exports = {
  createApartment,
  getApartments,
  getApartmentById,
  deleteApartmentById,
  updateApartmentById
}