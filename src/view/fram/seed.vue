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


        <div class=" h-[92%] w-full overflow-y-auto">

            <van-index-bar :index-list="forIndexList">
                <template v-for="index in indexList"
                          :key="index.month">
                    <van-index-anchor :index="index.month">
                        <span>{{ index.month + " 月" }}</span>
                        <div class="w-[50%] mr-8 flex justify-center items-center gap-20 text-black font-medium">
                            <div class=" w-1/2">{{ monthItemSele(index) }}</div>
                            <div class=" w-1/2">{{ monthItemOptional(index) }}</div>
                        </div>
                    </van-index-anchor>
                    <div v-for=" item in seedList[index.month]"
                         :key="item.uuid"
                         @click="seedListSet(item, index, $event)"
                         class="min-h-[4.5em] w-full flex justify-start items-center px-4 relative border-b border-gray-100">
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
                             class="h-4 w-4 flex justify-center items-center absolute right-[22%]">
                            <van-icon color="#2A9CFF"
                                      name="flag-o" />
                        </div>
                        <div v-if="item.status && item.selef_month == index.month"
                             class="h-10 w-10 rounded-full border  text-xs flex justify-center items-center absolute right-[20%]">
                            <span>已选</span>
                        </div>
                        <div v-show="item.suf"
                             class="h-10 w-10 rounded-full border  text-xs flex justify-center items-center absolute right-[35%]">
                            <span>时间不足</span>
                        </div>
                        <div v-if="item.status && item.selef_month == index.month"
                             @click.stop="editSelef(item, index)"
                             class="h-4 w-4 flex justify-center items-center absolute right-[10%]">
                            <van-icon name="cross" />
                        </div>
                    </div>
                </template>
            </van-index-bar>


            <van-back-top right="9vw"
                          :z-index="3000"
                          :style="{ backgroundColor: ' rgb(147 197 253)' }"
                          bottom="12vh" />
        </div>



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

// btn 实例 ref
const cartButton = ref(null);
const initBtn = ref(false)

//搜索 value
const searchVlaue = ref('')
// 已经选择的种子
const farmList = ref([])
// 索引列表
const indexList = ref([])
const forIndexList = ref([])
// 种子数据
const seedList = ref({})
//添加的列表
const selefSeedList = ref({});
// 已选长度
const seedLength = ref(0);
// 每月可选产品
const monthSeleList = ref([]);


// 计算 每月已选 selected
const monthItemSele = (index) => {
    const selectedMonth = monthSeleList.value.find(value => formattedIndex(value.month) === index.month && value.selected !== 0);
    if (selectedMonth) {
        return `已选 : ${selectedMonth.selected}`;
    } else {
        return '';
    }
};

// 计算 每月可选 optional
const monthItemOptional = (index) => {
    const selectedMonth = monthSeleList.value.find(value => formattedIndex(value.month) === index.month);
    if (selectedMonth) {
        return `可选 : ${selectedMonth.optional}`;
    } else {
        return '';
    }
}

// 辅助函数
const isInRange = (result, index) => {
    if (
        (result.year < index.year) ||
        (result.year === index.year && result.month >= index.month)
    ) {
        return true;
    }
    return false;
};
// 往上 周期判断
const judgment = (item, index) => {
    const curMonthList = monthSeleList.value.filter((i) =>
        i.year < index.year || (i.year === index.year && parseInt(i.month) < index.month)
    );
    console.log(curMonthList);

    if (curMonthList.length > 0) {
        for (const curIndex of curMonthList) {
            for (const cl of unref(seedList)[curIndex.month]) {
                const day = daysUntilMonthEnd(curIndex);
                const totalDays = cl.planting_cycle;
                const result = calculateEndDate(curIndex, totalDays);
                // 我的周期是否达到 index
                const coverOrExist = isInRange(result, index);
                // 可选数组中 index 相同的时间
                const findMatchingMonth = unref(monthSeleList).find((l) => {
                    return l.year === index.year && l.month === index.month;
                });
                console.log(findMatchingMonth, coverOrExist, cl);
                if (coverOrExist && findMatchingMonth.optional === 0) {
                    cl.suf = true;
                } else {
                    cl.suf = false;
                }
            }
        }
    }
}


