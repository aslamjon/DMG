const fs = require('fs');
const path = require("path");

const writeData = (filename, content) => {
    fs.writeFile(filename, JSON.stringify(content, null, 4), 'utf8', (err) => {
        if (err) console.log(err);
    })
}

// *****************- Images -**********************
async function saveImg(req, res, file) {
    const tempPath = file.path;
    let originalName = file.originalname;

    function addDateTime(name) {
        const newDate = new Date()
        const orginalNameArr = name.split(".")
        const fileType = orginalNameArr.pop()
        const getDate = newDate.toLocaleDateString().split('/').join('_');
        const getTime = newDate.toLocaleTimeString().split(' ')[0].split(':').join('_');
        const milliseconds = newDate.getMilliseconds();
        orginalNameArr.push(`_${getDate}_${getTime}_${milliseconds}`);
        orginalNameArr.push(`.${fileType}`);
        return orginalNameArr.join('');
    }

    originalName = addDateTime(originalName);
    const targetPath = path.join(__dirname, `./data/images/${originalName}`);

    // Create Img
    if (path.extname(file.originalname).toLowerCase() && (".png" || ".svg" || ".jpg")) {
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
// ********************************************************
module.exports = {
    writeData,
    rename,
    unlink,
    saveImg
}