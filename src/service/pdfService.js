import axiosWrap from './index'


export default {
  createPDF(files, filename) {
    return axiosWrap({
      method: 'POST',
      url: `/create/pdf`,
      responseType: 'blob',
      data: {
        files,
        filename
      }
    })
  }
}
