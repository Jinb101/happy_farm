<template>
    <div class="h-full w-full">
        <div v-if="framList.length === 0 && !loading">
            <van-empty description="暂无蔬菜" />
        </div>
        <div v-else
             class="h-full w-full px-4 overflow-y-auto  pb-[8%] relative">
            <van-list v-model:loading="listLoading"
                      :finished="finished"
                      :offset="10"
                      :immediate-check="false"
                      finished-text="没有更多了"
                      @load="onLoad">
                <van-checkbox-group v-model="selefList">
                    <van-skeleton title
                                  avatar
                                  :row="4"
                                  v-for="(item, index) in  framList "
                                  :key="index + 'fram'"
                                  :loading="loading">
                        <div class="show_container relative  w-full rounded-xl  mt-4 min-h-[9rem] ">
                            <div class=" flex justify-start items-center border-b border-gray-100 py-2  px-2">
                                <ProductItem :url="item.url ? item.url : ''"
                                             :text="item.user.nickname" />
                                <span
                                      class=" ml-4 text-sm font-semibold text-gray-500 ">{{ item.user.nickname + '的菜市' }}</span>
                            </div>
                            <div class=" overflow-y-auto w-full flex flex-col justify-start items-start py-2 px-2">
                                <div v-for="(pr, prIndex) in item.FarmPlotProducts"
                                     class=" w-full h-[3rem]  flex justify-start items-center mt-1">
                                    <div class=" w-1/3 flex justify-start items-center">
                                        <div class=" model_item ">
                                            <ProductItem :url="pr.url ? pr.url : ''"
                                                         :text="pr.product_name" />
                                        </div>
                                        <div class="flex flex-col justify-between items-start ml-4 w-1/3 h-full">
                                            <span v-if="item.url"
                                                  class=" font-semibold">{{ pr.product_name }}</span>
                                            <span v-else
                                                  class=" text-xs text-gray-400">
                                                <p>{{ pr.FarmStall.selling_price }}</p>
                                                <p>/ 斤</p>
                                            </span>
                                        </div>
                                    </div>
                                    <div class=" w-1/3 h-full flex justify-center items-center">
                                        <van-stepper v-model="pr.num"
                                                     step="0.5"
                                                     min=""
                                                     input-width="24px"
                                                     button-size="22px"
                                                     @plus="editPer(item, pr, prIndex, 'plus')"
                                                     @minus="editPer(item, pr, prIndex, 'minus')"
                                                     :max="Number(pr.FarmStall.sales_quantity)" />
                                        <!-- <span class=" text-xs text-gray-400 ">{{ 斤 }}</span> -->
                                    </div>
                                    <div class=" w-1/3 flex justify-center items-center">
                                        <div>
                                            <van-icon v-if="wheItem(pr, prIndex)"
                                                      @click=" editSeed(pr, prIndex, 'add')"
                                                      name="cart-o"
                                                      size="30px"
                                                      color="#1989fa" />
                                            <van-icon v-else
                                                      @click.stop="editSeed(pr, prIndex, 'del')"
                                                      name="cart"
                                                      size="30px"
                                                      color="#1989fa" />
                                        </div>
                                        <van-checkbox class=" ml-4 "
                                                      :name="pr"
                                                      @click.stop="() => { }"
                                                      :key="pr"></van-checkbox>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </van-skeleton>
                </van-checkbox-group>
            </van-list>

            <div :class="selefList.length > 0 ? ' h-14 w-20  right-0' : ' h-0 w-0  right-[-10rem]'"
                 class="
             absolute
             bottom-[12vh]
             transition-all
             bg-white
             rounded-l-full
             show_container
             duration-300
             flex
             justify-center
             items-center
             ">
                {{ money + ' 元' }}
            </div>


            <van-back-top right="9vw"
                          :z-index="3000"
                          :style="{ backgroundColor: ' rgb(147 197 253)' }"
                          bottom="12vh" />

            <div v-if="!loading"
                 class=" absolute bottom-0 left-0 h-[8%] w-full">
                <van-action-bar>
                    <van-action-bar-icon icon="cart-o"
                                         ref="cartButton"
                                         @click="() => {
                                             carShow = true
                                         }"
                                         text="购物车" />
                    <van-action-bar-button type="primary"
                                           text="立即购买"
                                           @click="() => {
                                               if (selefList.length == 0) {
                                                   load.info('请选择蔬菜')
                                                   return
                                               }
                                               showBottom = true
                                           }
                                               " />
                </van-action-bar>
            </div>

            <PaySeed :open="showBottom"
                     :text="'已选蔬菜'"
                     :list="selefList"
                     @close="showBottom = false"
                     :money="money"
                     @subit="confirm">
            </PaySeed>

            <van-popup v-model:show="carShow"
                       round
                       closeable
                       position="bottom"
                       :style="{ height: '80%' }">
                <div v-if="carList.length < 1"
                     class=" h-full w-full">
                    <van-empty description="快去添加蔬菜吧" />
                </div>
                <div v-else
                     class=" px-4 pt-[10%] h-full w-full">
                    <div v-for="(  car, index  ) in    carList   ">
                        <div
                             class="show_container relative  flex justify-center items-center w-full rounded-xl px-2 py-4 mt-4">
                            <div class=" w-1/2 flex justify-start items-center">
                                <ProductItem :url="car.url ? car.url : ''"
                                             :text="car.FarmPlotProducts.product_name" />
                                <div v-if="!car.url"
                                     class="flex flex-col justify-between items-start ml-4 w-1/3 h-full">
                                    <span class=" font-semibold">{{ car.FarmPlotProducts.product_name }}</span>
                                </div>
                            </div>
                            <div class=" w-1/2 h-full flex justify-between items-center pr-2">
                                <span class=" text-xs text-gray-400 ">{{ car.number + ' 斤' }}</span>
                                <van-icon name="failure"
                                          color="gray"
                                          @click="deletCare(car, index)"
                                          size="25px" />
                            </div>
                        </div>
                    </div>
                </div>
            </van-popup>
        </div>
    </div>
