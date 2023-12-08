<template>
    <div class="loading"
         v-show="msg.show">
        <div :class="msg.full ? 'load_box' : ''">
            <!--<img src="@/assets/img/loading_white.png">-->
            <van-loading vertical
                         type="spinner"
                         color="#AAB5B7"
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

    .load_box {
        height: 100%;
        width: 100%;
        background-color: #4c4c4c5e;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        letter-spacing: .8px;
        font-size: 13px;
    }
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
