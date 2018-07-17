import axiosWrap from './index'


export default {
  createPDF(files) {
    return axiosWrap({
      method: 'POST',
      url: `/create/pdf`,
      data: {
        files
      }
    })
  }
}