</template>

<script setup>
import { onMounted, onBeforeMount, inject, ref, unref, watch, computed, nextTick } from 'vue';
import { useMainStore } from '@/store/index.js'
import { storeToRefs } from 'pinia'
import ProductItem from "@/components/product/ProductItem.vue";
import PaySeed from "@/components/pay/PaySeed.vue";

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

// 选中的 item list
const selefList = ref([]);

// 购物车
const carList = ref([]);
// 购物车 实例 ref
const cartButton = ref(null);
const carShow = ref(false);

// 支付
const showBottom = ref(false);

// 金钱计算
const money = computed(() => {
    let totalMoney = 0;
    selefList.value.forEach((item) => {
        totalMoney += Number(item.num) * Number(item.FarmStall.selling_price);
    });
    console.log(totalMoney);
    return totalMoney;
});


// 购物车删除
const deletCare = (car, index) => {
    load.show()
    http.post('deletCart', { farm_cart_id: car.farm_cart_id })
        .then((res) => {
            carList.value.splice(index, 1);
            load.hide();
            if (carList.value.length < 1) {
                carShow.value = false
            }
        })
        .catch(error => {
            load.error(error.message);
            load.hide();

        });
}
// 购买
const confirm = async (e) => {
    const farm_stall = selefList.value.map(item => {
        return {
            farm_stall_id: item.FarmStall.farm_stall_id,
            number: item.num || item.FarmStall.sales_quantity
        };
    });
    // 调用支付  1 生成订单
    const { data } = await http.post('vegOrder', {
        farm_stall: JSON.stringify(farm_stall),
        farm_address_id: e.value.farm_address_id
    })
    const dePay = await http.post('delPay', {
        order_id: data.farm_dish_orders_id,
        order_no: data.order_no,
    })
    // 调用微信支付
    console.log(data, dePay);
    // TOOD : 微信支付

    // load.success('支付成功')
    // // 初始化
    // init(true)
}

const wheItem = (item, index) => {
    const existingIndex = carList.value.findIndex(i => i.farm_plot_products_id
        === item.farm_plot_products_id
    );
    if (existingIndex !== -1) {
        // 如果已经存在，则删除
        // selefList.value.splice(existingIndex, 1);
        return false
    } else {
        // 如果不存在，则新增
        // selefList.value.push(item);
        return true
    }
}

