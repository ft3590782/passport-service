<style>
.example-simple label.btn {
  margin-bottom: 0;
  margin-right: 1rem;
}
.upload {
  margin-top: 20px;
}
.upload ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
li {
  padding: 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
li .img {
  flex: 0 0 200px;
  margin-right: 20px;
}
li .img img {
  max-width: 200px;
  max-height: 100px;
}
li .content {
  flex: 1 1 auto;
}
li .option {
  flex: 0 0 100px;
  display: flex;
  justify-content: flex-end;
}
li .option .iconfont {
  font-size: 40px;
}
li .option .iconfont + li .option .iconfont {
  margin-left: 10px;
}
li:nth-child(even) {
  background: #e8e8e8;
}
li + li {
  border-top: 1px solid #eee;
}
</style>
<template>
  <div class="example-simple">
    <h1 id="example-title" class="example-title">图片转PDF</h1>
    <input class="input" v-model="filename" placeholder="请输入pdf文件名" />
    <div class="upload">
      <ul>
        <li v-for="(file, index) in files" :key="file.id">
          <span class="img" v-if="file.thumb"><img :src="file.thumb" alt="" width="200"></span>
          <span class="content">
          <span>{{file.name}}</span> -
          <span>{{file.size | formatSize}}</span> -
          <span v-if="file.error">{{file.error}}</span>
          <span v-else-if="file.success">success</span>
          <span v-else-if="file.active">active</span>
          <span v-else-if="file.active">active</span>
          <span v-else></span>
          </span>
          <span class="option">
            <i class="iconfont icon-close-circle" @click="removeImage(index)"></i>
          </span>
        </li>
      </ul>

      <div class="example-btn">
        <file-upload name="photo" class="btn btn-primary" post-action="http://localhost:3000/pdf/" extensions="jpg,jpeg,png,webp"
          accept="image/png,image/jpeg,image/webp" :multiple="true"  v-model="files"
          :timeout="5*1000" @input-filter="inputFilter" @input-file="inputFile" ref="upload">
          <i class="fa fa-plus"></i>
          选择图片文件
        </file-upload>
        <button type="button" class="btn btn-success" v-if="!$refs.upload || !$refs.upload.active" @click.prevent="$refs.upload.active = true">
          <i class="fa fa-arrow-up" aria-hidden="true"></i>
          上传图片
        </button>
        <button type="button" class="btn btn-danger"  v-else @click.prevent="$refs.upload.active = false">
          <i class="fa fa-stop" aria-hidden="true"></i>
          停止上传
        </button>
        <button type="button" class="btn " :class="btnDisable" v-if="!$refs.upload || !$refs.upload.active" @click.prevent="createPDF">
          <i class="fa fa-arrow-down" aria-hidden="true"></i>
         下载PDF
        </button>
      </div>
    </div>
  </div>
</template>


<script>
import FileUpload from "vue-upload-component";
import pdfService from "../service/pdfService";
export default {
  components: {
    FileUpload
  },

  data() {
    return {
      files: [],
      uploadedFiles: [],
      filename: ""
    };
  },
  computed: {
    btnDisable() {
      console.log(this.uploadedFiles);
      return this.uploadedFiles.length <= 0 ? "btn-disable" : "btn-success";
    }
  },
  methods: {
    removeImage(index) {
      this.files.splice(index, 1);
      this.uploadedFiles.splice(index, 1);
    },
    previewImage(file, index) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = evt => {
          resolve(evt.target.result);
          // this.files[index].previewImage = ;
        };
        reader.readAsDataURL(file);
      });
    },
    createPDF() {
      if (this.uploadedFiles.length <= 0) return false;
      pdfService.createPDF(this.uploadedFiles, this.filename).then(res => {
        console.log("pdfService", res);
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        // console.log(res);
        // let fname = res.headers["PDFname"] || "download.pdf";
        // 返回的header Content-Disposition:attachment; filename=elmeast-report-2018-2.pdf
        let head = res.headers["content-disposition"];
        let fname = this.filename === "" ? "download" : this.filename;
        fname += ".pdf";
        if (head) {
          try {
            fname = head.split(";")[1].split("=")[1];
          } catch (err) {
            console.log("can not get pdf name");
          }
        }
        link.href = url;
        link.setAttribute("download", fname);
        document.body.appendChild(link);
        link.click();
      });
    },
    inputFilter(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        // Before adding a file
        // 添加文件前

        // Filter system files or hide files
        // 过滤系统文件 和隐藏文件
        if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
          return prevent();
        }

        // Filter php html js file
        // 过滤 php html js 文件
        if (/\.(php5?|html?|jsx?)$/i.test(newFile.name)) {
          return prevent();
        }
      }
    },

    inputFile(newFile, oldFile) {
      if (newFile && !oldFile) {
        // 添加文件
      }

      if (newFile && (!oldFile || newFile.file !== oldFile.file)) {
        // Create a blob field
        // 创建 blob 字段
        newFile.blob = "";
        let URL = window.URL || window.webkitURL;
        if (URL && URL.createObjectURL) {
          newFile.blob = URL.createObjectURL(newFile.file);
        }

        // Thumbnails
        // 缩略图
        newFile.thumb = "";
        if (newFile.blob && newFile.type.substr(0, 6) === "image/") {
          newFile.thumb = newFile.blob;
        }
      }

      if (newFile && oldFile) {
        // 更新文件

        // 开始上传
        if (newFile.active !== oldFile.active) {
          console.log("Start upload", newFile.active, newFile);

          // 限定最小字节
          // if (newFile.size >= 0 && newFile.size < 100 * 1024) {
          //   newFile = this.$refs.upload.update(newFile, { error: "size" });
          // }
        }

        // 上传进度
        if (newFile.progress !== oldFile.progress) {
          console.log("progress", newFile.progress, newFile);
        }

        // 上传错误
        if (newFile.error !== oldFile.error) {
          console.log("error", newFile.error, newFile);
        }

        // 上传成功
        if (newFile.success !== oldFile.success) {
          console.log("success", newFile.success, newFile);
          if (newFile.response.code === 0) {
            this.uploadedFiles.push(...newFile.response.data);
          }
        }
      }

      if (!newFile && oldFile) {
        // 删除文件

        // 自动删除 服务器上的文件
        if (oldFile.success && oldFile.response.id) {
          // $.ajax({
          //   type: 'DELETE',
          //   url: '/file/delete?id=' + oldFile.response.id,
          // });
        }
      }

      // 自动上传
      // if (
      //   Boolean(newFile) !== Boolean(oldFile) ||
      //   oldFile.error !== newFile.error
      // ) {
      //   if (!this.$refs.upload.active) {
      //     this.$refs.upload.active = true;
      //   }
      // }
    }
  }
};
</script>