<template>
    <div class=" h-full w-full relative overflow-hidden">
        <div class="bg-[#14cd3f79]  h-[30%] w-full  flex justify-center items-center">
            <img src="@/assets/images/baicai.png"
                 class="h-12">
        </div>
        <div class="h-[100%] rounded-t-2xl absolute bottom-[-20%] left-0 right-0  bg-white shadow-inner">
            <div class=" h-full w-full flex justify-center items-start pt-[30%]">

                <transition name="move-left">
                    <div v-show="move"
                         class="transition_box h-full w-full ">
                        <van-button round
                                    block
                                    icon-position="right"
                                    icon="hot-o"
                                    class="right_icon"
                                    @click="getPrice"
                                    style="height: 100%;background-color: #14cd3fbe;color:white;"
                                    type="info">解锁我的土地</van-button>
                    </div>
                </transition>
                <transition name="move-right">
                    <div v-show="unlock"
                         class="transition_box h-full w-full flex flex-col justify-start items-center order-3">
                        <div v-for="(item, index) in priceList"
                             :key="index"
                             @click="onPriceItem(item, index)"
                             class="price_item relative">
                            <div>{{ priceNameList[index] }}</div>
                            <div class="flex justify-between items-center">
                                <div>
                                    <div>原价：</div>
                                    <div>优惠价：</div>
                                </div>
                                <div class="flex flex-col justify-between items-center">
                                    <span>{{ item.original_price }}</span>
                                    <span>{{ item.preferential_price }}</span>
                                </div>
                            </div>
                            <div v-if="index == 'two_years' || index == 'three_years'"
                                 class=" absolute right-2 text-red-500 top-2">
                                <van-icon name="hot-sale-o"
                                          size="30px" />
                            </div>
                        </div>
                        <div class=" text-gray-400 text-xs mt-10">价格规则及说明</div>
                    </div>
                </transition>
                <!-- 圆角弹窗（底部） -->
                <van-popup v-model:show="showBottom"
                           round
                           position="bottom"
                           :style="{ height: '70%' }">
                    <van-form @submit="onSubmit"
                              :style="{ marginTop: '20%' }">
                        <van-cell-group inset>
                            <van-field v-model="formValue.child"
                                       name="地主"
                                       label="地主"
                                       placeholder="地主"
                                       :rules="[{ required: true, message: '请填写地主名称' }]" />
                            <van-field v-model="formValue.parent"
                                       name="土地工"
                                       label="土地工"
                                       placeholder="土地工"
                                       :rules="[{ required: true, message: '请填土地工名称' }]" />
                            <van-field v-model="formValue.telephone"
                                       name="手机号"
                                       label="手机号"
                                       placeholder="手机号"
                                       :rules="[{ required: true, message: '请填手机号' }]" />
                            <van-field v-model="formValue.plot_name"
                                       name="土地名称"
                                       label="土地名称"
                                       placeholder="土地名称"
                                       :rules="[{ required: true, message: '请填土地名称' }]" />
                        </van-cell-group>
                        <div style="margin: 30px;">
                            <van-button round
                                        block
                                        type="primary"
                                        native-type="submit">
                                提交
                            </van-button>
                        </div>
                    </van-form>
                </van-popup>
            </div>
        </div>

    </div>
</template>

<script setup>
import { load } from '@/utils/tools/loading.js';
import { onMounted, onBeforeMount, inject, ref, unref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMainStore } from '@/store/index.js'
import { storeToRefs } from 'pinia'


const router = useRouter()
const http = inject("http");
const Tools = inject("Tools");
const wxTools = inject("wxTools");
const mainStor = useMainStore()
const { user, access_token, nursery_id, wherWx } = storeToRefs(mainStor)




// 去购买
const move = ref(false)
// 购买
const unlock = ref(false)
// 底部弹窗
const showBottom = ref(false)
// 价格数据
const priceList = ref({})
// 价格对应名称
const priceNameList = ref({
    one_year: '一年价格',
    two_years: '二年价格',
    three_years: '三年价格',
    four_years: '四年价格',
})
// 表单数据
const formValue = ref({
    child: '',
    parent: '',
    telephone: '',
    plot_name: '',
})
// 地块id
const farm_id = ref('')


