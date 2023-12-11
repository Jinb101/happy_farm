<template>
    <div class=" h-full w-full ">
        <div class=" h-[5%]">
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
        <div class=" w-full h-[95%] mt-4">
            <van-pull-refresh v-model="refreshing"
                              @refresh="onRefresh">
                <van-list v-model:loading="loading"
                          :finished="finished"
                          finished-text="没有更多了"
                          @load="onLoad">
                    <div class=" w-[40%] h-[6rem] bg-black mb-6"
                         v-for=" item in list">
                        <div class=" h-1/5 w-full bg-gray-200 flex justify-end items-center px-2">
                            <van-icon color="yellow"
                                      name="shop-collect-o" />
                        </div>
                        <div></div>
                    </div>
                </van-list>
            </van-pull-refresh>



            <!-- 回到顶部 -->
            <van-back-top right="8vw"
                          style=" z-index:9999"
                          bottom="12vh" />
        </div>

    </div>
</template>

<script setup>
import { onMounted, inject, ref, unref, watch } from 'vue';


const http = inject("http");
const load = inject("load");
const Tools = inject("Tools");

const list = ref([
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
]);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);

const paging = ref({
    page: 1,
    limit: 10
})

const searchValue = ref('');
const onSearch = (val) => Toast(val);
const onClickButton = () => Toast(value.value);
// 滚动触底
const onLoad = Tools.debounce((type) => {
    if (finished.value) {
        return
    }
    if (!type) {
        unref(paging).page++
    }
    if (refreshing.value) {
        list.value = [];
        refreshing.value = false;
    }
    // getFoodMark()

    loading.value = false;

    if (list.value.length >= 40) {
        finished.value = true;
    }
}, 600)




const onRefresh = () => {
    // 清空列表数据
    finished.value = false;
    // 重新加载数据
    // 将 loading 设置为 true，表示处于加载状态
    loading.value = true;
    onLoad(true);
};



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
    // finished.value = true;
    console.log(data);
}

const init = () => {
    // getFoodMark()
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
    justify-content: space-between;
    align-items: center;
}

:deep(.van-list__finished-text) {
    width: 100%;
}

:deep(.van-list__loading) {
    width: 100%;
    
}
</style>
