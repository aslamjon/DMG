const path = require("path");
const { DwellingModel } = require('../models/dwellingModels');
const { FloorModel } = require('../models/floorModels');
const { saveImgs, unlink } = require("../utiles");

// name,description,viewbox,path,dwelling_id = data
// img = files
async function createFloor(req, res) {
    const {name,description,viewbox,path,dwelling_id} = req.body;
    try {
        if (!name || !description || !viewbox || !path || !dwelling_id) res.status(400).send({ message: "Bad request" });
        else {
            const dwelling = await DwellingModel.find({ _id: dwelling_id }, { object_id: 1, phase_id: 1, _id: 0 });
            if (!dwelling.length) res.status(404).send({ message: "Dwelling not found" });
            else {
                const {img} = await saveImgs(req, res, ['img']);
    
                const newFloor = new FloorModel({
                    name,description,viewbox,path,
                    dwelling_id,
                    phase_id: dwelling[0].phase_id,
                    object_id: dwelling[0].object_id,
                    img: `/api/data/${img}`,
                })
                await newFloor.save();
                res.status(200).send({
                    message: "Floor has been created"
                })
            }
        }
    } catch (error) { 
        console.log(error)
        throw new Error('FLOOR_HAS_NOT_CREATED') 
    }
}

async function getFloors(req, res) {
    try {
        const floors = await FloorModel.find()
        res.send(floors);
    } catch (error) { 
        // console.log(error)
        throw new Error('FLOORS_HAS_NOT_GOOTEN') 
    }
}

async function getFloorById(req, res) {
    const { id } = req.params;
    try {
        const floor = await FloorModel.findOne({ _id: id })
        res.send(floor);
    } catch (error) { 
        // console.log(error)
        throw new Error('FLOOR_HAS_NOT_GOOTEN') 
    }
}

async function deleteFloorById(req, res) {
    const { id } = req.params;
    try {
        const floor = await FloorModel.findOne({ _id: id })
        if (!floor) res.status(404).send({ message: "Floor not found"});
        else {
            await FloorModel.deleteOne({ _id: id });
            const imagesFolderPath = path.join(__dirname, `./../data/images`);
            const img = floor.img.replace('/api/data/','');
            const logo = floor.logo.replace('/api/data/','');
            try {
                await unlink(`${imagesFolderPath}/${img}`)
                await unlink(`${imagesFolderPath}/${logo}`)
            } catch (error) { 
                console.log(error)
            }
            res.send({ message: "Floor has been deleted" })
        }
    } catch (error) { 
        console.log(error)
        throw new Error('FLOOR_HAS_NOT_GOOTEN') 
    }
}

// name,description,viewbox,path,dwelling_id
async function updateFloorById(req, res) {
    const {name,description,viewbox,path,dwelling_id} = req.body;
    const { id } = req.params;
    try {
        const object = await FloorModel.findOne({ _id: id })
        if (!object) {
            res.status(404).send({
                message: "Floor not found"
            })
        } else {
			const update = await FloorModel.findOneAndUpdate({ _id:id }, {
				name: name || object.name, 
				description: description || object.description, 
				viewbox: viewbox || object.viewbox, 
				path: path || object.path,
                dwelling_id: dwelling_id || object.dwelling_id
			})

            res.send({
                message: "Floor has been updated successfuly"
            })
        }
    } catch (error) { 
        console.log(error);
        throw new Error("FLOOR_HAS_NOT_UPDATED")
    }
}

module.exports = {
    createFloor,
    getFloors,
    getFloorById,
    deleteFloorById,
    updateFloorById,
}