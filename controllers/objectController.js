const path = require("path");
const { Types } = require('mongoose');
const { ObjectModel } = require('../models//objectModels');
const { PhasesModel } = require('../models/phasesModels');
const { unlink, saveImgs } = require("../utiles");


async function createObject(req, res) {
  const { title, description, apartments, doneApartments, feld, status } = req.body;
  try {
    if (!title || !description || !apartments || !doneApartments || !feld) res.status(400).send({ message: "Bad request" })
    else {
      const objectExists = await ObjectModel.findOne({ title });
      if (objectExists) res.status(400).send({
        message: "Object is already exists",
      })
      else {
        const { img, logo } = await saveImgs(req, res, ['img', 'logo']);
        const newObject = new ObjectModel({
          img: `/api/data/${img}`,
          logo: `/api/data/${logo}`,
          title, description,
          apartments, doneApartments, feld, status, assignedTo: req.user.userId
        })
        await newObject.save()
        res.status(200).send({
          message: "Object has been created"
        });
      }
    }
  } catch (error) {
    // console.log(error.message);
    throw "OBJECT_HAS_NOT_CREATED";
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
      },
      {
        $lookup:
        {
          from: "apartments",
          // objectning id ni o'zgaruvchiga olamiz",
          let: { objectId: "$_id" },
          pipeline: [
            {
              $match: {
                status: true,
                $expr: {
                  $eq: ["$object_id", "$$objectId"]
                }
              }
            },
            {
              $group: {
                _id: "$$objectId",
                count: { $sum: 1 },
              }
            },
            {
              $project: {
                _id: 0
              }
            }
          ],
          as: "apartments"
        }
      },
    ]);
    // .populate("assignedTo","username") // populate bir birga bog'langan modellarni olib beradi. bu func ishlashi uchun ref: "User" bo'lishi kerak
    res.send(objects)
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
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
          $lookup:
          {
            from: "phases",
            localField: "_id",
            foreignField: "object_id",
            as: "phases"
          }
        },
        {
          $lookup:
          {
            from: "apartments",
            // objectning id ni o'zgaruvchiga olamiz",
            let: { objectId: "$_id" },
            pipeline: [
              {
                $match: {
                  status: true,
                  $expr: {
                    $eq: ["$object_id", "$$objectId"]
                  }
                }
              },
              {
                $group: {
                  _id: "$$objectId",
                  count: { $sum: 1 },
                }
              },
              {
                $project: {
                  _id: 0
                }
              }
            ],
            as: "apartments"
          }
        },
      ]);
      res.send(object)
    }
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
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
  const { title, description, rating, doneApartments, feld, status } = req.body;
  try {
    const object = await ObjectModel.findOne({ _id: id })
    if (!object) {
      res.status(404).send({
        message: "Object not found"
      })
    } else {
      if (!title && !description && !rating && !doneApartments && !feld && !status) res.status(400).send({ message: "Bad request" });
      else {
        const update = await ObjectModel.findOneAndUpdate({ _id: id }, {
          title: title || object.title,
          description: description || object.description,
          rating: rating || object.rating,
          doneApartments: doneApartments || object.doneApartments,
          feld: feld || object.feld,
          status: status || object.status
        })

        res.send({
          message: "Object has been updated successfuly"
        })
      }
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