<template>
    <div class="h-full w-full">
        <div v-if="framList.length === 0 && !loading">
            <van-empty description="暂无蔬菜" />
        </div>
        <div v-else
             class="h-full w-full px-4 overflow-y-auto ">
            <van-list v-model:loading="listLoading"
                      :finished="finished"
                      offset="10"
                      finished-text="没有更多了"
                      @load="onLoad">
                <van-skeleton title
                              avatar
                              :row="2"
                              v-for="(item, index) in framList"
                              :key="index + 'fram'"
                              :loading="loading">
                    <div style="
                box-shadow: 0 3.2px 12px #00000014, 0 5px 25px #0000000a;
              "
                         class=" flex justify-start items-center w-full rounded-xl px-2 py-2 mt-4">
                        <ProductItem :url="item.url ? item.url : 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'"
                                     :text="item.product_name" />
                        <div class="flex flex-col justify-between items-start ml-4 h-[4rem]">
                            <div>title</div>
                            <div>描述..........</div>
                        </div>
                    </div>
                </van-skeleton>
            </van-list>
            <van-back-top right="9vw"
                          :z-index="3000"
                          :style="{ backgroundColor: ' rgb(147 197 253)' }"
                          bottom="12vh" />
        </div>
    </div>
</template>

<script setup>
import { onMounted, onBeforeMount, inject, ref, unref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMainStore } from '@/store/index.js'
import { storeToRefs } from 'pinia'
import ProductItem from "@/components/product/ProductItem.vue";

const mainStor = useMainStore()
const { user, access_token, nursery_id, wherWx, farmPlotList } = storeToRefs(mainStor)


const http = inject("http");
const Tools = inject("Tools");
const load = inject("load");

const loading = ref(true);
const listLoading = ref(false);
const finished = ref(false);
const framList = ref([]);

// 分页
const pageIng = ref({
    page: 1,
    limit: 10
});

// 下拉
const onLoad = () => {
    if (finished.value) {
        return;
    }
    console.log(123);
    listLoading.value = true;
    unref(pageIng).page++;
    getData();
    listLoading.value = false;
};

const getData = () => {
    http
        .post("cooked", {
            farm_plot_id: mainStor.curFarmPlot.farm_plot_id,
            ...unref(pageIng)
        })
        .then((res) => {
            let obj = {
                "farm_cooked_food_id": "熟菜id",
                "farm_plot_id": "地块id",
                "farm_product_id": "菜品id",
                "estimated_quantity": "预估数量",
                "remaining_quantity": "剩余数量",
                "picking_start_time": "采摘开始时间",
                "picking_end_time": "采摘结束时间",
                "create_time": "创建时间",
                "FarmProduct": [{//菜品信息
                    "farm_product_id": "菜品id",
                    product_name: '菜品名称',
                    price: '价格'
                }]
            }
            for (let i = 0; i < 20; i++) {
                framList.value.push(obj)
            }
            console.log(res);
            if (res.data.length === 0) {
                finished.value = true;
            } else {
                framList.value.push(...res.data);
            }
            loading.value = false;
        })
        .catch((error) => {
            console.error(error);
            // 处理错误情况
        });
};

const init = () => {
    load.show();
    getData();
    load.hide();
};

onMounted(() => {
    init();
});

</script>

<style scoped></style>
