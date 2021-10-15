
const data = require('../data/data.json')
const uuid = require('uuid')
const { writeData } = require('../utiles');

// Get all Data
function getData() {
    return new Promise((resolve, reject) => {
        resolve(data)
    });
}

// get product by id
function getElementById(id) {
    return new Promise((resolve, reject) => {
        const element = data.find((p) => p.id == id)
        if (element) resolve(element);
        else resolve(0)
    });
}

function create(product) {
    return new Promise((resolve, reject) => {
        const newData = {
            id: uuid.v4(),
            ...product
        }
        
        data.push(newData);
        writeData('data/data.json', data)
        resolve(newData)
    })
}

function update(id, product) {
    return new Promise((resolve, reject) => {
        const index = data.findIndex(p => p.id === id)
        data[index] = { id, ...product }
        writeData('data/data.json', data)
        resolve(data[index])
    })
}

function deleteData (id) {
    return new Promise((resolve, reject) => {
        const delData = data.filter(p => p.id !== id)
        writeData("data/data.json", delData)
        resolve(1)
    })
}

// *****************- Images -**********************
const fs = require('fs');

function rename(previousName, newName) {
    // console.log("Rename", previousName, newName);
    return new Promise((resolve, reject) => {
        fs.rename(previousName, newName, err => {
            if (err) resolve(0);
            resolve(1)
        })
    })
}
function unlink(tempPath) {
    // console.log("UNLINK", tempPath);
    return new Promise((resolve, reject) => {
        fs.unlink(tempPath, err => {
            if (err) resolve(0)
            resolve(1)
        })
    })
}
module.exports = {
    getData,
    getElementById,
    create,
    update,
    deleteData,
    rename,
    unlink
}