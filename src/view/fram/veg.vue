<template>
    <div class="h-full w-full">
        <div v-if="framList.length === 0 && !loading">
            <van-empty description="暂无蔬菜" />
        </div>
        <div v-else
             class="h-full w-full px-4 overflow-y-auto relative ">
            <div v-if="gifLoaded"
                 class=" w-full h-full flex justify-center items-center  absolute left-0 top-0">
                <van-overlay :show="gifLoaded"
                             z-index="3000" />
                <img ref="gif_d"
                     class="gif_d z-[9999]"
                     src="@/assets/images/train.gif">
            </div>

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
                    <div class="show_container  flex justify-center items-center w-full rounded-xl px-2 py-4 mt-4">
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
                                        <span class=" text-gray-400 text-xs">待成熟</span>
                                        <van-icon size="18px"
                                                  class="ml-2"
                                                  color="rgb(156,163,175)"
                                                  name="clock-o" />
                                    </div>
                                </div>
                                <!--主体  -->
                                <div v-if="item.status == 2"
                                     class=" text-left text-xs text-gray-400 ">
                                    <div class=" mt-1 ">
                                        <span>种植时间 : {{ parseInt(item.planting_month) }} 月</span>
                                    </div>
                                    <div v-if="item.status == 2"
                                         class=" flex flex-col justify-start items-start mt-1">
                                        <span>预计成熟时间 :&nbsp;</span>
                                        <div class=" mt-1 ">
                                            <van-count-down style=" font-size:12px"
                                                            :time="timeText(item.expected_maturity_time)"
                                                            format="DD 天 HH 时 mm 分 ss 秒" />
                                        </div>
                                    </div>
                                </div>
                                <div v-else
                                     class=" text-left text-xs text-gray-400 ">
                                    <div class=" mt-1">
                                        <span>种植时间 : {{ parseInt(item.planting_month) }} 月</span>
                                    </div>
                                    <div class=" mt-1 ">
                                        <span>预估:{{ item.estimated_quantity }} 斤</span>
                                        <span class="ml-4">剩余:{{ item.FarmStall ? (item.remaining_quantity * 1) -
                                            (item.FarmStall.sales_quantity * 1) : item.remaining_quantity * 1
                                        }} 斤</span>
                                    </div>
                                </div>
                            </div>
                            <div class=" flex  flex-col justify-between items-end w-[35%]">
                                <van-stepper v-model="item.num"
                                             step="0.5"
                                             min=""
                                             input-width="24px"
                                             button-size="26px"
                                             @plus="editPer(item, index, 'plus')"
                                             @minus="editPer(item, index, 'minus')"
                                             :max="Number(item.remaining_quantity)" />
                            </div>
                        </div>
                    </div>
                </van-skeleton>
            </van-list>

            <div :class="seleItem.length > 0 ? 'right-5 bottom-[10vh] ' : 'right-[-10vh] bottom-[10vh]'"
                 class="show_container fixed flex flex-col bg-white py-4 px-2 rounded-2xl transition-all duration-500">
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

        <van-popup v-model:show="showBottom"
                   round
                   closeable
                   position="bottom"
                   :style="{ minHeight: '60%' }">
            <div class=" pt-[15%] pb-14">
                <div v-if="currentType == 'd'"
                     class="w-full text-left  px-4 bg-slate-50 h-8 flex justify-between items-center">
                    <span>地址 : </span>
                    <span>预计邮费 : {{ postage }} 元</span>
                </div>
                <div v-if="currentType == 'd'"
                     class="  h-[6rem] w-full  px-4  flex justify-start items-center "
                     @click="selePath = true">
                    <div class=" h-[90%]  flex flex-col justify-center items-start  w-[80%] ">
                        <div class=" w-1/2 h-1/2 flex justify-between items-center">
                            <span>{{ currentPath.consignee }}</span>
                            <span>{{ currentPath.mobile }}</span>
                        </div>
                        <div class=" address_text h-1/2 text-left mt-1 subpixel-antialiased   ">
                            <p>{{ currentPath.address }}</p>
                        </div>
                    </div>
                    <div class=" flex justify-end items-center  w-[20%] h-full py-4">
                        <van-icon name="arrow" />
                    </div>
                </div>
                <div class="w-full text-left  px-4 bg-slate-50 h-8 flex justify-start items-center">已选蔬菜：</div>
                <div class=" overflow-y-auto w-full">
                    <div v-for="(veg, index) in seleItem"
                         class="flex justify-between items-center px-4 border-b border-gray-100"
                         :key="index">
                        <div class=" w-1/2 h-14  flex justify-start items-center">
                            <ProductItem :url="''"
                                         :text="veg.product_name" />
                            <span v-if="veg.url"
                                  class=" ml-4">{{ veg.product_name }}</span>
                        </div>
                        <div>
                            {{ veg.num + ' 斤' }}
                        </div>
                    </div>
                </div>
                <div class=" w-full h-14 absolute left-0 bottom-0 px-10">
                    <van-button type="primary"
                                @click="confirm"
                                block>{{ currentType == 'l' ? '上市!' : '确认发货' }}</van-button>
                </div>
            </div>
        </van-popup>


        <!-- <PaySeed :open="showBottom"
                 :text="'已选蔬菜'"
                 :list="seleItem"
                 @close="showBottom = false"
                 @subit="confirm">
        </PaySeed> -->
        <PathPay :open="selePath"
                 :currentPath="currentPath"
                 :pathList="pathList"
                 @close="selePath = false"
                 @changes="(e) => currentPath = e">
        </PathPay>



    </div>
</template>

