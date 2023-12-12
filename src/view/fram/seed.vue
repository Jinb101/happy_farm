<template>
    <div class="h-full w-full">
        <div class="h-[8%] relative">
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
                    <van-index-anchor :index="formattedIndex(index)">
                        <span>{{ formattedIndex(index) + '月' }}</span>
                        <div class=" w-[60%] mr-3 flex justify-center items-center gap-20 text-black font-medium ">
                            <div>已选</div>
                            <div>可选</div>
                        </div>
                    </van-index-anchor>
                    <div v-for="item in indexedSeedList[index]"
                         :key="item.farm_product_id">
                        <div class=" min-h-[4.5em] w-full flex justify-start items-center px-4 relative "
                             @click="addToCart(item, $event)">
                            <div class="model_item">
                                <ProductItem :url="item.url ? item.url : ''"
                                             :text="item.product_name" />
                            </div>
                            <div class=" ml-4 text-[14x]">
                                <!-- <span>
                                    价值: {{ item.price + '/斤' }}
                                </span> -->
                            </div>
                            <div v-if="wehPagest(item)"
                                 class="  h-4 w-4 flex justify-center items-center  absolute right-[10%] ">
                                <van-icon color="#2A9CFF"
                                          name="flag-o" />
                            </div>
                        </div>
                    </div>
                </template>
            </van-index-bar>
            <van-back-top right="9vw"
                          :z-index="3000"
                          :style="{ backgroundColor: ' rgb(147 197 253)' }"
                          bottom="12vh" />
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
                <div class=" w-[50%]">
                    <van-button type="primary"
                                ref="cartButton"
                                @click="addSeed"
                                :disabled="seedList.length === 0"
                                block>种植</van-button>
                </div>
                <div class=" absolute  right-5  z-[9999] "
                     @click.stop="openSeleList">
                    <van-badge :content="seedList.length"
                               :show-zero="seedList.length > 0"
                               color="#1989fa">
                        <img src="/images/beilou.png"
                             class="child"
                             alt=""
                             srcset="">
                    </van-badge>
                </div>
            </div>
        </transition>

        <!-- 圆角弹窗（底部） -->
        <van-popup v-model:show="showBottom"
                   round
                   closeable
                   position="bottom"
                   :style="{ height: '80%', padding: '3rem 0 10px 0' }">
            <van-index-bar :index-list="seedIndexList">
                <template v-for="index in seedIndexList"
                          :key="index">
                    <van-index-anchor :index="formattedIndex(index)">{{ formattedIndex(index) + '月' }}</van-index-anchor>
                    <div v-for="item in indexBootomList[index]"
                         :key="item.farm_product_id">
                        <div class=" min-h-[4.5em] w-full flex justify-start items-center px-4 relative">
                            <ProductItem :url="item.url ? item.url : ''"
                                         :text="item.product_name" />
                            <div v-if="wehPagest(item)"
                                 class="  h-4 w-4 flex justify-center items-center  absolute right-[10%] ">
                                <!-- <div>{{ index + '月 ' }}</div> -->
                                <van-icon color="#2A9CFF"
                                          name="flag-o" />
                            </div>
                        </div>
                    </div>
                </template>
            </van-index-bar>
        </van-popup>
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
// 底部展示
const showBottom = ref(false)
//月份
const curMonth = ref(0);
// icon
const restIcon = ref(false);
// btn
const initBtn = ref(false);
const initBtnState = ref(false);
// btn 实例 ref
const cartButton = ref(null)
// 已选 种子列表
const seedList = ref([]);
const seedIndexList = ref([]);
// 我的种子
const farmList = ref([]);
// 索引
const indexList = ref([]);
// 搜索
const searchVlaue = ref('');
// 根据索引分组的种子列表
const indexedSeedList = ref({});
// 底部展示
let indexBootomList = ref({});


// 底部已选
const openSeleList = () => {
    if (seedList.value.length > 0) {
        seedIndexList.value = []
        indexBootomList.value = {}
        // 根据索引分组数据
        seedList.value.forEach((item) => {
            let index = item.planting_month;
            index = formattedIndex(index);
            if (!indexBootomList.value[index]) {
                indexBootomList.value[index] = [];
                seedIndexList.value.push(index);
            }
            indexBootomList.value[index].push(item);
        });

        // 对 indexList 进行排序
        // seedIndexList.value = sortIndexList(indexList.value);
        console.log(seedList, indexBootomList.value);
        showBottom.value = true
    }
}


