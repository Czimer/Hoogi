const multer = require('multer')
const appConfig = require('../appConfig')

const Storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, appConfig.photosPath)
    },
    filename(req, file, callback) {
        console.log(file)
        callback(null, `${file.originalname}-${Date.now()}.jpg`)
    },
})

const upload = multer({ storage: Storage })

module.exports = upload