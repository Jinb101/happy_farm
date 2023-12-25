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
                                  :row="2"
                                  v-for="(item, index) in  framList "
                                  :key="index + 'fram'"
                                  :loading="loading">
                        <div @click="($event) => addToCart(item, $event, index)"
                             class="show_container relative  flex justify-center items-center w-full rounded-xl px-2 py-4 mt-4">
                            <div class="model_item">
                                <ProductItem :url="item.url ? item.url : ''"
                                             :text="item.product_name" />
                            </div>
                            <div class="flex justify-between items-center w-[90%]">
                                <div class="flex flex-col justify-between items-start ml-4 w-1/3 h-full">
                                    <span class=" font-semibold">{{ item.product_name }}</span>
                                </div>
                                <div class=" w-1/3 h-full">
                                    <span class=" text-xs text-gray-400 ">{{ item.FarmStall.sales_quantity + ' 斤' }}</span>
                                </div>
                                <div class=" w-1/3"></div>
                                <van-checkbox class=" h-full w-full absolute left-0  flex justify-end items-center pr-4"
                                              :name="item"
                                              :key="item"></van-checkbox>
                            </div>
                        </div>
                    </van-skeleton>
                </van-checkbox-group>
            </van-list>
            <van-back-top right="9vw"
                          :z-index="3000"
                          :style="{ backgroundColor: ' rgb(147 197 253)' }"
                          bottom="12vh" />


            <div class=" absolute bottom-0 left-0 h-[8%] w-full">
                <van-action-bar>
                    <van-action-bar-icon icon="cart-o"
                                         ref="cartButton"
                                         text="购物车"
                                         @click="onClickIcon" />
                    <van-action-bar-button type="primary"
                                           text="立即购买"
                                           @click="onClickButton" />
                </van-action-bar>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, onBeforeMount, inject, ref, unref, watch, computed } from 'vue';
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

// 选中的 item list
const selefList = ref([]);

// 购物车
const carList = ref([]);
// 购物车 实例 ref
const cartButton = ref(null);


const wheItem = (item, index) => {
    console.log(123);
    const existingIndex = selefList.value.findIndex(i => i.farm_plot_products_id === item.farm_plot_products_id);
    if (existingIndex !== -1) {
        // 如果已经存在，则删除
        // selefList.value.splice(existingIndex, 1);
        return true;
    } else {
        // 如果不存在，则新增
        // selefList.value.push(item);
        return false;
    }
}


// 选中或者删除
// 监听 selefList 数组的变化
watch(
    () => unref(selefList),
    (newList, oldList) => {
        let curItem
        if (oldList.length < newList.length) {
            curItem = newList.find(item => !oldList.some(oldItem => oldItem.farm_plot_products_id === item.farm_plot_products_id));
            http.post('editCart', {
                farm_stall_id: curItem.FarmStall.farm_stall_id,
                number: curItem.FarmStall.sales_quantity
            })
        } else if (oldList.length > newList.length) {
            curItem = oldList.find(item => !newList.some(newItem => newItem.farm_plot_products_id === item.farm_plot_products_id));
            http.post('deletCart', {
                farm_cart_id: curItem.farm_cart_id,
            }).catch(error => {
                load.error(error.message)
            })
        }
    }
);

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

const getData = async () => {
    try {
        const response = await http.post("markCooked", {
            farm_plot_id: mainStor.curFarmPlot.farm_plot_id,
            ...unref(pageIng),
            status: ''
        });
        if (response.data.length === 0) {
            finished.value = true;
        } else {
            framList.value.push(...response.data);
        }
        // 假设 framList.value 和 carList.value 是包含对象的数组
        framList.value.forEach(framItem => {
            carList.value.forEach(carItem => {
                if (framItem.farm_plot_products_id === carItem.farm_plot_products_id) {
                    framItem.farm_cart_id = carItem.farm_cart_id
                    selefList.value.push(framItem)
                    // 如果只需要设置一个匹配项，则可以添加 break，以提高性能
                }
            });
        });
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
            ...unref(pageIng)
        });
        carList.value = data
    } catch (error) {
        console.error(error);
        // 处理错误情况
    }
}

onMounted(async () => {
    load.show();
    await getCar()
    await getData()
    load.hide();
});



// 添加动画
const addToCart = async (item, $event, index) => {
    const wehItem = wheItem(item, index)
    if (!wehItem) return
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