// 种子点击添加
const seedListSet = async (item, index, event) => {
    const curSele = monthSeleList.value.find(
        (item) => item.year === index.year && parseInt(item.month) === index.month
    );
    if (item.status || item.suf) {
        return
    }
    if (!selefSeedList.value[index.month]) {
        selefSeedList.value[index.month] = [];
    }
    let existingIndex = selefSeedList.value[index.month].findIndex(seed => seed.farm_product_id === item.farm_product_id);
    if (existingIndex >= 0) {
        selefSeedList.value[index.month].splice(existingIndex, 1);
        seedLength.value--
        editOptional(index, 'delete', item)
    } else {
        if (curSele.optional === 0 || curSele.selected === 4) {
            return
        }
        seedLength.value++
        selefSeedList.value[index.month].push(item);
        addToCart(item, event, index);
        editOptional(index, 'add', item)
    }
    judgment(item, index)
};

// 是否存在某个时间段
const isMonthInTimeRange = (monthItem, startIndex, endIndex) => {
    if (monthItem.year < startIndex.year || monthItem.year > endIndex.year) {
        return false;
    }
    if (monthItem.year === startIndex.year && monthItem.month < startIndex.month) {
        return false;
    }
    if (monthItem.year === endIndex.year && monthItem.month > endIndex.month) {
        return false;
    }
    return true;
}

const editOptional = (index, type, item) => {
    // 周期判断 对可选 已选进行改变
    const day = daysUntilMonthEnd(index); // 获取本月剩余天数
    const totalDays = day + item.planting_cycle; // 周期
    const result = calculateEndDate(index, totalDays);

    monthSeleList.value.forEach((monthItem) => {
        console.log(isMonthInTimeRange(monthItem, index, result), monthItem, index, result);
        if (isMonthInTimeRange(monthItem, index, result)) {
            if (type === 'add') {
                monthItem.selected += 1;
                monthItem.optional--;
            } else {
                monthItem.selected -= 1;
                monthItem.optional++;
            }
        }
    });
    console.log(result);
};
// 打开已选列表
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

// 添加蔬菜
const addSeed = () => {
    if (seedLength < 1) {
        return;
    }
    load.loading();
    const product = Object.entries(selefSeedList.value).reduce((arr, [key, values]) => {
        console.log(values, key);
        arr.push({
            planting_month: key,
            farm_product_id: values.map((item) => {
                return item.farm_product_id;
            }),
        });
        return arr;
    }, []);
    http
        .post("addPro", {
            farm_plot_id: curFarmPlot.value.farm_plot_id,
            product: JSON.stringify(product),
        })
        .then((res) => {
            console.log(res.msg);
            console.log(res.code);
            if (res.code == 200) {
                load.success("种植成功");
                // 处理成功响应
                seedLength.value = 0;
                init()
            } else {
                console.log(res);
                load.error(res.data.msg);
            }
        })
        .catch((err) => {
            console.log(err);
            load.error("种植失败 ");
        });
};
// 删除已选
const editSelef = (item, index) => {
    const curSele = monthSeleList.value.find(
        (item) => item.year === index.year && parseInt(item.month) === index.month
    );
    try {
        load.model('是否删除已选蔬菜', (v) => {
            if (v) {
                http.post('deletProu', {
                    farm_plot_products_id: item.farm_plot_products_id,
                }).then((res) => {
                    console.log(res);
                    if (res.code === 200) {
                        load.success('删除成功')
                        delete item.status
                        delete item.selef_month
                        curSele.selected--
                        curSele.optional++
                    } else {
                        load.error(res.data.msg)
                    }
                })
            }
        })

    } catch (error) {

    }
    console.log(item);
}

// 搜索操作
const onSearch = (val) => {
    // searchList(val);
    // restIcon.value = true;
};
// 是否存在
const wehPagest = (item, index) => {
    if (!selefSeedList.value[index.month]) {
        return false
    }
    const isExist = selefSeedList.value[index.month].some(seed => seed.farm_product_id === item.farm_product_id);
    return isExist
};
// 添加动画
const addToCart = async (item, $event, index) => {
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
        document.body.removeChild(newItem);
    }, { once: true });
};

// 格式类型转换
const formattedIndex = (index) => {
    return parseInt(index);
};
// 距离月底最后一天
const daysUntilMonthEnd = ({ year, month }) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    console.log(currentYear, year === currentYear, month === currentMonth, currentMonth);
    let targetYear = year;
    let targetMonth = month;
    let reslt = false

    if (year === currentYear && month === currentMonth) {
        reslt = true
    }

    if (targetMonth <= 0 || targetMonth > 12) {
        return "无效的月份";
    }

    const lastDay = new Date(targetYear, targetMonth, 0).getDate();
    const remainingDays = lastDay - currentDate.getDate();

    return reslt ? remainingDays : lastDay;
}

