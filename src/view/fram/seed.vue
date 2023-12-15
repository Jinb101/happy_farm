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
                                 @click="onSearch(searchVlaue)">
                                搜索
                            </div>
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
                        <span>{{ formattedIndex(index) + "月" }}</span>
                        <div class="w-[50%] mr-8 flex justify-center items-center gap-20 text-black font-medium">
                            <div class=" w-1/2"
                                 v-text='monthItemSele(index)'></div>
                            <div class=" w-1/2"
                                 v-text='monthItemOptional(index)'></div>
                        </div>
                    </van-index-anchor>
                    <div v-for="item in indexedSeedList[index]"
                         :key="item.farm_product_id">
                        <div class="min-h-[4.5em] w-full flex justify-start items-center px-4 relative"
                             @click="seedListSet(item, $event, index)">
                            <div class="model_item">
                                <ProductItem :url="item.url ? item.url : ''"
                                             :text="item.product_name" />
                            </div>
                            <div class="ml-4 text-[14x] flex flex-col justify-center items-start">
                                <span>
                                    {{ item.product_name }}
                                </span>
                                <span class=" text-xs">
                                    {{ '生长周期 :' + item.planting_cycle + ' 天' }}
                                </span>
                            </div>
                            <div v-show="wehPagest(item, index)"
                                 class="h-4 w-4 flex justify-center items-center absolute right-[10%]">
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
                 class="w-[4rem] h-[4rem] flex justify-center items-center px-2 py-2 rounded-full border shadow-inner fixed right-8 bottom-[15%]">
                <van-icon name="replay"
                          color="rgba(128, 128, 128, 0.4)"
                          size="2rem" />
            </div>
        </transition>

        <transition name="move-down">
            <div v-show="initBtn"
                 class="h-[8%] w-full flex justify-center items-center px-6 fixed bottom-2">
                <div class="w-[50%]">
                    <van-button type="primary"
                                ref="cartButton"
                                @click="addSeed"
                                :disabled="seedLength === 0"
                                block>种植</van-button>
                </div>
                <div class="absolute right-5 z-[9999]"
                     @click.stop="openSeleList">
                    <van-badge :content="seedLength"
                               :show-zero="seedLength > 0"
                               color="#1989fa">
                        <img src="/images/beilou.png"
                             class="child"
                             alt=""
                             srcset="" />
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
                    <van-index-anchor :index="formattedIndex(index)">{{
                        formattedIndex(index) + "月"
                    }}</van-index-anchor>
                    <div v-for="item in seedList[index]"
                         :key="item.farm_product_id">
                        <div @click="seedListSet(item, $event, index)"
                             class="min-h-[4.5em] w-full flex justify-start items-center px-4 relative">
                            <ProductItem :url="item.url ? item.url : ''"
                                         :text="item.product_name" />
                            <div v-show="wehPagest(item, index)"
                                 class="h-4 w-4 flex justify-center items-center absolute right-[10%]">
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
import { ref, onMounted, inject, watch, unref, computed, nextTick } from "vue";
import ProductItem from "@/components/product/ProductItem.vue";
import { useMainStore } from "@/store/index.js";
import { storeToRefs } from "pinia";

const Tools = inject("Tools");
const wxTools = inject("wxTools");
const mainStor = useMainStore();
const { farmPlotList, curFarmPlot, curMonthList } = storeToRefs(mainStor);

const http = inject("http");
const load = inject("load");
// 底部展示
const showBottom = ref(false);
//月份
const curMonth = ref(0);
// icon
const restIcon = ref(false);
// btn
const initBtn = ref(false);
const initBtnState = ref(false);
// btn 实例 ref
const cartButton = ref(null);
// 已选 种子列表
const seedList = ref({});
const seedLength = ref(0);
const seedIndexList = ref([]);
// 已选 可选 列表
const monthSeleList = ref({});
let monthMap = {};
// 我的种子
const farmList = ref([]);
// 索引
const indexList = ref([]);
// 搜索
const searchVlaue = ref("");
// 根据索引分组的种子列表
const indexedSeedList = ref({});
// 底部展示
let indexBootomList = ref({});


