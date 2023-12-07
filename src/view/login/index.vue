<template>
    <div class=" h-full w-full relative overflow-hidden">
        <div class="bg-[#14cd3f79]  h-[30%] w-full  flex justify-center items-center">
            <img src="@/assets/images/baicai.png"
                 class="h-12">
        </div>

        <div class="h-[100%] rounded-t-2xl absolute bottom-[-20%] left-0 right-0  bg-white shadow-inner  ">

            <transition name="fade">
                <div v-if="wxTransition === '0'"
                     class="transition-box">
                    <!-- 登录按钮 -->
                    <div class=" flex flex-col justify-between items-center h-[30%] w-[40%]">
                        <!-- 若您有登录账号且绑定微信的 -->
                        <van-button block
                                    round
                                    style="background-color: #07c160;color: white;border: none;"
                                    icon="wechat"
                                    @click.stop="onevent('wx')">微信一键登录</van-button>
                        <!-- 若您有登录账号 -->
                        <van-button block
                                    round
                                    style="background-color: #1989fa;color: white;border: none;"
                                    icon="coupon-o"
                                    @click.stop="onevent('login')">账号登录</van-button>
                        <!-- 若您是第一次进入 -->
                        <van-button block
                                    round
                                    style="background-color:rgb(105, 67, 242,.6);color: white;border: none;"
                                    icon="manager"
                                    @click="onevent('reg')">新用户注册</van-button>
                    </div>

                </div>
            </transition>
            <!-- 账号登录 -->
            <transition name="fade">
                <div v-if="wxTransition === '1'"
                     class=" transition-box">
                    <div class=" w-[70%] h-1/3 ">
                        <Login @on-submit="handleSubmit">
                            <UserName name="username" />
                            <Password name="password" />
                            <div class="auto-login">
                                <Checkbox v-model="autoLogin"
                                          size="large"> 自动登录</Checkbox>
                                <a>忘记密码</a>
                            </div>
                            <Submit />
                        </Login>
                    </div>
                </div>
            </transition>

        </div>


    </div>
</template>

<script setup>
import { ref } from 'vue'

let wxTransition = ref('0')

const onevent = (e) => {
    console.log(wxTransition.value);
    switch (e) {
        case "wx":
            // this.$refs.login.wxlogin();
            break;
        case "login":
            wxTransition.value = '1'
            // this.appPath("/login1");
            break;
        case "reg":
            // if (this.wx) {
            //     this.$refs.login.wxreg();
            // } else {
            //     this.appPath("/login_reg");
            // }
            break;
        default:
    }
}

const autoLogin = ref(true)

function handleSubmit(valid, { username, password }) {
    if (valid) {
        this.$Modal.info({
            title: '输入的内容如下：',
            content: 'username: ' + username + ' | password: ' + password
        });
    }
}


</script>

<style scoped >
:deep(.van-button__content .van-button__text) {
    width: 80% !important;
}

.transition-box {
    margin-top: 32px;
    width: 100%;
    height: 100%;
    border-radius: 4px;
    color: #fff;
    padding: 24px 0;
    display: flex;
    justify-content: center;
}



.auto-login {
    margin-bottom: 24px;
    text-align: left;
}

.auto-login a {
    float: right;
}
</style>
