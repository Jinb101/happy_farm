<template>
    <div class="h-full w-full">
        <div class="h-[8%]">
            <van-sticky>
                <form action="/">
                    <van-search v-model="searchVlaue"
                                show-action
                                shape="round"
                                placeholder="请输入蔬菜名称"
                                @search="onSearch">
                        <template #action>
                            <div class="text-gray-400"
                                 @click="onSearch(searchVlaue)">搜索</div>
                        </template>
                    </van-search>
                </form>
            </van-sticky>
        </div>
        <div class="h-[92%] overflow-y-auto pb-[4rem]">
            <van-index-bar :index-list="indexList">
                <template v-for="index in indexList"
                          :key="index">
                    <van-index-anchor :index="formattedIndex(index)">{{ formattedIndex(index) + '月' }}</van-index-anchor>
                    <div v-for="item in indexedSeedList[index]"
                         :key="item.farm_product_id">
                        <div class=" min-h-[4.5em] w-full flex justify-start items-center px-4"
                             @click="addToCart(item, $event)">
                            <ProductItem :url="item.url ? item.url : ''"
                                         :text="item.product_name" />
                        </div>
                    </div>
                </template>
            </van-index-bar>
        </div>

        <transition name="move-right">
            <div v-show="restIcon"
                 @click="searchVlaue = ''"
                 class="  w-[4rem] h-[4rem] flex justify-center items-center px-2 py-2 rounded-full  border shadow-inner fixed right-8 bottom-[15%]">
                <van-icon name="replay"
                          color="rgba(128, 128, 128, 0.4)"
                          size="2rem" />
            </div>
        </transition>


        <transition name="move-down">
            <div v-show="initBtn"
                 class=" h-[8%] w-full flex justify-center items-center px-6 fixed bottom-2">
                <div class=" w-[60%] ">
                    <van-button type="primary"
                                ref="cartButton"
                                @click="addSeed"
                                :disabled="initBtnState && farmList.length === 6"
                                block>{{ seedLength }}</van-button>
                </div>
                <img src="/images/beilou.png"
                     class=" absolute top-[-100%] z-[9999]"
                     alt=""
                     v-show="mainBtn"
                     srcset="">
            </div>
        </transition>



    </div>
</template>

<script setup>
import { ref, onMounted, inject, watch, unref, computed, nextTick } from 'vue';
import ProductItem from "@/components/product/ProductItem.vue";
import { useMainStore } from '@/store/index.js'
import { storeToRefs } from 'pinia'

const Tools = inject("Tools");
const wxTools = inject("wxTools");
const mainStor = useMainStore()
const { farmPlotList, curFarmPlot, curMonthList } = storeToRefs(mainStor)

const http = inject("http");
const load = inject("load");

//月份
const curMonth = ref(0);
// icon
const restIcon = ref(false);
// btn
const initBtn = ref(false);
const initBtnState = ref(false);
const mainBtn = ref(false);
// btn 实例 ref
const cartButton = ref(null)
// 已选 种子列表
const seedList = ref([]);
// 我的种子
const farmList = ref([]);
// 索引
const indexList = ref([]);
// 搜索
const searchVlaue = ref('');
// 根据索引分组的种子列表
let indexedSeedList = {};

// 添加购物车
const addToCart = (item, $event) => {
    if (initBtnState.value || seedList.value.length === 6 || seedList.value.length + farmList.value.length === 6) return;
    seedList.value.push(item);
    mainBtn.value = true;
    const productItem = $event.currentTarget; // 获取点击的产品元素
    const cartButtonRect = cartButton.value.$el.getBoundingClientRect(); // 获取购物车按钮的位置信息

    const newItem = productItem.cloneNode(true); // 复制点击的产品元素
    document.body.appendChild(newItem); // 将产品元素插入到文档中

    // 计算抛物线的起点和终点坐标
    const startX = productItem.getBoundingClientRect().left + window.scrollX + productItem.offsetWidth / 2;
    const startY = productItem.getBoundingClientRect().top + window.scrollY + productItem.offsetHeight / 2;
    const endX = cartButtonRect.left + cartButtonRect.width / 2 - 30;
    const endY = (cartButtonRect.top + cartButtonRect.height / 2) - cartButton.value.$el.offsetHeight - 120;

    // 添加CSS3动画效果
    newItem.className = 'product-item';
    newItem.style.position = 'absolute'; // 设置定位方式为绝对定位
    newItem.style.left = startX + 'px';
    newItem.style.top = startY + 'px';
    newItem.style.transition = 'transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    newItem.style.transform = `translate(${endX - startX}px, ${endY - startY}px)`;

    newItem.addEventListener('transitionend', () => {
        document.body.removeChild(newItem); // 移除产品元素
        mainBtn.value = false;
    });

    // 强制重绘，触发动画
    newItem.getBoundingClientRect();
};