// 添加购物车
const addToCart = (item, $event, type, index) => {
    let isWher = seedListSet(item)
    if (isWher) return;
    let productItem = $event.currentTarget.querySelector('.model_item');
    const cartButtonRect = cartButton.value.$el.getBoundingClientRect(); // 获取购物车按钮的位置信息

    const newItem = productItem.cloneNode(true); // 复制点击的产品元素
    document.body.appendChild(newItem); // 将产品元素插入到文档中

    // 计算抛物线的起点和终点坐标
    const startX = productItem.getBoundingClientRect().left + window.scrollX + productItem.offsetWidth / 2;
    const startY = productItem.getBoundingClientRect().top + window.scrollY + productItem.offsetHeight / 2;
    const endX = cartButtonRect.left + cartButtonRect.width / 2 + 100;
    const endY = (cartButtonRect.top + cartButtonRect.height / 2) - cartButton.value.$el.offsetHeight - 40;

    // 添加CSS3动画效果
    newItem.className = 'product-item';
    newItem.style.zIndex = '3000'; // 设置定位方式为绝对定位
    newItem.style.position = 'absolute'; // 设置定位方式为绝对定位
    newItem.style.left = startX + 'px';
    newItem.style.top = startY + 'px';
    newItem.style.transition = 'transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    newItem.style.transform = `translate(${endX - startX}px, ${endY - startY}px)`;

    newItem.addEventListener('transitionend', () => {
        document.body.removeChild(newItem); // 移除产品元素

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
    const product = seedList.value.reduce((arr, item) => {
        const existingObj = arr.find(obj => obj.planting_month === item.planting_month);
        if (existingObj) {
            existingObj.farm_product_id.push(item.farm_product_id);
        } else {
            arr.push({
                planting_month: item.planting_month,
                farm_product_id: [item.farm_product_id]
            });
        }
        return arr;
    }, []);
    http.post('addPro', {
        farm_plot_id: mainStor.curFarmPlot.farm_plot_id,
        product: JSON.stringify(product)
    }).then((res) => {
        // 处理成功响应
        farmList.value.push(...seedList.value)
        initBtnState.value = farmList.value.length === 6
        seedList.value = []
        load.success(res.msg);
    }).catch((err) => {
        load.error('种植失败');
    })
};
// 格式类型转换
const formattedIndex = (index) => {
    return parseInt(index).toString();
}
// 计算徽标 已选计算函数
const seedListSet = (item) => {
    let existingItem = wehPagest(item)
    if (existingItem) {
        seedList.value = seedList.value.filter((i) => i !== item);
    } else {
        seedList.value.push(item);
    }
    return existingItem
}
// 是否存在
const wehPagest = (item) => {
    const existingItem = seedList.value.some((seed) => {
        return seed.planting_month === item.planting_month && seed.product_name === item.product_name;
    });
    return existingItem
}

// 搜索
watch(() => unref(searchVlaue), (val, old) => {
    if (val === '') {
        init('')
        restIcon.value = false
    } else {
        init(searchVlaue.value)
    }
});
// 获取月份
const getMonths = () => {
    const currentMonth = new Date().getMonth();
    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    curMonth.value = months[currentMonth]
    setTimeout(() => {
        initBtn.value = true;
    }, 400);
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
    nextTick()
    // 清空之前的索引列表和分组数据
    indexList.value = [];
    indexedSeedList.value = {};
    const { data } = await http.post('obtPro', {
        planting_month: '',
        search: val ? val : ''
    });
    // 根据索引分组数据
    data.forEach((item) => {
        let index = item.planting_month;
        index = formattedIndex(index);
        if (!indexedSeedList.value[index]) {
            indexedSeedList.value[index] = [];
            indexList.value.push(index);
        }
        indexedSeedList.value[index].push(item);
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
    // getMySeed()
});
</script>

<style scoped>
:deep(.van-index-anchor) {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
