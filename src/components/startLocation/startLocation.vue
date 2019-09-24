/*
*  @描述：出发地下拉框
*  @作者：邱康松
*  @创建时间：2019/7/30
*/
<template>
  <el-select v-model="name" @change="changeValue" filterable>
    <el-option label="全部" :value="null"></el-option>
    <el-option v-for="item in list" :lable="item.locationName" :key="item.locationCode" :value="item.locationName"></el-option>
  </el-select>
</template>

<script>
  export default {
    name: "startLocation",
    props: {
      value: {
        type: String,
        default: null
      }
    },
    data() {
      return {
        name: null,
        list: []
      }
    },
    watch: {
      value(val) {
        if (!val) {
          this.name = null;
        }
      }
    },
    created() {
      this.$root.getStoreStart({
        type: 'S',
        enable: 1
      }).then(res => {
        if (res.code === 0) {
          this.list = res.data || [];
        }
      })
    },
    methods: {
      changeValue(val) {
        this.$emit('input',val);
        this.$emit('change',val);
      }
    }
  }
</script>

<style scoped>

</style>