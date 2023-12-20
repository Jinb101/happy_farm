<template>
    <div class=" h-full w-full ">

        <div class=" h-[5%] w-full">
            <van-search v-model="searchValue"
                        shape="round"
                        show-action
                        placeholder="请输入搜索关键词"
                        @search="onSearch">
                <template #action>
                    <div @click="onClickButton">搜索</div>
                </template>
            </van-search>
        </div>
        <!-- 主体 -->


        <div class=" w-full h-[95%] pt-4 ">
            <van-list v-model:loading="loading"
                      :finished="finished"
                      finished-text="没有更多了"
                      :offset="200"
                      @load="onLoad">
                <div class=" w-[40%] h-[6rem] bg-gray-100 mb-6"
                     v-for=" item in list"
                     @click="viewItem(item)">
                    <div class=" h-1/4 w-full bg-gray-200 flex justify-between items-center px-2">
                        <span class=" text-xs">{{ item.parent }}</span>
                        <van-icon color="yellow"
                                  name="shop-collect-o" />
                    </div>
                    <div></div>`
                </div>
            </van-list>
        </div>

    </div>
</template>

<script setup>
import { onMounted, inject, ref, unref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMainStore } from '@/store/index.js'
import { storeToRefs } from 'pinia'

const router = useRouter();
const mainStor = useMainStore()
const { curFarmPlot } = storeToRefs(mainStor)

const http = inject("http");
const load = inject("load");
const Tools = inject("Tools");

const list = ref([
]);
const loading = ref(false);
const finished = ref(false);

const paging = ref({
    page: 1,
    limit: 10
})

const searchValue = ref('');
const onSearch = (val) => Toast(val);
const onClickButton = () => Toast(value.value);
// 滚动触底
const onLoad = (type) => {
    if (finished.value) {
        return
    }
    if (!type) {
        unref(paging).page++
    }
    getFoodMark()
    loading.value = false;
}


// 观看视频
const viewItem = async (val) => {
    load.loading('', true)
    const { data } = await http.post('masDeta', {
        farm_plot_id: curFarmPlot.value.farm_plot_id
    })
    mainStor.masData = data
    router.push('/video')
}




const getFoodMark = async (id, val) => {
    let option = {
        ...paging.value,
        search: val ?? '',
    }
    if (id) {
        option.farm_id = id;
    }
    console.log(option);
    const { data } = await http.post('foodMark', option)
    if (data.length === 0) {
        finished.value = true;
        return
    }
    list.value = [...list.value, ...data];
}

const init = () => {
    getFoodMark()
}


onMounted(() => {
    init()
})



</script>

<style scoped >
:deep(.van-pull-refresh) {
    height: 95%;
    width: 100%;
    overflow-y: auto;
}

:deep(.van-list) {
    padding: 0 1rem;
    flex-wrap: wrap;
    display: flex;
    height: 100%;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    overflow-y: auto;
}

:deep(.van-list__finished-text) {
    width: 100%;
}

:deep(.van-list__loading) {
    width: 100%;
}

:deep(.van-list__placeholder) {
    width: 100%;
}
</style>
