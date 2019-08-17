<template>
  <div>
    <el-form label-position="left" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="title"></el-input>
        </el-form-item>
      </el-form>
  </div>
</template>

<script>

export default {
  props: {

  },
  data() {
    return {
      title: '' 
    }
  },
  created() {
   
  },
  methods: {
    
  }
}
</script>

