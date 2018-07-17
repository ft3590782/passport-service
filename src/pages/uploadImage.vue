
<template>
  <div class="example-simple">
    <h1 id="example-title" class="example-title">Simple Example</h1>
    <div class="upload">
      <ul>
        <li v-for="(file, index) in files" :key="file.id">
          <span>{{file.name}}</span> -
          <span>{{file.size | formatSize}}</span> -
          <span v-if="file.error">{{file.error}}</span>
          <span v-else-if="file.success">success</span>
          <span v-else-if="file.active">active</span>
          <span v-else-if="file.active">active</span>
          <span v-else></span>
        </li>
      </ul>

      <div class="example-btn">
        <file-upload
          name="photo"
          class="btn btn-primary"
          post-action="http://localhost:3000/pdf/"
          extensions="gif,jpg,jpeg,png,webp"
          accept="image/png,image/gif,image/jpeg,image/webp"
          :multiple="true"
          :drop="true"
          :drop-directory="true"
          v-model="files"
          :timeout="5*1000"
          @input-filter="inputFilter"
          @input-file="inputFile"
          ref="upload">
          <i class="fa fa-plus"></i>
          Select files
        </file-upload>
        <!-- <button type="button" class="btn btn-success" v-if="!$refs.upload || !$refs.upload.active" @click.prevent="$refs.upload.active = true">
          <i class="fa fa-arrow-up" aria-hidden="true"></i>
          Start Upload
        </button>
        <button type="button" class="btn btn-danger"  v-else @click.prevent="$refs.upload.active = false">
          <i class="fa fa-stop" aria-hidden="true"></i>
          Stop Upload
        </button> -->
        <button type="button" class="btn btn-success" v-if="!$refs.upload || !$refs.upload.active"  @click.prevent="createPDF">
           <i class="fa fa-arrow-down" aria-hidden="true"></i>
          create pdf
        </button>
      </div>
    </div>
  </div>
</template>
<style>
.example-simple label.btn {
  margin-bottom: 0;
  margin-right: 1rem;
}
</style>

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
      uploadedFiles: []
    };
  },

  methods: {
    createPDF() {
      pdfService.createPDF(this.uploadedFiles).then(res => {
        console.log("pdfService", res);
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
      if (
        Boolean(newFile) !== Boolean(oldFile) ||
        oldFile.error !== newFile.error
      ) {
        if (!this.$refs.upload.active) {
          this.$refs.upload.active = true;
        }
      }
    }
  }
};
</script>
