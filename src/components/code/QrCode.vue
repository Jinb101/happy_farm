<template>
    <div id="qrcode">
        <img v-if="imgUrl !== ''"
             :src="imgUrl"
             alt=""
             srcset="">
    </div>
</template>

<script setup>
import { ref, onMounted, inject, unref, watch } from 'vue'



const http = inject("http")
const load = inject("load")
const Tools = inject("Tools")

// 定义 props
const props = defineProps({
    path: {
        type: String,
        required: ''
    },
    open: {
        type: Boolean,
        required: false
    }
});

const imgUrl = ref('')

watch(
    () => props.open,
    (v) => {
        if (v) {
            init()
        }
    }
)


const init = async () => {
    if (props.path === '' && open) {
        load.error('请重试');
        return;
    }
    load.show()
    const { data } = await http.post(props.path);
    const file = Tools.base64ToFile(data)
    console.log(file, `data:image/png;base64,${data}`);
    imgUrl.value = `data:image/png;base64,${data}`
    console.log(imgUrl.value);
    load.hide()

}


onMounted(() => {
})

</script>

<style scoped ></style>
