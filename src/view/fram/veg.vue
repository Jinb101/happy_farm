<template>
    <div class=" h-full w-full">
        <div v-if="indexList.length === 0 && !loading"><van-empty description="暂无蔬菜" />
        </div>
        <van-index-bar :index-list="indexList">
            <template v-for="index in indexList"
                      :key="index">
                <van-index-anchor :index="formattedIndex(index)">{{ formattedIndex(index) + '月' }}</van-index-anchor>
                <div v-for="item in indexedSeedList[index]"
                     :key="item.farm_product_id"
                     class=" h-[4.5em] w-full flex justify-start items-center px-4">
                    <div class=" w-full border-b border-slate-100 h-full flex justify-start items-center">
                        <div class=" ">
                            <ProductItem :url="item.url ? item.url : ''"
                                         :text="item.product_name" />
                        </div>
                    </div>
                </div>
            </template>
        </van-index-bar>



    </div>
</template>

<script setup>
import { onMounted, onBeforeMount, inject, ref, unref, watch } from 'vue';
import { useMainStore } from '@/store/index.js'
import { storeToRefs } from 'pinia'

const mainStor = useMainStore()
const { curFarmPlot, curMonthList } = storeToRefs(mainStor)


const http = inject("http");
const load = inject("load");
// 索引
const indexList = ref([]);
// 根据索引分组的种子列表
let indexedSeedList = {};
const loading = ref(true);
const framList = ref([
    {}, {}, {}, {}, {}, {}, {}, {}, {},
])

// 监听土地变化
watch(curFarmPlot, (val) => {
    init()
})

const formattedIndex = (index) => {
    return parseInt(index).toString();
}

// 删除 蔬菜
const delSeed = (item, i) => {
    load.model('您的蔬菜还有xxx成熟,是否铲除', (r) => {
        if (r) {
            http.post('deltPro', {
                farm_plot_products_id: item.farm_plot_products_id
            }).then((res) => {
                framList.value.splice(i, 1);
                // 处理成功响应
                load.success(res.msg);
            })
        }
    })
}

const init = async () => {
    load.show('')
    const { data } = await http.post('myobtPro', {
        farm_plot_id: mainStor.curFarmPlot.farm_plot_id
    });
    if (data.length > 0) {
        framList.value = data
    } else {
        framList.value = []
    }
    // 根据索引分组数据
    data.forEach((item) => {
        let index = item.planting_month;
        index = formattedIndex(index);
        if (!indexedSeedList[index]) {
            indexedSeedList[index] = [];
            indexList.value.push(index);
        }
        indexedSeedList[index] = [...item.Product];
    });
    load.hide()
    loading.value = false
}


onMounted(() => {
    init()
});


</script>

<style scoped >
:deep(.van-index-anchor) {
    text-align: left;
    background: #F6F8FB;
}
</style>
