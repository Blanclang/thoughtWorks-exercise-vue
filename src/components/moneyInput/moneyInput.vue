/*
*  @描述：自动添加千位符的输入框
*  @作者：邱康松
*  @创建时间：2019/7/15
*/
<template>
  <el-input v-model="money" placeholder="请输入" maxlength="20" :disabled="disabled"></el-input>
</template>

<script>
  export default {
    name: "moneyInput",
    data() {
      return {
        money: ''
      }
    },
    props: {
      value: {
        type: [Number,String],
        default: ''
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      formatMoney(n) {
        let b = parseFloat(n.replace(/,/ig,'')).toString();
        let len = b.length;
        if(len <= 3){ return b; }
        let r = len % 3;
        return r > 0 ? b.slice(0,r)+"," + b.slice(r,len).match(/\d{3}/g).join(",") : b.slice(r,len).match(/\d{3}/g).join(",");
      }
    },
    watch: {
      value(val) {
        this.money = val;
      },
      money(newVal,oldVal) {
        if (newVal) {
          newVal = String(newVal);
          if( (isNaN(parseFloat(newVal.replace(/,/ig,'')))) ){ //如果当前输入的不是数字就停止执行
            this.money = '';  //防止不是数字是input出现NaN提示
            return false;
          }

          if( /\./i.test(newVal) ){ //判断处理含有.的情况下

            if(/\.\d\d\d$/.test(newVal)){
              this.money = oldVal; //限制只能输入2位小数点
            }else{
              this.money = newVal.replace(/[^\d\.\,]/ig,'') //开始输入小数点之后，只能输入数字
            }

          }else{
            this.money = this.formatMoney(newVal);
          }
          this.$emit('input', this.money);
        }
      }
    }
  }
</script>

<style scoped>

</style>