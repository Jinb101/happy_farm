<template>
    <div id="qrcode"></div>
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


watch(
    () => props.open,
    (v) => {
        if (v) {
            init()
        }
    }
)


function base64ImgtoFile(dataurl, filename = 'file') {
    if (!dataurl) {
        console.error('dataurl 未定义');
        return null;
    }
    // 将 base64 格式分割：['data:image/png;base64', 'XXXX']
    const arr = dataurl.split(',');
    if (arr.length < 2) {
        console.error('Base64 数据格式错误');
        return null;
    }
    // .*？表示匹配任意字符到下一个符合条件的字符 刚好匹配到：
    // image/png
    const mime = arr[0].match(/:(.*?);/)[1];  // image/png
    // [image,png] 获取图片类型后缀
    const suffix = mime.split('/')[1];  // png
    const bstr = atob(arr[1]);   // atob() 方法用于解码使用 base-64 编码的字符串
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], `${filename}.${suffix}`, {
        type: mime
    });
}


const getBase64URL = (pic) => {
    const blob = base64ImgtoFile(pic)
    const blobUrl = window.URL.createObjectURL(blob);
    return blobUrl
}

const init = async () => {
    if (props.path === '' && open) {
        load.error('请重试');
        return;
    }
    load.show()
    // const { data } = await http.post(props.path);
    // console.log(data);
    // const imageUrl = getBase64URL(data);
    // console.log(imageUrl);
    load.hide()

}


onMounted(() => {
})

</script>

<style scoped ></style>