// 添加种植
const addSeed = () => {
    if (seedList.value.length < 1) {
        return
    }
    load.loading();
    const product = [{
        planting_month: curMonth.value,
        farm_product_id: seedList.value.map(item => item.farm_product_id)
    }];
    http.post('addPro', {
        farm_plot_id: mainStor.curFarmPlot.farm_plot_id,
        product: JSON.stringify(product)
    }).then((res) => {
        // 处理成功响应
        load.success(res.msg);
        farmList.value.push(...seedList.value)
        initBtnState.value = farmList.value.length === 6
        seedList.value = []
    }).catch((err) => {
        load.error('种植失败');
    }).finally(() => {
        load.clear();
    });
};

const formattedIndex = (index) => {
    return parseInt(index).toString();
}

// 按钮计算属性
const seedLength = computed(() => {
    if (farmList.value.length === 6) {
        initBtnState.value = true;
        return '土地已满';
    }
    if (seedList.value.length === 6 || seedList.value.length + farmList.value.length === 6) {
        initBtnState.value = true;
        return '背篼已满 点击种植';
    } else {
        return `添加蔬菜  ${seedList.value.length === 0 ? '' : "(" + seedList.value.length + ")"}`;
    }
});

watch(() => unref(searchVlaue), (val, old) => {
    if (val === '') {
        init('')
        restIcon.value = false
    }
});
// 获取月份
const getMonths = () => {
    const currentMonth = new Date().getMonth();
    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    curMonth.value = months[currentMonth]
    initBtn.value = true;
};

// 搜索操作
const onSearch = (val) => {
    init(val);
    restIcon.value = true
};

// 获取我已经有的种子
const getMySeed = () => {
    // const { data } = await http.post('myfarm')
    http.post('myobtPro', {
        farm_plot_id: mainStor.curFarmPlot.farm_plot_id
    }).then((res) => {
        if (res.data.length > 0) {
            farmList.value = res.data[0].Product
        } else {
            farmList.value = []
        }
        // initBtn.value = true;
    })
}

// 初始化
const init = async (val) => {
    load.show();
    // 清空之前的索引列表和分组数据
    indexList.value = [];
    indexedSeedList = {};
    const { data } = await http.post('obtPro', {
        planting_month: '',
        search: val ? val : ''
    });


    // 根据索引分组数据
    data.forEach((item) => {
        let index = item.planting_month;
        index = formattedIndex(index);
        if (!indexedSeedList[index]) {
            indexedSeedList[index] = [];
            indexList.value.push(index);
        }
        indexedSeedList[index].push(item);
    });

    // 对 indexList 进行排序
    indexList.value = sortIndexList(indexList.value);
    load.hide();
};

const sortIndexList = (list) => {

    list.sort((a, b) => {
        if (a === curMonthList.value[0]) {
            return -1;
        } else if (b === curMonthList.value[0]) {
            return 1;
        } else {
            let aIndex = curMonthList.value.indexOf(a);
            let bIndex = curMonthList.value.indexOf(b);
            if (aIndex === -1) {
                aIndex = parseInt(a);
            }
            if (bIndex === -1) {
                bIndex = parseInt(b);
            }
            return aIndex - bIndex;
        }
    });

    return list;
};

onMounted(() => {
    getMonths()
    init();
    getMySeed()
});
</script>

<style scoped>
:deep(.van-index-anchor) {
    text-align: left;
    background: #F6F8FB;
}

:deep(.van-index-bar__sidebar) {
    margin-right: 5px;
}

:deep(.van-index-bar__index) {
    font-size: 12px;
    line-height: 30px;
}
</style>