// 添加辅助函数 时间跨度
const calculateEndDate = (dateObj, days) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const { year, month } = dateObj;

    let targetYear, targetMonth, monthsPassed;

    if (year === currentYear && month === currentMonth) {
        const remainingDays = days - (currentDate.getDate() - 1);
        const nextMonth = new Date(currentYear, currentMonth, remainingDays);
        targetYear = nextMonth.getFullYear();
        targetMonth = nextMonth.getMonth() + 1;
        monthsPassed = currentMonth === 12 ? 0 : 1;
    } else {
        let startDate = new Date(year, month - 1);
        let endDate = new Date(startDate.getTime() + (days - 1) * 24 * 60 * 60 * 1000);

        targetYear = endDate.getFullYear();
        targetMonth = endDate.getMonth() + 1;

        monthsPassed = 0;

        while (startDate <= endDate) {
            startDate.setDate(startDate.getDate() + 1);
            if (startDate.getDate() === 1) {
                monthsPassed++;
            }
        }

        // 对于当前月份为 12 且目标年份为当前年份的情况，需要将跨越的月份数减一
        if (currentMonth === 12 && targetYear === currentYear) {
            monthsPassed--;
        }
    }

    return {
        year: targetYear,
        month: targetMonth,
        monthsPassed,
    };
};


/**
 * 初始化函数
 */
const init = async () => {
    try {
        // 显示加载中
        load.show();

        // 获取已选择的种子
        const farmRes = await http.post("myobtPro", { farm_plot_id: mainStor.curFarmPlot.farm_plot_id });
        farmList.value = farmRes.data.length > 0 ? farmRes.data[0].Product : [];

        // 获取种子列表
        const { data } = await http.post("obtPro", { planting_month: "", search: "" });

        // 获取每月可选产品
        const monthSele = await http.post("monSele", { farm_plot_id: curFarmPlot.value.farm_plot_id });
        monthSeleList.value = monthSele.data;

        // 处理种子数据
        const seedListObj = processSeedList(data, farmRes.data);
        seedList.value = seedListObj;

        // 更新月份选择列表
        updateMonthSelection(monthSeleList.value);

        // 更新索引列表和用于循环的索引列表
        indexList.value = curMonthList.value;
        forIndexList.value = curMonthList.value.map((i) => i.month);

        // 初始化按钮状态
        initBtn.value = true;

        // 打印日志
        // console.log(farmRes);
        // console.log(data);
        // console.log(monthSele);
        // console.log(indexList);
        // console.log(seedList);

        // 隐藏加载中
        load.hide();
    } catch (error) {
        console.error(error);
        // 隐藏加载中
        load.hide();
        // 处理错误
    }
};

/**
 * 处理种子列表数据
 * @param {object[]} dataList 种子列表数据
 * @param {object[]} farmResData 已选择的种子数据
 * @returns {object} 处理后的种子列表对象
 */
const processSeedList = (dataList, farmResData) => {
    console.log(farmList);
    return dataList.reduce((obj, item) => {
        let newItem = { ...item }; // 创建一个新的对象
        // 为 item 添加独无二的 id
        //理当前种子数据
        newItem.months = newItem.planting_month.split(",").map(formattedIndex);
        newItem.months.forEach((month) => {
            obj[month] = obj[month] || [];
            let clonedItem = JSON.parse(JSON.stringify(newItem));
            clonedItem.uuid = Tools.getUUID();
            if (farmResData.length > 0) {
                // 处理已选择的种子列表数据
                farmList.value.forEach((my) => {
                    monthSeleList.value.forEach((se) => {
                        if (clonedItem.farm_product_id == my.farm_product_id) {
                            if (formattedIndex(my.planting_month) == month * 1) {
                                clonedItem.status = my.status;
                                clonedItem.selef_month = formattedIndex(my.planting_month);
                                clonedItem.farm_plot_products_id = my.farm_plot_products_id;
                            }
                        }
                        if (se.month == formattedIndex(my.planting_month)) {
                            se.optional = se.cultivable - se.selected;
                        }
                    });
                });
            }
            obj[month].push(clonedItem)
        })
        return obj
    }, {});
}

/**
 * 更新月份选择列表
 * @param {object[]} monthSeleListValue 月份选择列表数据
 */
const updateMonthSelection = (monthSeleListValue) => {
    curMonthList.value.forEach((curMon) => {
        const seleItem = monthSeleListValue.find((item) => parseInt(item.month) === curMon.month);
        if (seleItem) {
            seleItem.year = curMon.year;
            seleItem.month = curMon.month;
        }
    });
};


onMounted(() => {
    // 初始化数据
    init()
})



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
