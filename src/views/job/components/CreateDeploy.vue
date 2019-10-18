<template>
  <div class="deploy">
    <el-dialog
      title="创建部署清单"
      :visible.sync="dialogVisible"
      width="800px"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="部署内容" prop="description">
          <el-input v-model="form.description" type="textarea" :autosize="{ minRows: 4, maxRows: 8}" maxlength="1000" placeholder="请输入部署内容" show-word-limit />
        </el-form-item>
        <el-form-item>
          <file-upload ref="fileUpload" />
        </el-form-item>
        <el-form-item label="预览链接" prop="viewLink">
          <el-input v-model="form.viewLink" type="text" placeholder="请输入预览链接,如http://www.etmode.com" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button :loading="saving" :disabled="form.description.trim().length <= 0" type="primary" @click="sendDeploy('form')">创 建</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import FileUpload from '@/components/FileUpload'
import { createJobDeploy } from '@/api/platform/service/deploy'

export default {
  name: 'CreateDeploy',
  components: { FileUpload },
  props: {
    job: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dialogVisible: false,
      saving: false,
      form: {
        description: '',
        viewLink: '',
        attachments: ''
      },
      rules: {
        description: [
          { required: true, message: '部署内容不能为空', trigger: 'blur' }
        ],
        viewLink: [
          { type: 'url', message: '请输入正确的链接地址', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    openDialog() {
      this.dialogVisible = true
    },
    sendDeploy(formName) {
      this.$refs[formName].validate((valid) => {
        if (!this.$refs.fileUpload.isAllUpload()) {
          this.$message.error('正在上传附件，上传完成之后再创建')
          return
        }

        if (valid) {
          this.saving = true
          this.form.attachments = this.$refs.fileUpload.getAttachments()
          createJobDeploy(this._normalizeData()).then(res => {
            this.dialogVisible = false
            this._resetForm()
            this.saving = false
            this.$message.success('部署单成功')
            this.$emit('create-success', res.data)
          })
        } else {
          return false
        }
      })
    },
    _normalizeData() {
      var data = Object.assign({}, this.form)
      data.job = {}
      data.job.id = this.job.id
      data.groupId = this.job.groupId
      return data
    },
    _resetForm() {
      this.form.attachments = ''
      this.form.viewLink = ''
      this.form.description = ''
      this.$refs.fileUpload.clearFiles()
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
