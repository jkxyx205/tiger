<template>
  <div class="file-upload">
    <el-upload
      ref="upload"
      class="upload-demo"
      :multiple="true"
      :action="baseUrl + '/documents/upload'"
      :limit="5"
      :on-exceed="exceed"
      :on-success="success"
      :before-upload="beforeUpload"
    >
      <el-button size="small" type="default">📎附件上传</el-button>
      <span slot="tip" class="el-upload__tip" style="margin-left: 8px;">最多上传5个附件，每个附件大小不超过8M</span>
    </el-upload>
  </div>
</template>
<script>

const UPLOAD_MAX_SIZE = 8 // M

export default {
  name: 'FileUpload',
  data() {
    return {
      fileList: [],
      baseUrl: process.env.VUE_APP_FILE_UPLOAD
    }
  },
  methods: {
    beforeUpload(file) {
      if (file.size > UPLOAD_MAX_SIZE * 1024 * 1024) {
        this.$message.error(`文件最大不能超过${UPLOAD_MAX_SIZE}M`)
        return false
      }
      return true
    },
    exceed(files, fileList) {
      this.$message.warning(`当前限制选择5个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    success(response, file, fileList) {
      this.fileList = fileList
    },
    getAttachments() {
      return this._normalize2JSONAttachment()
    },
    clearFiles() {
      return this.$refs.upload.clearFiles()
    },
    _normalize2JSONAttachment() {
      const attachments = []
      if (this.fileList.length > 0) {
        this.fileList.forEach(item => {
          const fileInfo = item.response.data[0]
          attachments.push({
            id: fileInfo.id,
            name: fileInfo.fullName
          })
        })
      }
      return JSON.stringify(attachments)
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