// 表单提交
const onSubmit = async (values) => {
    const sub = await http.post('setPar', {
        farm_plot_id: farm_id.value,
        child: unref(formValue).child,
        parent: unref(formValue).parent,
        telephone: unref(formValue).telephone,
        plot_name: unref(formValue).plot_name,
    })
    load.success('马上赶往您的土地!')
    router.replace('/fram')
    console.log('submit', values);
};
// 价格按钮点击
const onPriceItem = async (item, index) => {
    try {
        load.show(true)
        // if (!wherWx) return load.error('请使用手机微信打开')
        // 支付方式
        const payMode = await http.post('getPay')
        const curIndex = payMode.data
        console.log(curIndex);
        // 后期可能根据方式调取 不同支付方式
        switch (curIndex) {
            case '1':
                console.log('微信支付');
                // 订单ID
                const payScribe = await http.post('subscribe', {
                    // farm_id: 1,
                    purchase_type: index
                })
                farm_id.value = payScribe.data
                // 微信配置信息
                const wxConfig = await http.post('getShare', {
                    type: curIndex
                })
                mainStor.wxConfig = wxConfig
                // 调取微信支付
                wxTools.wxPay({
                    farm_order_id: payScribe.data, open_id: mainStor.user.open_id
                }).then((res) => {
                    if (res.code === 208) {
                        load.success('支付成功\n请设置信息')
                        showBottom.value = true
                    } else {
                        load.info('请刷新重试')
                    }
                })
                break;
            default:
                console.log('二维码');
                break;
        }
    } catch (error) {
        load.info('请刷新重试')
        console.log(error.message);
    } finally {
        load.hide()
    }
}
// 获取土地价格
const getPrice = async (e) => {
    const { data } = await http.post('getPrice')
    priceList.value = data
    move.value = false
    unlock.value = true
}
// 判断是否是微信
const is_weixn = () => {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
    } else {
        return false;
    }
}
// 获取月份
const getCurMonthList = () => {
    const curDate = new Date(); // 当前日期
    const curMonth = curDate.getMonth(); // 当前月份
    const curDay = curDate.getDate(); // 当前日期中的天数

    const monthList = []; // 存储月份的列表

    for (let i = 0; i < 12; i++) {
        let targetMonth = curMonth + i;
        let targetYear = curDate.getFullYear();

        // 如果当前月份已经过了10天，则往后推12个月
        if (curDay > 15 && i === 0) {
            targetMonth++;
        }

        // 处理月份超出12的情况
        if (targetMonth >= 12) {
            targetMonth -= 12;
            targetYear++;
        }

        // 格式化索引
        const index = (targetMonth + 1).toString().padStart(2, '0'); // 修改此处

        const targetDate = new Date(targetYear, targetMonth);
        monthList.push(index);
    }

    return monthList;
}

// 初始化
const init = (e) => {
    load.loading('', true)
    Tools.getUrlParam('h5').then((value) => {
        if (!value) {
            return
        }
        let wherWx = is_weixn()
        const params = Tools.decrypt(value)
        mainStor.access_token = params.data.access_token
        Tools.storage('s', 'set', 'Basics', {
            access_token: params.data.access_token,
            n_id: 0,
            user: params.data
        })
        mainStor.user = params.data
        mainStor.type = params.type
        mainStor.curMonthList = getCurMonthList()
        mainStor.wherWx = wherWx
        mainStor.curActive = 0
        http.post('myfarm').then((r) => {
            const { data } = r
            mainStor.farmPlotList = data
            mainStor.status = data.length === 0 ? 0 : 1
            mainStor.curFarmPlot = data[0]
            router.replace('/fram')
            load.clear()
        })
    })
}


onMounted(() => init())



</script>

<style scoped lang="less">
:deep(.right_icon) {
    height: 3rem !important;
    width: 70%;
    margin: 1rem auto;
}


:deep(.van-button__icon) {
    font-size: 30px;
}

.price_item {
    background: #14cd3fab;
    color: white;
    width: 70%;
    margin-bottom: 1rem;
    border-radius: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: .8rem 3rem;
    text-align: left;
}
</style>
