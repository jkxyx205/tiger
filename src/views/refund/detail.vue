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
          <el-button size="small">同意</el-button>
          <el-button size="small" type="danger">拒绝</el-button>
        </div>
      </div>
      <div class="job-master-container-body">
        <div class="textarea-wrap">
          <label>退款理由:</label><span>{{ refund.description }}</span>
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
        <div class="pull-right">
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
          <div class="textarea-wrap">
            <div>
              <label>订单编号:</label><span>{{ refund.order2.id }}</span>
            </div>
            <div>
              <label>服务内容:</label><span>{{ refund.order2.description }}</span>
            </div>
            <div>
              <label>价格:</label><span>{{ refund.order2.price }}元</span>
            </div>
            <div>
              <label>创建日期:</label><span>{{ refund.order2.createDate | parseTime }}</span>
            </div>
            <div>
              <router-link :to="'/service/order/detail/'+ refund.order2.id">
                <el-link type="primary" size="small">
                  详情
                </el-link>
              </router-link>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import { findDetailById } from '@/api/platform/service/refund'
import Log from '@/components/Log'
import { mapGetters } from 'vuex'

export default {
  name: 'RefundDetail',
  components: { Log },
  data() {
    return {
      id: this.$route.params.id,
      refund: {
        order2: {

        }
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
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/platform/service/refund.scss';

.textarea-wrap {
  label {
    margin-right: 8px;
  }
  line-height: 1.5;

  & > div {
    margin: 16px 0;
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
</style>
