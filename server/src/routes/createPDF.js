import PDFDocument from 'pdfkit'
import fs from 'fs'
import express from 'express'
import upload from '../util/multer'
import _ from 'lodash'
import config from '../config'



const _createPDF = (res, filename = "output") => {

  return new Promise((resolve, reject) => {
    console.log('####################################createPDF#################################')
    // console.log(createPDF)

    let doc = new PDFDocument();
    // create a document the same way as above
    let filePath = `temp/pdf/${filename}-${Date.now()}.pdf`
    // add your content to the document here, as usual
    let stream = doc.pipe(fs.createWriteStream(filePath));
    const width = '612'
    res.forEach((item, index) => {
      if (index === 0) {
        doc.image(item.path, 0, 0, {
          width: width,
          //   fit: fit,
          align: 'center',
          valign: 'center'
        })
      } else {
        doc.addPage().image(item.path, 0, 0, {
          width: width,
          //   fit: fit,
          align: 'center',
          valign: 'center'
        })
      }

    })

    // draw some text
    // get a blob when you're done
    doc.end()
    stream.on('finish', function () {
      resolve(filePath)
    });
  })
}

// import blobStream from 'blob-stream';
const photoUpload = upload.array('photo', 10)

const resultObj = {
  code: 0,
  data: null,
  message: 'success'
}

let router = express.Router();

router.post('/create/pdf', (req, res) => {
  console.log(req.files)
})

router.post('/pdf', function (req, res) {

  let obj = _.clone(resultObj)
  photoUpload(req, res, function (err) {
    // console.log('err')
    // console.log(err)
    if (err) {
      obj.code = 1;
      obj.message = err
      obj.message = '上传失败!'
      res.json(obj);
    } else {
      obj.code = 0;
      obj.data = req.files
      obj.message = '上传成功!'
      res.json(obj);
      //   console.log(req.files) //req.file文件的具体信息
      //   _createPDF(req.files, 'mytest').then(result => {
      //     // res.download(result);
      //     obj.code = 0;
      //     // console.log(req.headers.origin)
      //     obj.data = config.serverRoot + result
      //     obj.message = err
      //     res.json(obj);
      //   })
    }
  })
})



export default router;
