<template>
  <div>
    <el-dialog
      title="创建部署单"
      :visible.sync="dialogVisible"
      width="500px"
    >
      <div>
        这里是部署单
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendOrder()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    job: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  methods: {
    openDialog() {
      this.dialogVisible = true
    },
    sendOrder() {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
