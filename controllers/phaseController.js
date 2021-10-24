const path = require("path");
const { PhasesModel } = require('../models/phasesModels');
const { ObjectModel } = require('../models//objectModels');
const { rename, unlink, saveImgs } = require("../utiles");


// it looks name,description,viewbox,path,object_id = data
// it looks img, logo = files
async function createPhase(req,res) {
    const {name,description,viewbox,path,object_id} = req.body;
    try {
        const objectIsMatch = await ObjectModel.findOne({ _id: object_id })
        if (!name || !description || !viewbox || !path || !object_id) res.status(400).send({ message: "Bad request" });
        else {
            if (!objectIsMatch) res.status(404).send({ message: "Object not found" })
            else {
                const {img} = await saveImgs(req, res, ['img']);
                
                const newPhase = new PhasesModel({
                    img: `/api/data/${img}`,
                    name,description,viewbox,path,object_id
                })
                await newPhase.save();
                res.status(200).send({
                    message: "Phase has been created"
                })
            }
        }
    } catch (error) { 
        console.log(error)

        throw new Error('PHASE_HAS_NOT_CREATED') 
    }
}

async function getPhases(req, res) {
    try {
        const phases = await PhasesModel.find();
        res.send(phases);
    } catch (error) {
        throw new Error('PHASE_HAS_NOT_GOTTEN')
    }
}

async function getPhasesWithObject(req, res) {
    try {
        const phases = await PhasesModel.find().populate("object_id");
        res.send(phases);
    } catch (error) {
        throw new Error('PHASE_HAS_NOT_GOTTEN')
    }
}

async function getPhasById(req, res) {
    const { id } = req.params
    try {
        const phase = await PhasesModel.findOne({ _id: id });
        res.send(phase);
    } catch (error) {
        throw new Error('PHASE_HAS_NOT_GOTTEN')
    }
}

async function getPhaseByIdWithObject(req, res) {
    const { id } = req.params
    try {
        const phase = await PhasesModel.find({ _id: id }).populate("object_id");
        res.send(phase);
    } catch (error) {
        throw new Error('PHASE_HAS_NOT_GOTTEN')
    }
}

async function deletePhaseById(req, res) {
    const { id } = req.params;
    try {
        const phase = await PhasesModel.findOne({ _id: id })
        if (!phase) res.status(404).send({ message: "Phase not found"})
        else {
            await PhasesModel.deleteOne({ _id: id })
            const imagesFolderPath = path.join(__dirname, `./../data/images`);
            const img = phase.img.replace('/api/data/','');
            try {
                await unlink(`${imagesFolderPath}/${img}`)
            } catch (error) { throw "IMAGE_HAS_NOT_DELETED" }
            res.send({ message: "Phase has been deleted" })
        }
    } catch (error) {
        throw "PHASE_HAS_NOT_BEEN_DELETED"
    }
}
// name,description,viewbox,path,object_id
async function updatePhaseById(req, res) {
    const {name,description,viewbox,path,object_id} = req.body;
    const { id } = req.params;
    try {
        const object = await PhasesModel.findOne({ _id: id })
        if (!object) {
            res.status(404).send({
                message: "Phase not found"
            })
        } else {
			const update = await PhasesModel.findOneAndUpdate({ _id:id }, {
				name: name || object.name, 
				description: description || object.description, 
				viewbox: viewbox || object.viewbox, 
				path: path || object.path, 
				object_id: object_id || object.object_id
			})

            res.send({
                message: "Phase has been updated successfuly"
            })
        }
    } catch (error) { 
        console.log(error);
        throw new Error("PHASE_HAS_NOT_UPDATED")
    }
}

module.exports = {
    createPhase,
    getPhases,
    getPhasesWithObject,
    getPhasById,
    getPhaseByIdWithObject,
    deletePhaseById,
    updatePhaseById
}