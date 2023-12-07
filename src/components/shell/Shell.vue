<template>
    <div class="app-container ">
        <!-- 顶部导航栏 -->
        <div class="header"
             v-if="isShowHeader">
            <TopHeader />
        </div>


        <!-- 页面内容区域插槽 -->
        <div class="content-container"
             :style="{ height: contentHeight }">
            <slot />
        </div>
        <!-- 底部导航栏 -->
        <div class="  "
             v-if="isShowFooter">
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

const isShowFooter = ref(false)
const isShowHeader = ref(false)

const route = useRoute();

watch(
    () => route.meta,
    () => {
        nextTick(() => {
            //   console.log(route.meta);
            isShowFooter.value = route.meta.tab;
            isShowHeader.value = route.meta.hea;
        });
    },
    { immediate: true }
);

// 计算页面内容区域的高度
const contentHeight = computed(() => {
    if (!isShowHeader.value && !isShowFooter.value) {
        return "100%";
    } else if (isShowHeader.value && !isShowFooter.value) {
        return "94%";
    } else if (isShowHeader.value && isShowFooter.value) {
        return "84%";
    } else if (!isShowHeader.value && isShowFooter.value) {
        return "92%";
    }
});



</script>
<style >
/* 样式可以在这里定义 */
.app-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    /* 设置容器高度为视窗度 */
}

.header {
    height: 6%;
    width: 100%;
}



.content-container {
    width: 100%;
}
</style>
