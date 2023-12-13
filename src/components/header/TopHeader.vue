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
                <span @click="onClickRight"
                      v-else-if="rightShow === 'family'"
                      class=" text-gray-500">邀请</span>
            </template>

        </van-nav-bar>
        <van-action-sheet v-model:show="showPicker"
                          close-on-click-action
                          :actions="framList"
                          :style="{ minHeight: '30%' }"
                          @select="onSelect" />
        <QrCode :path="qrPath"
                :open="openCode">
        </QrCode>
    </div>
</template>

<script setup >
import { useMainStore } from '@/store/index.js'
import { onMounted, watch, ref, nextTick, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia'
// 二维码
import QrCode from '@/components/code/QrCode.vue';


const load = inject("load");
const route = useRoute();
const mainStor = useMainStore()
const { farmPlotList } = storeToRefs(mainStor)

const title = ref('')
const framList = ref([])
const qrPath = ref('')
const openCode = ref(false)

const onClickLeft = () => history.back();
const onClickRight = () => {
    console.log(rightShow);
    switch (rightShow.value) {
        case "farm":
            showPicker.value = true
            break;
        case "family":
            qrPath.value = 'qrCode'
            openCode.value = true
            console.log('邀请');
            break;
        default:
            console.log(123);
            break;
    }

};

const showPicker = ref(false);
const rightShow = ref('');

const onSelect = (item) => {
    mainStor.curFarmPlot = item;
};

watch(
    () => route.meta,
    () => {
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
    if (farmPlotList.value) {
        framList.value = farmPlotList.value.map((i, index) => ({
            ...i,
            name: i.Farm.farm_name,
        }))
    }
    console.log(farmPlotList);
})

</script>

<style scoped >
:deep(.van-nav-bar) {
    height: 100%;
}
</style>
