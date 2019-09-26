<template>
  <div class="message-container">
    <el-form ref="form" label-position="left" label-width="80px" :rules="rules" :model="form">
      <el-form-item label="发送地址" prop="sendUrl">
        <el-input v-model="form.sendUrl" />
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="正文" prop="content">
        <div>
          <tinymce v-model="form.content" :height="200" />
        </div>
      </el-form-item>
      <el-form-item label="消息源" prop="groupId">
        <el-select v-model="form.groupId" placeholder="请选择消息源">
          <el-option v-for="group in datasource.groups" :key="group.id" :label="group.name" :value="group.id" />
        </el-select>
      </el-form-item>
      <el-row v-show="form.groupId > 0">
        <el-col :span="8">
          <el-form-item label="组件" prop="componentId">
            <el-select v-model="form.componentId" placeholder="请选择组件">
              <el-option v-for="component in datasource.components" :key="component.id" :label="component.name" :value="component.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="业务类型" prop="businessId">
            <el-select v-model="form.businessId" placeholder="请选择业务类型">
              <el-option v-for="business in businessDataSource" :key="business.id" :label="business.name" :value="business.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="实例id" prop="instanceId">
            <el-input v-model.number="form.instanceId" style="width: 193px;" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="收息用户" prop="destinations">
        <el-select v-model="form.destinations" multiple placeholder="请选择接消息收用户">
          <el-option v-for="destination in datasource.destinations" :key="destination.id" :label="destination.nickname" :value="destination.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="发送次数" prop="iterationCount">
        <el-input v-model.number="form.iterationCount" type="iterationCount" style="width: 193px;" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="saving" icon="el-icon-upload2" @click="submitForm('form')">发送</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { Message } from 'element-ui'
import { sendMessage } from '@/api/message'
import CBMapping from '@/utils/cpn-business-mapping'
import { list } from '@/api/group'
import { dict } from '@/api/group'

export default {
  name: 'Message',
  components: {
    Tinymce
  },
  data() {
    return {
      form: {
        sendUrl: `${process.env.VUE_APP_BASE_API2}/ws/messages/test`,
        title: '恭喜你注册，Hi',
        groupId: undefined, // 所属公司
        componentId: 1, // 组件id
        businessId: 10,
        instanceId: null,
        content: `<p>你好，先生／女士！</p>
<p>欢迎你注册<strong>点研智能平台</strong>，我们一起努力创造美好的<span style="background-color: #ff0000;">未来</span>！！！！</p>`,
        destinations: [],
        iterationCount: 1
      },
      saving: false,
      datasource: {
        groups: [
          {
            id: 0,
            name: '系统消息'
          }
        ],
        components: [
          {
            id: 1,
            name: '企业建站'
          }
        ],
        destinations: []
      },
      rules: {
        sendUrl: [
          { required: true, message: '请输入发送地址', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '请输入消息标题', trigger: 'blur' }
        ],
        groupId: [
          { required: true, message: '请输入消息标题', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入消息内容', trigger: 'blur' }
        ],
        componentId: [
          { required: true, message: '请选择组件', trigger: 'blur' }
        ],
        destinations: [
          { required: true, message: '请选择接收消息的用户', trigger: 'blur' }
        ],
        iterationCount: [
          { required: true, message: '发送次数不能为空', trigger: 'blur' },
          { type: 'number', message: '发送次数只能是数字', trigger: 'blur' }
        ],
        instanceId: []
      }
    }
  },
  computed: {
    businessDataSource() {
      return CBMapping[this.form.componentId]
    },
    groupId() {
      return this.form.groupId
    }
  },
  watch: {
    groupId(newValue) {
      const requiredRule = { required: true, message: '实例id不能为空', trigger: 'blur' }
      const commonRules = [{ type: 'number', message: '实例id只能是数字', trigger: 'blur' }]
      if (newValue === 0) {
        this.rules.instanceId = commonRules
      } else {
        this.rules.instanceId = commonRules.concat(requiredRule)
      }

      dict(this.groupId).then(res => {
        this.datasource.destinations = res.data
      })
    }
  },
  created() {
    this.$nextTick(() => {
      list().then(res => {
        this.datasource.groups = this.datasource.groups.concat(res.data.rows)
      })
      this.form.groupId = 0
    })
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.saving = true
          sendMessage(this.form.sendUrl + '?iterationCount=' + this.form.iterationCount, this._normalizeData(this.form)).then(res => {
            this.saving = false
            Message({
              message: '消息发送成功',
              type: 'success',
              duration: 5 * 1000
            })
          }).catch(data => {
            this.saving = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    _normalizeData(data) {
      const _data = Object.assign({}, data)
      if (_data.groupId === 0) {
        _data.componentId = 0
        _data.businessId = 0
        _data.instanceId = 0
      }
      return _data
    }
  }
}
</script>

<style lang="scss" scoped>
.message-container {
  margin: 30px 20px;
}
</style>
