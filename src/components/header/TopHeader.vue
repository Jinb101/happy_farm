<template>
    <div class=" h-full w-full">
        <van-nav-bar left-text=""
                     z-index="9999"
                     @click-left="onClickLeft"
                     left-arrow>
            <template #title>
                <span class=" text-gray-500">{{ title }}</span>
            </template>
            <template #right>
                <span @click="onClickRight"
                      v-if="rightShow === 'farm'"
                      class=" text-gray-500">土地</span>
            </template>
        </van-nav-bar>
        <van-action-sheet v-model:show="showPicker"
                          close-on-click-action
                          :actions="framList"
                          @select="onSelect" />

    </div>
</template>

<script setup >
import { useMainStore } from '@/store/index.js'
import { onMounted, watch, ref, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia'



const route = useRoute();
const mainStor = useMainStore()
const { farmPlotList } = storeToRefs(mainStor)

const title = ref('')
const framList = ref([])


const onClickLeft = () => history.back();
const onClickRight = () => {
    showPicker.value = true
};

const showPicker = ref(false);
const rightShow = ref('');

const onSelect = (item) => {
    mainStor.curFarmPlot = item;
};

watch(
    () => route.meta,
    () => {
        console.log(route.meta);
        nextTick(() => {
            if (route.meta.type) {
                rightShow.value = route.meta.type
            }
            title.value = route.meta.title
        });
    },
    { immediate: true }
);

onMounted(() => {
    console.log(farmPlotList.value);
    framList.value = farmPlotList.value.map((i, index) => ({
        ...i,
        name: i.Farm.farm_name,
    }))
    console.log(farmPlotList);
})

</script>

<style scoped >
:deep(.van-nav-bar) {
    height: 100%;
}
</style>
