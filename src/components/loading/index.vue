<template>
    <div class="loading"
         v-show="msg.show">
        <div class="load-box"
             :style="msg.full ? { height: '100%', width: '100%' } : { height: '100px', width: '100px' }">
            <!--<img src="@/assets/img/loading_white.png">-->
            <van-loading vertical
                         type="spinner"
                         color="#1989fa"
                         size="30px">{{ msg.title }}</van-loading>
        </div>
    </div>
</template>

<script setup>
import { inject, onBeforeMount, onMounted } from 'vue';



const props = defineProps({
    msg: {
        type: Object,
        default: () => ({ show: false, title: '', full: false }),
    },
});



</script>

<style scoped lang="scss">
.loading {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;

    // .load-box {
    //     background-color: #4c4c4c9a;
    //     width: 100px;
    //     height: 100px;
    //     border-radius: 6px;
    //     box-shadow: 0px 1px 10 px rgba(0, 0, 0, .5);
    //     color: #fff;
    //     display: flex;
    //     flex-direction: column;
    //     align-items: center;
    //     justify-content: center;
    //     letter-spacing: .8px;
    //     font-size: 13px;

    //     img {
    //         width: 30px;
    //         margin-bottom: 8px;
    //         animation: jump 1s ease-in-out infinite;

    //     }
    // }
}

// @keyframes jump {
//     0% {
//         transform: translateY(0);
//     }

//     50% {
//         transform: translateY(-20px);
//     }

//     100% {
//         transform: translateY(0);
//     }
// }
</style>
