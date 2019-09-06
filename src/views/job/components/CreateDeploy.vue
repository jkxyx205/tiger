<template>
  <div class="deploy">
    <el-dialog
      title="创建部署清单"
      :visible.sync="dialogVisible"
      width="800px"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="部署内容" prop="description">
          <el-input v-model="form.description" type="textarea" :autosize="{ minRows: 4, maxRows: 8}" placeholder="请输入部署内容" />
        </el-form-item>
        <el-form-item>
          <file-upload ref="fileUpload" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button :loading="saving" type="primary" @click="sendDeploy('form')">确 定</el-button>
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
        attachments: ''
      },
      rules: {
        description: [
          { required: true, message: '部署内容', trigger: 'blur' }
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
      this.form.description = ''
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
