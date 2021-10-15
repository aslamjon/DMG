const path = require("path");
const fs = require('fs');
const uuid = require('uuid')

const handleError = (err, res) => {
    // console.log("ERROR", err);
    res
        .status(500)
        .contentType("text/plain")
        .send({ message: "Oops! Something went wrong!" });
};
const {
    getData,
    getElementById,
    create,
    update,
    deleteData,
    rename,
    unlink
} = require('../models/dataModels');


async function getAllData(req, res) {
    try {
        const data = await getData()
        res.send(data)
    } catch (error) {

    }
}
// get Product By Id
async function getDataById(req, res) {
    const { id } = req.params;
    const element = await getElementById(id)
    if (!element) {
        res.status(404).send({
            message: "Element not found"
        })
    } else {
        res.send(element);
    }
}
// Get All Images
function getAllImages(req, res) {
    function getFilesFromPath(path, extension) {
        let files = fs.readdirSync( path );
        return files.filter( file => file.match(new RegExp(`.*\.(${extension})`, 'ig')));
    }
    const filesFromImages = getFilesFromPath(__dirname + '/../data/images', ".png");
    res.send(filesFromImages);
}

// Save Images
async function saveImage(req, res) {
    const tempPath = req.file.path;
    let originalName = req.file.originalname;

    function addUuid(name) {
        const orginalNameArr = name.split(".")
        const fileType = orginalNameArr.pop()
        orginalNameArr.push(`_${uuid.v4()}`);
        orginalNameArr.push(`.${fileType}`);
        return orginalNameArr.join('');
    }

    originalName = addUuid(originalName);
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


// create product
async function createData(req, res) {
    try {
        async function createFormData(body) {
            const newData = await create(body)
            return newData;
        }
        if (req.file && req.body) {
            const imgUrl = await saveImage(req, res);
            const newBody = {
                ...req.body,
                imgUrl: `/api/data/${imgUrl}`
            }
            res.send(await createFormData(newBody));
        } 
        else if (req.file) req.send({ message: `The File was saved as /api/data/${await saveImage(req, res)}`});    
        else res.send(await createFormData(req.body));
        
    } catch (error) {
        console.log(error);
    }
}

// update
async function updateProduct(req, res) {
    const { id } = req.params
    const { name, description, price } = req.body;
    try {
        const product = await getElementById(id)
        if (!product) {
            res.status(404).send({
                message: "Produc not found"
            })
        } else {
            const productData = {
                name: name || product.name,
                description: description || product.description,
                price: price || product.price,
            }
            const updatedProduct = await update(id, productData)
            res.send({
                message: "Product updated successfuly"
            })
        }
    } catch (error) {
        console.log(error);
    }
}

// delete
async function deleteProduct(req, res) {
    const { id } = req.params;
    const product = await getElementById(id)
    if (!product) res.status(404).send({ message: "Product not found" })
    else {
        const deleteP = await deleteData(id)
        res.send({ message: "Product has been deleted" })
    }
}
module.exports = {
    getAllData,
    getDataById,
    createData,
    updateProduct,
    deleteProduct,
    getAllImages
}