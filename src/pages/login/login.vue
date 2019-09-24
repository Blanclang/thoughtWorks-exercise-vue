/*
*  @描述：登陆
*  @作者：白朗
*  @创建时间：2018/7/6
*/
<template>
  <div class="login_frame flex_cc">
    <div class="login_box flex_cc">
      <div class="content">
        <div class="left">
          <div class="left-main">
            <img src="../../assets/images/logo_big.png" alt="">
            <img src="../../assets/images/sts-text.png" alt="" class="sts">
            <p class="login-title">圣泽捷通智慧整车物流系统</p>
            <p class="slogen">成为拥有公信力的卓越公司</p>
          </div>
        </div>
        <div class="right">
          <div class="er_code" v-loading="loading" element-loading-text="正在登录...">
            <div id="qrCode_test" class="code_img"></div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="corporation">
      <p>Copyright JieTong Corporation, All Rights Reserved</p>
      <p>@捷通 版权所有</p>
    </div> -->
  </div>
</template>
<script>
  require('../../assets/js/wwLogin-1.0.0');
  import Cookies from "js-cookie";
  export default {
    name: "login",
    data() {
      return {
        loading: false,
        wxUrl:wxUrl
      };
    },
    mounted(){
      if(window.location.protocol == 'https:'){
        this.wxUrl = this.wxUrl.replace(/http/g,"https");
      }
      this.initLogin();
    },
    methods: {
      initLogin() {
       /* Cookies.remove("vlsCompanyToken",{domain:""});
        localStorage.removeItem('data');
        this.$store.commit('CLEAR_USER_INFO');*/
        window.WwLogin({
          "id":"qrCode_test",
          "appid": env === '--online' ? "ww52cb4d79d2f95faf" : 'ww101500cbd329116a',
          "agentid":wxAgentId,
          "redirect_uri":this.wxUrl + '/v1/sysCom/user/oauth/white',
          "state":"jt_smartVls",
          "href":"",
          callback:this.login
        });
      },
      login(res) {
        let code = res.code;
        let msg = res.message;
        if(code === 0){
          let data = res.data;
          if(data){
            Cookies.set("vlsCompanyToken",data,{expires:7});
            this.$store.commit('SET_TOKEN',data);
            this.getUserData().then(() => {
              this.$router.push('/home');
            })
          } else {
            this.$message.warning("企业微信授权失败");
          }
        } else {
          this.$message({
            type:"error",
            message:msg
          })
        }
      },
      getUserData() {
        return new Promise((resolve,reject) => {
          this.loading = true;
          this.$root.getUserByToken().then(res => {
            this.loading = false;
            if (+res.code === 0) {
              localStorage.setItem('data',JSON.stringify(res.data));
              this.$store.commit('SET_USER_INFO',res.data);
              resolve();
            } else {
              reject();
            }
          }).catch(() => {
            this.loading = false;
            reject()
          })
        })
      },
    },
  }
</script>

<style lang="scss">
  .login_frame {
    .er_code{
      position: relative;
      border-radius: 2px;
      width: 460px;
      display: flex;
      height: 600px;
      align-items: center;
      background-color: #ffffff;
      .code_tit{
        padding: 1.5rem;
        color: #000000;
        font-size: 1.2rem;
        text-align: center;
      }
      .code_img{
        margin: auto;
      }
      .code_tip{
        margin-top: 0.5rem;
        .code_tipimg{
          width: 1rem;
          height: 1rem;
        }
        p{
          padding-left: 0.5rem;
          font-size: 1rem;
          color: #666666;
          a{
            color: red;
            padding:0px 6px 0px 2px;
          }
        }
      }
    }
    width: 100%;
    height: 100%;
    position: relative;
    background-color: #0c1218;
    .login_box{
      width: 100%;
      height: 100%;
      background-image:url("../../assets/images/login_bg.jpg");
      background-size:cover;
      .left {
        width: 600px;
        height: 600px;
        background:linear-gradient(130deg,rgba(167,210,255,1) 0%,rgba(98,112,183,0.8) 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        .left-main {
          margin-top: 80px;
        }
        img {
          display: block;
          margin: auto;
        }
        .sts {
          margin-top: 40px;
        }
        .login-title {
          margin-top: 40px;
          font-size:34px;
          font-weight:bold;
          color:rgba(255,255,255,1);
        }
        .slogen {
          font-size: 16px;
          color: #ffffff;
          margin-top: 40px;
          text-align: center;
          letter-spacing: 8px;
        }
      }
      .left,.right {
        float: left;
      }
    }
    .corporation{
      position: absolute;
      bottom:3%;
      left: 50%;
      margin-left: -185px;
      p{
        line-height: 25px;
        text-align: center;
        color: rgba(255, 255, 255, 0.5);
      }
    }
  }
</style>