// 计算 每月已选 selected
const monthItemSele = (index) => {
    let text = ''
    if (unref(seedList)[index]) {
        text = `已选 : ${unref(seedList)[index].length}`
    }
    if (unref(seedList)[index] && unref(seedList)[index].length < 1) {
        text = ''
    }
    return text
}
// 计算 每月可选 optional
const monthItemOptional = (index) => {
    let text = ''
    if (unref(monthSeleList)[index]) {
        if (unref(seedList)[index] && unref(seedList)[index].length > 0) {
            return text = `可选 : ${unref(monthSeleList)[index].cultivable - unref(seedList)[index].length}`

        }
        text = `可选 : ${unref(monthSeleList)[index].cultivable - unref(monthSeleList)[index].selected}`
    }
    return text
}
// 修改  可选
const editOptional = (index, type) => {
    const day = daysUntilMonthEnd(); // 获取本月剩余天数
    let result
    const currentMonth = new Date().getMonth() + 1;

    // // 遍历已选择的蔬菜对象列表
    for (let seed in unref(seedList)) {
        unref(seedList)[seed].forEach((item) => {
            if (seed === index) {
                let totalDays = day + item.planting_cycle;
                result = getEndDateMonth(index, totalDays)
            }
        })
    }
    for (let monthIndex in unref(monthSeleList)) {
        // 如果该月份不等于当前选中蔬菜对象的索引
        console.log(result, monthIndex, index);
        if (Number(index) > result) {
            if (Number(monthIndex) <= result) {
                console.log(monthIndex);
                if (type === 'del') {
                    monthSeleList.value[monthIndex].selected--
                } else if (type === 'add') {
                    monthSeleList.value[monthIndex].selected++;
                }
            }
        } else {
            if (Number(monthIndex) >= result) {
                if (type === 'del') {
                    monthSeleList.value[monthIndex].selected--
                } else if (type === 'add') {
                    monthSeleList.value[monthIndex].selected++;
                }
            }
        }
    }
}

// 周期 辅助函数
const getEndDateMonth = (currentMonth, totalDays) => {
    const today = new Date(); // 获取当前日期
    const currentYear = today.getFullYear(); // 获取当前年份
    const currentMonthIndex = today.getMonth() + 1; // 获取当前月份（注意月份从 0 开始，所以要加 1）

    let targetMonth = currentMonth; // 目标月份初始化为传入的参数值
    console.log(currentMonth);
    // 判断传入的月份是否小于当前月份，如果是，则目标月份位于下一年份
    // if (currentMonth < currentMonthIndex) {
    //     targetMonth += 12; // 加上 12 个月，即为下一年份的月份
    // }

    // 获取目标日期的年份和月份
    const targetYear = currentYear + Math.floor((targetMonth - 1) / 12); // 注意这里要减去1，否则会多算一年
    const remainingMonths = (targetMonth - 1) % 12 + 1; // 这里要加 1，才能得到正确的月份

    // 构建目标日期对象
    const targetDate = new Date(targetYear, remainingMonths - 1, 1); // 注意这里要减去 1，因为月份从 0 开始

    // 计算目标日期后推总天数后的日期
    targetDate.setDate(targetDate.getDate() + totalDays);

    // 获取推算后的日期的月份
    const endDateMonth = targetDate.getMonth() + 1; // 注意这里要加 1，才能得到正确的月份

    return endDateMonth;
};

// 底部已选
const openSeleList = () => {
    if (seedLength.value > 0) {
        seedIndexList.value = [];
        for (let key in seedList.value) {
            console.log(seedList.value[key]);
            if (seedList.value[key] && seedList.value[key].length > 0) {
                seedIndexList.value.push(key)
            }
        }
        seedIndexList.value = sortIndexList(seedIndexList.value);
        showBottom.value = true;
    }
};



// 添加购物车
const addToCart = (item, $event, index) => {
    let productItem = $event.currentTarget.querySelector(".model_item");
    const cartButtonRect = cartButton.value.$el.getBoundingClientRect(); // 获取购物车按钮的位置信息

    const newItem = productItem.cloneNode(true); // 复制点击的产品元素
    document.body.appendChild(newItem); // 将产品元素插入到文档中

    // 计算抛物线的起点和终点坐标
    const startX =
        productItem.getBoundingClientRect().left +
        window.scrollX +
        productItem.offsetWidth / 2;
    const startY =
        productItem.getBoundingClientRect().top +
        window.scrollY +
        productItem.offsetHeight / 2;
    const endX = cartButtonRect.left + cartButtonRect.width / 2 + 100;
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
        document.body.removeChild(newItem); // 移除产品元素
    });
    // 强制重绘，触发动画
    newItem.getBoundingClientRect();
};
// 添加种植
const addSeed = () => {
    if (Object.keys(seedList.value).length < 1) {
        return;
    }
    load.loading();
    const product = Object.entries(seedList.value).reduce((arr, [key, values]) => {
        console.log(values, key);
        arr.push({
            planting_month: key,
            farm_product_id: values.map((item) => {
                return item.farm_product_id
            }),
        })
        return arr;
    }, []);
    http.post("addPro", {
        farm_plot_id: curFarmPlot.value.farm_plot_id,
        product: JSON.stringify(product),
    })
        .then((res) => {
            if (res.code == 200) {
                // 处理成功响应
                farmList.value.push(...seedList.value);
                initBtnState.value = farmList.value.length === 6;
                seedList.value = {};
                seedLength.value = 0
                load.success(res.data.msg);
            } else {
                console.log(res);
                load.error(res.data.msg);
            }
        })
        .catch((err) => {
            load.error("种植失败");
        });
};
// 格式类型转换
const formattedIndex = (index) => {
    return parseInt(index).toString();
};
// 计算徽标 已选计算函数
const seedListSet = (item, envnt, index) => {
    console.log(unref(monthSeleList)[index]);
    if (unref(monthSeleList)[index].selected === unref(monthSeleList)[index].cultivable) {
        return
    }
    // 检查 seedList 是否具有指定月份的键
    if (unref(seedList).hasOwnProperty(index)) {
        // 查找是否已经有相同的种子项
        const existingSeedIndex = unref(seedList)[index].findIndex(seed => seed.farm_product_id === item.farm_product_id);
        if (existingSeedIndex > -1) {
            // 如果存在相同的种子项，则从数组中删除该项
            editOptional(index, 'del')
            unref(seedList)[index].splice(existingSeedIndex, 1);
            seedLength.value--
            if (unref(seedList)[index].length === 0) {
                seedIndexList.value = seedIndexList.value.filter((i) => i !== index);
            }
            if (seedIndexList.value.length === 0) {
                showBottom.value = false
            }
            return;
        }
    }

    // 添加新的种子项到数组中
    if (!unref(seedList).hasOwnProperty(index)) {
        unref(seedList)[index] = [];
    }
    unref(seedList)[index].push(item);
    seedLength.value++;
    editOptional(index, 'add')
    addToCart(item, event, index)
    console.log(`添加 ${item.product_name}`);
};