// 数量选择
const editPer = (item, pr, index, type) => {
    const existingItem = framList.value.find((element) => element.user_id === item.user_id);
    console.log(existingItem);
    // existingItem.FarmPlotProducts[index].FarmStall
}

// 添加购物车
const editSeed = (item, index, e) => {
    let requestData = {}
    if (e === 'add') {
        requestData = { farm_stall_id: item.FarmStall.farm_stall_id, number: item.num }
    } else {
        const carItem = carList.value.find((i) => i.farm_plot_products_id === item.farm_plot_products_id)
        requestData = { farm_cart_id: carItem.farm_cart_id }
    }
    const requestType = e === 'add' ? 'editCart' : 'deletCart';
    http.post(requestType, requestData)
        .then((res) => {
            getCar()
        })
        .catch(error => {
            load.error(error.message);
        });
}
// 下拉
const onLoad = () => {
    if (finished.value) {
        return;
    } else {
        unref(pageIng).page++;
    }
    listLoading.value = true;
    getData();
};

const getData = async (e) => {
    try {
        const response = await http.post("foodMark", {
            // farm_id: mainStor.curFarmPlot.farm_plot_id,
            ...unref(pageIng),
            search: ''
        });
        if (response.data.length === 0) {
            finished.value = true;
        } else {
            response.data.forEach((item) => {
                item.FarmPlotProducts.forEach((i) => {
                    i.num = i.FarmStall.sales_quantity * 1;
                })
            })
            console.log(framList.value);
            if (e) {
                framList.value = response.data
            } else {
                framList.value.push(...response.data);
            }
        }
        setTimeout(() => {
            loading.value = false;
        }, 600);
    } catch (error) {
        console.error(error);
        // 处理错误情况
    }
};

// 购物车
const getCar = async () => {
    try {
        const { data } = await http.post("cart", {
            page: 0,
            limit: 10,
        });
        carList.value = data
    } catch (error) {
        console.error(error);
        // 处理错误情况
    }
}

const init = async (e) => {
    load.show();
    await getCar()
    await getData(e)
    load.hide();
}

onMounted(() => {
    init()
});



// 添加动画;
const addToCart = async (item, $event, index) => {
    console.log($event.currentTarget);

    const productItem = $event.currentTarget.querySelector(".model_item");
    const cartButtonRect = cartButton.value.$el.getBoundingClientRect();

    const newItem = productItem.cloneNode(true); // 复制点击的产品元素
    newItem.style.position = "fixed";
    newItem.style.left = `${productItem.offsetLeft}px`;
    newItem.style.top = `${productItem.offsetTop}px`;
    newItem.style.zIndex = "9999";

    document.body.appendChild(newItem);

    await new Promise((resolve) => setTimeout(resolve, 0)); // 等待浏览器渲染完成

    // 计算抛物线的起点和终点坐标
    const startX =
        productItem.getBoundingClientRect().left +
        window.scrollX +
        productItem.offsetWidth / 2;
    const startY =
        productItem.getBoundingClientRect().top +
        window.scrollY +
        productItem.offsetHeight / 2;
    const endX = cartButtonRect.left + cartButtonRect.width / 2 - 10;
    const endY =
        cartButtonRect.top +
        cartButtonRect.height / 2 -
        cartButton.value.$el.offsetHeight -
        40;

    // 添加 CSS3 动画效果
    newItem.className = "product-item";
    newItem.style.zIndex = "3000"; // 设置定位方式为绝对定位
    newItem.style.position = "absolute"; // 设置定位方式为绝对定位
    newItem.style.left = startX + "px";
    newItem.style.top = startY + "px";
    newItem.style.transition =
        "transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
    newItem.style.transform = `translate(${endX - startX}px, ${endY - startY
        }px)`;


    newItem.addEventListener("transitionend", () => {
        document.body.removeChild(newItem);
    }, { once: true });
};
</script>

<style scoped>
.show_container {
    box-shadow: 0 3.2px 12px #00000014, 0 5px 25px #0000000a;
}
</style>
