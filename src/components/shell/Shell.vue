<template>
    <div class="app-container ">
        <!-- 顶部导航栏 -->
        <div class="header"
             v-if="isShowHeader">
            <TopHeader />
        </div>



        <!-- 页面内容区域插槽 -->
        <div class="content-container z-[999]"
             :style="{ height: contentHeight }">
            <slot />

        </div>

        <div v-show="isShowFooter"
             class=" footer  z-[1000]">
            <BottomFooter />
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount, watch, nextTick, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import TopHeader from "@/components/header/TopHeader.vue";
import BottomFooter from "@/components/footer/BottomFooter.vue";

const props = defineProps({
    showFooter: {
        type: Boolean,
        default: false,
    },
    showHeader: {
        type: Boolean,
        default: false,
    },
});
const route = useRoute();
const isShowFooter = ref(false)
const isShowHeader = ref(false)





// 计算页面内容区域的高度
const contentHeight = computed(() => {
    if (!isShowHeader.value && !isShowFooter.value) {
        return "100vh";
    } else if (isShowHeader.value && !isShowFooter.value) {
        return "94%";
    } else if (isShowHeader.value && isShowFooter.value) {
        return "84%";
    } else if (!isShowHeader.value && isShowFooter.value) {
        return "92%";
    }
});


watch(
    () => route.meta,
    () => {
        nextTick(() => {
            isShowFooter.value = route.meta.tab;
            isShowHeader.value = route.meta.hea;
        });
    },
    { immediate: true }
);




</script>
<style >
* {
    margin: 0;
    padding: 0;
}

/* 样式可以在这里定义 */
.app-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100vw;
    /* 设置容器高度为视窗度 */
}

.header {
    height: 6%;
    width: 100%;
    transition: all .5s ease;
}

.footer {
    transition: all .5s ease;
}


.content-container {
    width: 100%;
}
</style>
