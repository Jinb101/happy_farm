<template>
    <div class=" baby_detail h-full w-full">
        <div class="play h-full w-full">
            <iframe :src="pathUrl"
                    frameborder="0"
                    :class="{ auto: full }"
                    allowfullscreen="allowfullscreen"
                    mozallowfullscreen="mozallowfullscreen"
                    msallowfullscreen="msallowfullscreen"
                    oallowfullscreen="oallowfullscreen"
                    webkitallowfullscreen="webkitallowfullscreen"
                    ref="frame"></iframe>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch, inject, unref } from 'vue';
import { useMainStore } from '@/store/index.js'
import { storeToRefs } from 'pinia'

const http = inject("http")
const load = inject("load")
const Tools = inject("Tools")
const mainStor = useMainStore()
const { masData, nursery_id } = storeToRefs(mainStor)

// true if 萤石云 false 大华
const passageToken = ref('')
// 节点
const frame = ref(null)
// 节点
const full = ref(false)
// 地址
const pathUrl = ref('')


watch(
    () => full.value,
    (val) => {
        console.log(val);
        // '&rotate=1' +     height: 40%;
    }
)


const init = () => {
    // true 萤石云  false 大华
    passageToken.value = unref(masData).device_type === '1' ? unref(masData).access_token : masData.value.getkit_token
    let type = +unref(masData).device_type === 1;
    if (unref(masData).device_type === undefined) {
        type = true;
    }
    const url = Tools.encrypt({
        token: passageToken.value,
        url: unref(masData).hd_address,
        time: [
            unref(masData).morning_start,
            unref(masData).morning_end,
            unref(masData).afternoon_start,
            unref(masData).afternoon_end,
        ],
        now: unref(masData).server_time, // 当前时间 服务器返
        width: frame.value.clientWidth,
        height: frame.value.clientHeight,
        type,
        channid: unref(masData).channeiid || 0,
        deviceid: unref(masData).device_id || "",
        ooo: {
            t: unref(masData).user.phone || "",
            po: unref(masData).user.pay_openid || "",
            b: unref(masData).user.user_id,
            id: nursery_id.value,
        },
    },
        "baby",
        "admin"
    )
    console.log(url);
    pathUrl.value = "http://official.jsxrk.xin/500/h5/surveillance/?h5=" +
        url +
        "&definition=" +
        true;
    console.log(frame);
    load.clear()
}


onMounted(() => {
    // 初始 获取视频信息
    init()
})


</script>

<style scoped>
.play iframe {
    height: 40%;
    width: 100%;
}

.play iframe p {
    font-size: 24px !important;
}
</style>
