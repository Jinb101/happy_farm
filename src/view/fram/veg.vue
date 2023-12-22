<template>
    <div class="h-full w-full">
        <div v-if="framList.length === 0 && !loading">
            <van-empty description="暂无蔬菜" />
        </div>
        <div v-else
             class="h-full w-full px-4 overflow-y-auto ">
            <van-list v-model:loading="listLoading"
                      :finished="finished"
                      :immediate-check="false"
                      :offset="100"
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
                         class="  flex justify-center items-center w-full rounded-xl px-2 py-4 mt-4">
                        <ProductItem :url="item.url ? item.url : 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'"
                                     :text="item.product_name" />
                        <div class="flex justify-between items-center w-[90%]">
                            <div class="flex flex-col justify-between items-start ml-4 ">
                                <div class="  flex ">
                                    <span class=" font-semibold">{{ item.product_name }}</span>
                                    <div v-if="item.status == 3"
                                         class=" flex justify-start items-center ml-4">
                                        <span class=" text-gray-400 text-xs">已成熟</span>
                                        <van-icon size="18px"
                                                  class="ml-2"
                                                  color="#14cd3f79"
                                                  name="passed" />
                                    </div>
                                    <div v-else
                                         class=" flex justify-start items-center ml-4">
                                        <span>待成熟</span>
                                        <van-icon size="18px"
                                                  class="ml-2"
                                                  name="clock-o" />
                                    </div>
                                </div>
                                <!--主体  -->
                                <div v-if="item.status == 2"
                                     class=" text-left text-xs text-gray-400 ">
                                    <div class=" mb-1">
                                        <span>种植时间 : {{ parseInt(item.planting_month) }} 月</span>
                                    </div>
                                    <div v-if="item.status == 2"
                                         class=" flex justify-start items-center">
                                        <span>预计成熟时间 :&nbsp;</span>
                                        <van-count-down style=" font-size:12px"
                                                        :time="timeText(item.expected_maturity_time)"
                                                        format="DD 天 HH 时 mm 分 ss 秒" />
                                    </div>
                                </div>
                                <div v-else
                                     class=" text-left text-xs text-gray-400 ">
                                    <div class=" mt-1">
                                        <span>种植时间 : {{ parseInt(item.planting_month) }} 月</span>
                                    </div>
                                    <div class=" mt-1 ">
                                        <span>预估:{{ item.estimated_quantity }} 斤</span>
                                        <span class="ml-4">剩余:{{ item.remaining_quantity }} 斤</span>
                                    </div>
                                </div>
                            </div>
                            <div class=" flex  flex-col justify-between items-end w-[35%]">
                                <van-stepper v-model="item.num"
                                             step="0.5"
                                             min=""
                                             input-width="24px"
                                             button-size="26px"
                                             :max="Number(item.remaining_quantity)" />
                            </div>
                        </div>
                    </div>
                </van-skeleton>
            </van-list>

            <div
                 class=" fixed right-5 bottom-[10vh] flex flex-col bg-zinc-100 py-4 px-2 rounded-2xl transition-all duration-500">
                <van-button class="listed"
                            @click="Operation('l', item, index)"
                            type="warning">上市</van-button>
                <van-button class="deliv"
                            @click="Operation('d', item, index)"
                            type="primary">发货</van-button>
            </div>
            <van-back-top right="9vw"
                          :z-index="3000"
                          :style="{ backgroundColor: ' rgb(147 197 253)' }"
                          bottom="12vh" />
        </div>
    </div>
</template>

<script setup>
import { onMounted, onBeforeMount, inject, ref, unref, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMainStore } from '@/store/index.js'
import { storeToRefs } from 'pinia'
import ProductItem from "@/components/product/ProductItem.vue";

const mainStor = useMainStore()
const { curFarmPlot } = storeToRefs(mainStor)


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




// 操作
const Operation = (type, item, index) => {
    switch (type) {
        case 'l':
            // 上市
            break;
        case 'd':
            // 发货
            break;

        default:
            break;
    }
}


// 时间格式
const timeText = time => {
    const currentTime = new Date();
    const targetTime = new Date(time);
    const timeDifference = targetTime.getTime() - currentTime.getTime();
    return timeDifference;
}
// 下拉
const onLoad = () => {
    if (finished.value) {
        return;
    }
    unref(pageIng).page++;
    getData();
    listLoading.value = false;
};

//监听当前 土地 id
watch(
    () => unref(curFarmPlot).farm_plot_id,
    (va) => {
        if (va) {
            getData()
        }
    }
)


const getData = async () => {
    load.show();
    const { data } = await http
        .post("cooked", {
            farm_plot_id: unref(curFarmPlot).farm_plot_id,
            ...unref(pageIng)
        })
    if (data.length === 0) {
        finished.value = true;
    } else {
        data.forEach((i) => {
            i['num'] = 0
        })
        console.log(data);
        framList.value.push(...data);
    }
    load.hide();
    setTimeout(() => {
        loading.value = false;
    }, 600);

};


onMounted(() => {
    getData();;
});

</script>

<style scoped>
:deep(.listed) {
    font-size: 12px;
}

:deep(.deliv) {
    margin-top: 10px;
    font-size: 12px;
}
</style>
