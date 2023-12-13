<template>
    <div class=""></div>
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

const init = async () => {
    if (props.path === '' && open) {
        load.error('请重试')
        return
    }
    const { data } = await http.post(props.path)
    console.log(data);
}

onMounted(() => {
})

</script>

<style scoped ></style>
