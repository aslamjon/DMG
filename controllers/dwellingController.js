const path = require("path");
const { DwellingModel } = require('../models/dwellingModels');
const { PhasesModel } = require('../models/phasesModels');
const { saveImgs, unlink } = require("../utiles");

// name,description,viewbox,path,phase_id = data
// img, logo = files
async function createDwelling(req, res) {
    const {name,description,viewbox,path,phase_id} = req.body;
    try {
        if (!name || !description || !viewbox || !path || !phase_id) res.status(400).send({ message: "Bad request" });
        else {
            const phase = await PhasesModel.find({ _id: phase_id }, { object_id: 1, _id: 0 });
            if (!phase.length) res.status(404).send({ message: "Phase not found" });
            else {
                const {img, logo} = await saveImgs(req, res, ['img', 'logo']);
    
                const newDwelling = new DwellingModel({
                    name,description,viewbox,path,phase_id,
                    object_id: phase[0].object_id,
                    img: `/api/data/${img}`,
                    logo: `/api/data/${logo}`
                })
                await newDwelling.save();
                res.status(200).send({
                    message: "Dwelling has been created"
                })
            }
        }
    } catch (error) { 
        console.log(error)
        throw new Error('DWELLING_HAS_NOT_CREATED') 
    }
}

async function getDwelling(req, res) {
    try {
        const dwellings = await DwellingModel.find()
        res.send(dwellings);
    } catch (error) { 
        // console.log(error)
        throw new Error('DWELLING_HAS_NOT_GOOTEN') 
    }
}

async function getDwellingById(req, res) {
    const { id } = req.params;
    try {
        const dwelling = await DwellingModel.findOne({ _id: id })
        res.send(dwelling);
    } catch (error) { 
        // console.log(error)
        throw new Error('DWELLING_HAS_NOT_GOOTEN') 
    }
}

async function deleteDwellingById(req, res) {
    const { id } = req.params;
    try {
        const dwelling = await DwellingModel.findOne({ _id: id })
        if (!dwelling) res.status(404).send({ message: "Dwelling not found"});
        else {
            await DwellingModel.deleteOne({ _id: id });
            const imagesFolderPath = path.join(__dirname, `./../data/images`);
            const img = dwelling.img.replace('/api/data/','');
            const logo = dwelling.logo.replace('/api/data/','');
            try {
                await unlink(`${imagesFolderPath}/${img}`)
                await unlink(`${imagesFolderPath}/${logo}`)
            } catch (error) { 
                console.log(error)
            }
            res.send({ message: "Dwelling has been deleted" })
        }
    } catch (error) { 
        console.log(error)
        throw new Error('DWELLING_HAS_NOT_GOOTEN') 
    }
}

// name,description,viewbox,path,phase_id
async function updatePhaseById(req, res) {
    const {name,description,viewbox,path,phase_id} = req.body;
    const { id } = req.params;
    try {
        const object = await DwellingModel.findOne({ _id: id })
        if (!object) {
            res.status(404).send({
                message: "Dwelling not found"
            })
        } else {
			const update = await DwellingModel.findOneAndUpdate({ _id:id }, {
				name: name || object.name, 
				description: description || object.description, 
				viewbox: viewbox || object.viewbox, 
				path: path || object.path,
                phase_id: phase_id || object.phase_id
			})

            res.send({
                message: "Dwelling has been updated successfuly"
            })
        }
    } catch (error) { 
        console.log(error);
        throw new Error("DWELLING_HAS_NOT_UPDATED")
    }
}


module.exports = {
    createDwelling,
    getDwelling,
    getDwellingById,
    deleteDwellingById,
    updatePhaseById
}