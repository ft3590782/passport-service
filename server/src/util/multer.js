let multer = require('multer')
import dayjs from 'dayjs';

let fileExt = (originalname) => {
  let ext = originalname.split(".")
  return ext[ext.length - 1]
}

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'temp/uploads')
  },
  filename: function (req, file, cb) {
    let ext = fileExt(file.originalname)
    cb(null, file.fieldname + '-' + dayjs().format('YYYYMMDDHHmmss') + '-' + Math.random().toString().slice(-4) + "." + ext)
  }
})


let upload = multer({
  storage: storage
})

// module.exports = upload
export default upload;
