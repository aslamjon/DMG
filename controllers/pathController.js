const { PathModel } = require("../models/pathModels");

async function createPath(req, res) {
    try {
        const { path, name } = req.body;
        if (!path || !name) res.status(400).send({ massage: "Bad request" });
        else {
            const newPath = new PathModel({ path, name });
            await newPath.save()
            res.send({ message: "Path has been saved"})
        }
    }catch (error) { console.log(error) }
}

async function getPaths (req, res) {
    try {
        const paths = await PathModel.find();
        res.send(paths)
    } catch (error) { console.log(error) }
}

async function getPathByName (req, res) {
    try {
        const { name } = req.params;
        const path = await PathModel.findOne({ name });
        if (!path) res.status(404).send({ massage: "Path not found" })
        res.send(path)
    } catch (error) { console.log(error) }
}

async function deletePathById (req, res) {
    try {
        const { id } = req.params;
        const path = await PathModel.findOne({ _id: id });
        if (!path) res.status(404).send({ massage: "Path not found" })
        else {
            await PathModel.deleteOne({ _id: id });
            res.send({ massage: "Path has been deleted" })
        }
    } catch (error) { console.log(error) }
}

module.exports = {
    createPath,
    getPaths,
    getPathByName,
    deletePathById
}