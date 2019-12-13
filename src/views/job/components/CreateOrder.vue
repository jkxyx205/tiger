<template>
  <div class="create-order">
    <el-dialog
      title="创建订单"
      :visible.sync="dialogVisible"
      width="800px"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="服务款项">
          <span>服务工单</span>
        </el-form-item>
        <el-form-item label="付款公司">
          <span>{{ job.groupName }}</span>
        </el-form-item>
        <el-form-item label="服务内容" prop="description">
          <el-input v-model="form.description" type="textarea" :autosize="{ minRows: 4, maxRows: 8}" maxlength="1000" placeholder="填写服务内容" />
        </el-form-item>
        <el-form-item label="费用明细" prop="details">
          <el-table
            :data="form.details"
            border
            height="250"
            style="width: 100%"
          >
            <el-table-column
              prop="title"
              label="费用名称"
              width="180"
            >
              <template slot-scope="{ row }">
                <input v-model="row.title" class="table-input" maxlength="20" required placeholder="填写费用名称(必填)">
              </template>
            </el-table-column>
            <el-table-column
              prop="description"
              label="费用描述"
            >
              <template slot-scope="{ row }">
                <input v-model="row.description" class="table-input" maxlength="50" placeholder="填写费用描述">
              </template>
            </el-table-column>
            <el-table-column
              prop="price"
              label="价格"
              width="100"
              align="right"
            >
              <template slot-scope="{ row }">
                <input v-model="row.price" class="table-input" type="number" maxlength="5" required placeholder="价格(必填)">
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="80"
              align="center"
            >
              <template slot-scope="{ row, $index }">
                <el-link type="primary" @click="remove($index)">删除</el-link>
              </template>
            </el-table-column>
          </el-table>
          <div class="addDetail">
            <el-button v-show="form.details.length < 10" @click="addDetail">新增明细</el-button>
            <div class="pull-right">
              <label>总价：</label><span class="totalPrice">{{ totalPrice }}元</span>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="creating" @click="sendOrder('form')">创 建</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { createJobOrder } from '@/api/platform/service/order'
import { add } from '@/utils/index'
export default {
  props: {
    job: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    const validateDetail = (rule, value, callback) => {
      if (this._checkEmptyError()) {
        callback(new Error('1. 费用明细“费用名称”和“价格”是必填项目; 2. ”价格”必须是大于0的数字，最多2位小数'))
      }
      callback()
    }
    const notBlankValidator = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('不能全部为空字符串'))
      }
      callback()
    }
    return {
      dialogVisible: false,
      creating: false,
      form: {
        description: '',
        detailJSON: '',
        details: []
      },
      rules: {
        description: [
          { required: true, message: '请输入服务内容', trigger: 'blur' },
          { min: 1, max: 200, message: '长度在 5 到 200 个字符', trigger: 'blur' },
          { validator: notBlankValidator, trigger: 'blur' }
        ],
        details: [
          { required: true, message: '请添加费用明细', trigger: 'blur' },
          { validator: validateDetail, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    totalPrice() {
      let sum = 0
      this.form.details.forEach(detail => {
        if (!detail.price) {
          return sum
        }
        sum = add(sum, detail.price)
      })
      return sum
    }
  },
  methods: {
    openDialog() {
      this.dialogVisible = true
    },
    addDetail() {
      this.form.details.push({
        index: this.form.details.length,
        title: '',
        description: '',
        price: undefined
      })
    },
    remove(index) {
      this.form.details.splice(index, 1)
    },
    sendOrder(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.creating = true
          createJobOrder(this._normalizeData()).then(res => {
            this._resetData()
            this.dialogVisible = false
            this.creating = false
            this.$message.success('订单创建成功')
            this.$emit('create-success')
          })
        } else {
          return false
        }
      })
    },
    _normalizeData() {
      var data = {}
      data.details = this.form.details
      data.description = this.form.description
      data.groupId = this.job.groupId
      data.payer = this.job.createBy
      data.job = {}
      data.job.id = this.job.id
      data.price = this.totalPrice
      return data
    },
    _resetData() {
      this.form.details = []
      this.form.detailJSON = ''
      this.form.description = ''
    },
    _checkEmptyError() {
      const length = this.form.details.length
      for (let i = 0; i < length; i++) {
        const row = this.form.details[i]
        if (!row.title.trim() || !row.price || !/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(row.price)) {
          return true
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.create-order {
  & /deep/ .el-table--border tbody .cell {
    padding: 0!important;
  }
  & /deep/ .el-table--medium td {
    padding: 0;
  }
}
.table-input {
  height: 40px;
  width: 100%;
  border: none;
  padding: 10px;
}
.addDetail {
  padding: 10px 0;
  text-align: center;
}
.totalPrice {
  color: #F56C6C;
  font-size: 1.2em;
}
</style>
