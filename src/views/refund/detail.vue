<template>
  <div class="job-detail-container">
    <div class="job-master-container border">
      <div class="job-master-container-header">
        <div class="data-item">
          <label>退款编号:</label><span>{{ refund.id }}</span>
        </div>
        <div class="data-item">
          <label>状态:</label><span :class="'circle-refund-status-' + refund.refundStatus">{{ refund.refundStatus | refundStatus }}</span>
        </div>
        <div class="pull-right operator-bar">
          <template v-if="refund.refundStatus === 0">
            <el-button size="small" @click="ok">同意</el-button>
            <el-button size="small" type="danger" @click="rejectDialog">拒绝</el-button>
          </template>
          <el-button v-if="refund.refundStatus === 2" size="small" @click="paid">确认退款</el-button>
        </div>
      </div>
      <div class="job-master-container-body">
        <div class="textarea-wrap">
          <label>退款理由:</label><span>{{ refund.description }}</span>
        </div>
        <div v-if="refund.remarks" class="textarea-wrap">
          <label v-text="refund.refundStatus === 1 ? '拒绝理由' : '同意理由'" />
          <span>{{ refund.remarks }}</span>
        </div>
      </div>
      <div class="job-master-container-footer">
        <div class="data-item">
          <label>公司:</label><span>{{ refund.groupName }}</span>
        </div>
        <div class="data-item">
          <label>付款人:</label><span>{{ refund.payerName }}</span>
        </div>
        <div class="data-item">
          <label>创建时间:</label><span>{{ refund.createDate | parseTime }}</span>
        </div>
        <div class="pull-right" style="margin-right: -24px;">
          <div class="data-item">
            <label>退款时间:</label><span>{{ refund.paidDate | parseTime }}</span>
          </div>
          <div class="data-item">
            <label>退款金额:</label><span class="price">{{ refund.price }}元</span>
          </div>
        </div>
      </div>
    </div>
    <div class="work-flow-container">
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="操作日志" name="log">
          <log :logs="refund.logList" />
        </el-tab-pane>
        <el-tab-pane label="订单单据" name="order">
          <div class="order-tab">
            <div class="label-item">
              <label>订单编号:</label><span>{{ refund.order2.id }}</span>
              <div style="display:inline-block; margin-left: 16px;">
                <router-link :to="'/service/order/detail/'+ refund.order2.id">
                  <el-link type="primary" size="small">
                    详情
                  </el-link>
                </router-link>
              </div>
            </div>
            <div class="textarea-wrap">
              <label>服务内容:</label><span>{{ refund.order2.description }}</span>
            </div>
            <div class="label-item">
              <label>价格:</label><span>{{ refund.order2.price }}元</span>
            </div>
            <div class="label-item">
              <label>创建时间:</label><span>{{ refund.order2.createDate | parseTime }}</span>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog
      title=""
      :visible.sync="dialogVisible"
      width="800px"
      @close="form.remarks = ''"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <div v-show="dialogOpt">
          <h4 style="color:#ff4949;">注意：累计退款额已经超出订单金额，请填写同意退款理由</h4>
        </div>
        <el-form-item :label="dialogLabel" prop="remarks">
          <el-input v-model="form.remarks" type="textarea" :autosize="{ minRows: 3, maxRows: 5 }" maxlength="250" show-word-limit />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :load="saving" :disabled="form.remarks.trim().length <= 0" @click="action('form')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { findDetailById, refundCheck, ok, reject, finshed } from '@/api/platform/service/refund'
import Log from '@/components/Log'
import { mapGetters } from 'vuex'
import { list } from '@/api/log'

export default {
  name: 'RefundDetail',
  components: { Log },
  data() {
    return {
      id: this.$route.params.id,
      dialogVisible: false,
      dialogLabel: '',
      dialogOpt: '',
      saving: false,
      form: {
        remarks: ''
      },
      refund: {
        order2: {

        }
      },
      rules: {
        remarks: [
          { required: true, message: '请输入的理由', trigger: 'blur' },
          { min: 1, max: 250, message: '长度在 1 到 250 个字符', trigger: 'blur' }
        ]
      },
      activeName: 'log'
    }
  },
  computed: {
    ...mapGetters([
      'userId'
    ])
  },
  created() {
    this.$nextTick(() => {
      findDetailById(this.id).then(res => {
        this.refund = res.data
      })
    })
  },
  methods: {
    ok() {
      refundCheck(this.id).then(res => {
        if (!res.data) { // 累计退款额超过支付金额
          this.dialogLabel = '同意理由'
          this.dialogOpt = 1
          this.dialogVisible = true
        } else { // 正常退款
          this.$confirm('确认退款吗？', '提示', {
            type: 'warning'
          }).then(() => {
            ok(this.id, null).then(res => {
              this._commonAction(res.data)
            })
          }).catch(() => {})
        }
      })
    },
    rejectDialog() {
      this.dialogLabel = '拒绝理由'
      this.dialogOpt = 0
      this.dialogVisible = true
    },
    action(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.dialogOpt) { // 同意退款
            ok(this.id, this.form.remarks).then(res => {
              this.refund.remarks = this.form.remarks
              this._commonAction(res.data)
            })
          } else { // 拒绝退款
            reject(this.id, this.form.remarks).then(res => {
              this.refund.remarks = this.form.remarks
              this._commonAction(res.data)
            })
          }
        } else {
          return false
        }
      })
    },
    paid() {
      finshed(this.id).then(res => {
        this.dialogVisible = false
        this._commonAction(res.data)
      })
    },
    _commonAction(status) {
      this.dialogVisible = false
      this.saving = false
      this.refund.refundStatus = status
      this._refreshLog()
      this.$message({
        showClose: true,
        message: '操作完成',
        type: 'success'
      })
    },
    _refreshLog() {
      list(this.id).then(res => {
        this.refund.logList = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/platform/service/refund.scss';

.order-tab {
  padding: 20px;
}

.order-tab, .job-master-container-body {
  & > div {
    margin-bottom: 16px;
  }
}

.price {
  font-size: 1.2em;
  color: #F56C6C;
}

.job-detail-container {
  padding: 30px 20px;
  & > div {
    margin-bottom: 24px;
  }
  font-size: 14px;
}

.job-master-container {
  background: #f5f7fa;

  & > div {
    padding-left: 24px;
    padding-right: 24px;
  }

  &-header {
    background: #f1f4f9;
    line-height: 48px;
  }

  &-body {
    padding-top: 32px;
    padding-bottom: 32px;
    border-top: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
  }

  &-footer {
    background: #f5f7fa;
    line-height: 40px;
  }
}

.details /deep/ .el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #fff;
}

.el-tabs--border-card {
  box-shadow: none;
}
</style>
