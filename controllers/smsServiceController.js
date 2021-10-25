const { writeData } = require("../utiles");
const temp = require('../data/temp.json');

async function saveUrl(req, res) {
  const { url } = req.body;
  temp.url = url;
  writeData('./data/temp.json', temp);
  res.send({ message: "Url has been saved" })
}

async function getUrl(req, res) {
  res.send(temp.url);
}

module.exports = {
  saveUrl,
  getUrl
}