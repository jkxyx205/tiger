<template>
  <div class="job-detail-container">
    <div class="job-master-container border">
      <div class="job-master-container-header">
        <div class="data-item">
          <label>订单编号:</label><span>{{ order.id }}</span>
        </div>
        <div class="data-item">
          <label>类型:</label><span>{{ order.orderType | orderType }}</span>
        </div>
        <div class="data-item">
          <label>订单状态:</label><span :class="'circle-order-status-' + order.orderStatus">{{ order.orderStatus | orderStatus }}</span>
        </div>
        <div class="data-item">
          <label>开票状态:</label><span :class="'circle-invoice-status-' + order.invoiceStatus">{{ order.invoiceStatus | invoiceStatus }}</span>
        </div>
        <div class="pull-right operator-bar">
          <!-- <el-button size="small" @click="reDo()">重新处理</el-button> -->
          <el-button v-if="order.invoiceStatus == 1" type="primary" size="small" @click="popInvoiceDialog">完成开票</el-button>
        </div>
      </div>
      <div class="job-master-container-body">
        <div class="textarea-wrap">
          <label>服务描述:</label><span>{{ order.description }}</span>
        </div>
        <label>费用明细:</label>
        <div class="details">
          <el-table
            :data="order.details"
            style="width: 100%"
          >
            <el-table-column
              prop="title"
              label="费用名称"
              width="260"
            />
            <el-table-column
              prop="description"
              label="费用描述"
            />
            <el-table-column
              prop="price"
              label="价格(元)"
              width="100"
              align="right"
            />
          </el-table>
        </div>
      </div>
      <div class="job-master-container-footer">
        <div class="data-item">
          <label>公司:</label><span>{{ order.groupName }}</span>
        </div>
        <div class="data-item">
          <label>付款人:</label><span>{{ order.payerName }}</span>
        </div>
        <div class="data-item">
          <label>创建时间:</label><span>{{ order.createDate | parseTime }}</span>
        </div>
        <div class="pull-right" style="margin-right: -24px;">
          <div class="data-item">
            <label>支付时间:</label><span>{{ order.payDate | parseTime }}</span>
          </div>
          <div class="data-item">
            <label>价格:</label><span class="price">{{ order.price }}元</span>
          </div>
        </div>
      </div>
    </div>
    <div class="work-flow-container">
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="操作日志" name="log">
          <log :logs="order.logList" />
        </el-tab-pane>
        <template v-if="order.orderType === 0">
          <el-tab-pane label="工单单据" name="job">
            <job-summary v-if="order.job" :job="order.job" />
          </el-tab-pane>
          <el-tab-pane label="退款单据" name="refund">
            <template>
              <el-table
                :data="order.refundList"
                show-summary
                style="width: 100%"
              >
                <el-table-column
                  prop="id"
                  label="退款编号"
                  width="180"
                />
                <el-table-column
                  prop="description"
                  label="退款理由"
                />
                <el-table-column
                  prop="price"
                  label="退款金额"
                  align="right"
                />
                <el-table-column
                  label="申请时间"
                  align="center"
                  width="180"
                >
                  <template slot-scope="{ row }">
                    {{ row.createDate | parseTime }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="退款状态"
                  align="center"
                  width="180"
                >
                  <template slot-scope="{row}">
                    <span :class="'circle-refund-status-' + row.refundStatus">{{ row.refundStatus |refundStatus }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作"
                  width="180"
                  align="center"
                >
                  <template slot-scope="{ row }">
                    <router-link :to="'/service/refund/detail/'+ row.id">
                      <el-link type="primary" size="small">
                        详情
                      </el-link>
                    </router-link>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-tab-pane>
        </template>
      </el-tabs>
    </div>
    <el-dialog
      title="开票详情"
      :visible.sync="invoiceDialogVisible"
      width="500px"
    >
      <div class="info-container">
        <div class="label-info-container">
          <div>
            <div class="display-item">
              <label>抬头类型：</label><div>{{ order.invoiceInfo.invoiceType | invoiceType }}</div>
            </div>
            <div class="display-item">
              <label>发票抬头：</label><div>{{ order.invoiceInfo.title }}</div>
            </div>
            <div v-if="order.invoiceInfo.invoiceType === 1" class="display-item">
              <label>税号：</label><div>{{ order.invoiceInfo.num }}</div>
            </div>
            <div class="display-item">
              <label>邮寄地址：</label><div>{{ order.invoiceInfo.email }}</div>
            </div>
            <div v-if="order.invoiceInfo.invoiceType === 1" class="display-item">
              <label>注册地址：</label><div>{{ order.invoiceInfo.address }}</div>
            </div>
            <div v-if="order.invoiceInfo.invoiceType === 1" class="display-item">
              <label>注册电话：</label><div>{{ order.invoiceInfo.tel }}</div>
            </div>
            <div v-if="order.invoiceInfo.invoiceType === 1" class="display-item">
              <label>开户银行：</label><div>{{ order.invoiceInfo.bankName }}</div>
            </div>
            <div v-if="order.invoiceInfo.invoiceType === 1" class="display-item">
              <label>银行账号：</label><div>{{ order.invoiceInfo.account }}</div>
            </div>
            <div class="display-item">
              <label>备注：</label><div>{{ order.invoiceInfo.remarks }}</div>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="finishedInvoice">确认完成</el-button>
        <el-button @click="invoiceDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { findDetailById, finishedInvoice } from '@/api/platform/service/order'
import Log from '@/components/Log'
import { list } from '@/api/log'
import JobSummary from '@/views/job/components/JobSummary'
import { mapGetters } from 'vuex'

export default {
  name: 'OrderDetail',
  components: { Log, JobSummary },
  data() {
    return {
      id: this.$route.params.id,
      order: {
        invoiceInfo: {}
      },
      activeName: 'log',
      invoiceDialogVisible: false
    }
  },
  computed: {
    ...mapGetters([
      'userId'
    ])
  },
  created() {
    findDetailById(this.id).then(res => {
      this.order = res.data
    })
  },
  methods: {
    popInvoiceDialog() {
      this.invoiceDialogVisible = true
    },
    finishedInvoice() {
      finishedInvoice(this.order.id).then(res => {
        if (res.success) {
          this.invoiceDialogVisible = false
          this.order.invoiceStatus = 2
          this.$message.success('发票处理成功')
        }
      }).then(() => {
        list(this.order.id).then(res => {
          this.order.logList = res.data
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/platform/service/order.scss";
@import '@/styles/platform/service/refund.scss';

.textarea-wrap {
  label {
    margin-right: 8px;
  }
  line-height: 1.5;
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
    padding: 0 24px;
  }

  &-header {
    background: #f1f4f9;
    line-height: 48px;
  }

  &-body {
    & > div {
      padding-top: 32px;
      padding-bottom: 32px;
    }
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

.info-container {
  .display-item {
    /* position: relative;
    margin-left: -80px; */
    display: flex;
    margin-bottom: 16px;
    line-height: 1.6;
    label {
      width: 80px;
      /* position: absolute; */
    }
    div {
      flex: 1;
      /* position: absolute;
      top: 0;
      left: 80px;
      white-space: nowrap; */
      /* margin-left: 80px; */
    }
  }
  .label-info-container {
    display: flex;
    padding: 0 16%;
    justify-content: center;
  }
}
</style>
