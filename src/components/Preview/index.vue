<template>
  <div class="preview-container">
    <el-dialog
      :visible.sync="dialogVisible"
      :fullscreen="true"
      @open="open"
      @closed="closed"
    >
      <div slot="title">
        <span>文件预览<i class="el-icon-view" /></span>
        <div class="download pull-right" style="margin-right: 48px;">
          <a :href="baseUrl + '/documents/download/' + file.id"><i class="el-icon-download" />下载</a>
        </div>
      </div>
      <div v-if="viewMode === 0" class="image-container">
        <el-image :src="url">
          <div slot="placeholder" class="image-slot">
            图片加载中<span class="dot">...</span>
          </div>
        </el-image>
      </div>
      <iframe v-else-if="viewMode === 1" :src="url" frameborder="0" />
      <div v-else-if="viewMode === -1" style="padding: 50px; text-align: center;">
        <span>该文件暂时无法提供在线预览，请下载后查看</span>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'Preview',
  data() {
    return {
      baseUrl: process.env.VUE_APP_FILE_UPLOAD,
      dialogVisible: false,
      file: {},
      url: '',
      viewMode: -1
    }
  },
  methods: {
    closed() {
      this.url = ''
      this.viewMode = -1
    },
    show(file) {
      this.file = file
      this.dialogVisible = true
    },
    open() {
      // this.url = `${this.baseUrl}/documents/preview/${this.file.id}`
      this.url = this.file.serverPath
      if (this.file.contentType.startsWith('image')) { // 图片类
        this.viewMode = 0
      } else if (/(doc[x]?)|(ppt[x]?)|(xls[x]?)/i.test(this.file.ext)) { // office
        // TODO
        this.url = `${this.baseUrl}/documents/preview2/${this.file.id}` // office需要域名,且端口是80，才能预览，目前需要转发,有独立的域名直接使用serverPath
        this.url = 'https://view.officeapps.live.com/op/view.aspx?src=' + encodeURIComponent(this.url)
        this.viewMode = 1
      } else if (this.file.contentType === 'application/pdf' || this.file.contentType.startsWith('text')) { // iframe
        this.viewMode = 1
      } else {
        this.viewMode = -1
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.preview-container {
  iframe {
    width: 100%;
    height: 100%;
  }
  & /deep/ .el-dialog__header {
    border-bottom: 1px solid #DCDFE6;
  }
  & /deep/ .el-dialog__body {
    padding: 0;
    height: calc(100% - 54px);
    overflow: auto;
  }
  .image-container {
    text-align: center;
    padding-top: 24px;
  }
  .download {
    a, a:focus, a:hover {
      color: #1890ff;
      cursor: pointer;
    }
  }
}
</style>