// 是否存在
const wehPagest = (item, index) => {
    let existingItem = false
    const months = item.planting_month.split(',');
    months.forEach((month) => {
        month = formattedIndex(month);
        if (seedList.value[`${month}`] && month === index) {
            existingItem = seedList.value[`${month}`].some(seed => seed.farm_product_id === item.farm_product_id);
        }
    });
    return existingItem;
};

// 搜索
watch(
    () => unref(searchVlaue),
    (val, old) => {
        if (val === "") {
            init("");
            restIcon.value = false;
        } else {
            init(searchVlaue.value);
        }
    }
);
// 获取月份
const getMonths = () => {
    const currentMonth = new Date().getMonth();
    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    curMonth.value = months[currentMonth];
    setTimeout(() => {
        initBtn.value = true;
    }, 400);
};
// 距离月底最后一天
const daysUntilMonthEnd = (targetMonth) => {
    if (targetMonth === undefined) {
        // 如果没有传入目标月份，则计算本月剩余天数
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const lastDay = new Date(year, month + 1, 0).getDate();
        const remainingDays = lastDay - currentDate.getDate();
        return remainingDays;
    } else {
        // 如果传入了目标月份，则计算指定月份有多少天
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const lastDay = new Date(year, targetMonth + 1, 0).getDate();
        return lastDay;
    }
}
// 搜索操作
const onSearch = (val) => {
    init(val);
    restIcon.value = true;
};

// 获取我已经有的种子
const getMySeed = () => {
    http.post("myobtPro", {
        farm_plot_id: mainStor.curFarmPlot.farm_plot_id,
    }).then((res) => {
        if (res.data.length > 0) {
            farmList.value = res.data[0].Product;
        } else {
            farmList.value = [];
        }
    });
};

// 初始化
const init = async (val) => {
    load.show();

    indexList.value = [];
    seedList.value = {};
    indexedSeedList.value = {};

    const { data } = await http.post("obtPro", {
        planting_month: "",
        search: val ? val : "",
    });
    const monthSele = await http.post("monSele", {
        farm_plot_id: curFarmPlot.value.farm_plot_id,
    });

    for (const item of data) {
        const months = item.planting_month.split(',');
        for (const month of Array.from(months, formattedIndex)) {
            if (!indexedSeedList.value[month]) {
                indexedSeedList.value[month] = [];
                indexList.value.push(month);
            }
            indexedSeedList.value[month].push(item);
        }
    }
    indexList.value = sortIndexList(indexList.value);
    const monthMapold = new Map();
    unref(indexList).forEach(val => {
        monthSele.data.forEach(month => {
            if (formattedIndex(month.month) === val) {
                monthMapold.set(formattedIndex(month.month), month);
            }
            monthSeleList.value[formattedIndex(month.month)] = month
        });
    });
    monthMap = monthMapold
    console.log(indexList.value, monthSeleList, monthMap);
    load.hide();
};

const sortIndexList = (list) => {
    const [curMonthFirst, ...curMonthRest] = curMonthList.value;
    list.sort((a, b) => {
        if (a === curMonthFirst) {
            return -1;
        } else if (b === curMonthFirst) {
            return 1;
        } else {
            const aIndex = curMonthRest.indexOf(a);
            const bIndex = curMonthRest.indexOf(b);
            return aIndex === -1 || bIndex === -1 ? Number(a) - Number(b) : aIndex - bIndex;
        }
    });

    return list;
};


onMounted(() => {
    getMonths();
    init();
    // getMySeed()
});
</script>

<style scoped>
:deep(.van-index-anchor) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f6f8fb;
}

:deep(.van-index-bar__sidebar) {
    margin-right: 5px;
}

:deep(.van-index-bar__index) {
    font-size: 12px;
    line-height: 30px;
}
</style>