<script setup>
import { onMounted, onBeforeMount, inject, ref, unref, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMainStore } from '@/store/index.js'
import { storeToRefs } from 'pinia'
import ProductItem from "@/components/product/ProductItem.vue";
import PathPay from "@/components/pay/PathPay.vue";

const mainStor = useMainStore()
const { curFarmPlot } = storeToRefs(mainStor)

const router = useRouter()

const http = inject("http");
const Tools = inject("Tools");
const load = inject("load");


const loading = ref(true);
const listLoading = ref(false);
const finished = ref(false);
const framList = ref([]);


const gif_d = ref(null);
const gifLoaded = ref(false);

const selePath = ref(false);
// seleItem
const seleItem = ref([])
// 地址选中
const showBottom = ref(false);
// 分页
const pageIng = ref({
    page: 1,
    limit: 10
});
// 地址
const pathList = ref([]);
const currentPath = ref({});
const currentType = ref('');
// 邮费
const postage = ref();

// 确认
const confirm = async () => {
    load.show()
    if (currentType.value === 'd') {
        const selectedItems = seleItem.value.map(item => {
            return {
                farm_plot_products_id: item.farm_plot_products_id,
                number: item.num
            };
        })
        // 生成订单
        const food = await http.post('deFood', {
            farm_plot_products: JSON.stringify(selectedItems),
            farm_address_id: currentPath.value.farm_address_id
        });
        // 支付订单
        const payment = await http.post('delPay', {
            order_id: food.data.farm_dish_orders_id,
            order_no: food.data.order_no,
            // open_id: mainStor.user.open_id
        });
        if (payment.code === 200) {
            load.hide()
            // 执行微信支付
            await performWxPayment(payment.data);
        } else if (payment.code === 280) {
            load.hide()
            playGif(payment.msg)
            getData()
        }
        // 支付成功
    } else {
        console.log('上市');
        const selectedItems = seleItem.value.map(item => {
            return {
                farm_plot_products_id: item.farm_plot_products_id,
                sales_quantity: item.num
            };
        })
        // 上市
        http.post('sales', {
            farm_plot_products: JSON.stringify(selectedItems),
        }).then((res) => {
            load.success(res.data.msg)
            seleItem.value = []
            getData(true)
        })
    }
}

const performWxPayment = async (paymentData) => {
    try {
        // 调取微信支付
        const res = await wxTools.seedWxPay({
            appId: mainStor.user.open_id,
            timestamp: paymentData.txntime,
            nonceStr: paymentData.nonceStr,
            signature: paymentData.sign,
            signType: paymentData.signType,
            paySign: paymentData.sign,
        });
        if (res.code === 208) {
            // load.success('支付成功');
            playGif(res.msg)
        } else {
            load.info('请刷新重试');
        }

    } catch (error) {
        console.error('Error performing WeChat payment:', error);
    }
};

const playGif = (msg) => {
    // 处理支付失败
    gifLoaded.value = true
    nextTick(() => {
        gif_d.value.addEventListener('animationend', function () {
            gif_d.value.style.animation = 'none'; // 移除动画属性
            gifLoaded.value = false
            load.success(msg)
        });
    })
};



// 操作
const Operation = async (type, item, index) => {
    load.show()
    currentType.value = type
    switch (type) {
        case 'l':
            // 上市
            showBottom.value = true
            break;
        case 'd':

            // 发货
            if (pathList.value.length < 1) {
                load.model('是否前往地址铺新增地址', (r) => {
                    if (r) {
                        router.push('/path')
                    }
                })
                return
            }
            const farm_stall = seleItem.value.map(item => {
                return {
                    farm_plot_products_id: item.farm_plot_products_id,
                    number: item.num
                };
            });
            const { data } = await http.post('calcul', {
                farm_plot_products: JSON.stringify(farm_stall),
                farm_address_id: currentPath.value.farm_address_id
            })
            postage.value = data
            // postage.value = res.freight
            showBottom.value = true
            break;

        default:
            break;
    }
    load.hide()
}

//
const editPer = (item, index, type) => {
    const existingItem = seleItem.value.find((element) => element.farm_plot_products_id === item.farm_plot_products_id);
    if (existingItem) {
        if (type === 'minus') {
            nextTick(() => {
                if (existingItem.num === 0) {
                    const index = seleItem.value.indexOf(existingItem);
                    seleItem.value.splice(index, 1);
                }
            })
        }

    } else {
        seleItem.value.push(item)
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
        console.log(va);
        if (va) {
            getData()
        }
    }
)
// 地址数据
const getPaht = async () => {
    const { data } = await http.post('familyPath', {
        page: 1,
        limit: 999,
    })
    pathList.value = data
    currentPath.value = data.find((i) => {
        return i.is_default === '1';
    });
    console.log(currentPath);
    load.hide()
}

// 蔬菜数据
const getData = async (type) => {
    load.show();
    showBottom.value = false;
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
        if (type) {
            framList.value = data
        } else {
            framList.value.push(...data);
        }
    }
    setTimeout(() => {
        loading.value = false;
    }, 600);
    load.hide();
};

watch(
    () => showBottom.value,
    (v) => {
        if (!v) {
            selePath.value = v
        }
    }
)





onMounted(() => {
    getData();
    getPaht()
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

:deep(.van-count-down) {
    font-size: 0.75rem
        /* 12px */
    ;
    line-height: 1rem
        /* 16px */
    ;
    color: rgb(156 163 175 / var(--tw-text-opacity));

}

.show_container {
    box-shadow: 0 3.2px 12px #00000014, 0 5px 25px #0000000a;
}

.gif_d {
    animation: play 6s forwards;
    transition: visibility 0.5s;
    /* 添加停止的过渡效果 */
}

@keyframes play {
    to {
        visibility: hidden;
    }
}

.play-once {
    animation: play 4s forwards;
}
</style>
