<template>
    <div class=" h-full w-full  relative">
        <van-swipe class="my-swipe h-[30%] w-full"
                   :autoplay="3000"
                   indicator-color="white">
            <van-swipe-item v-for="(imgs, index) in bannerLists"
                            :key="imgs.delete_person_id">
                <van-image width="100%"
                           height="100%"
                           :src="imgs.url">
                    <template v-slot:loading>
                        <van-loading type="spinner"
                                     size="30" />
                    </template>
                </van-image>
            </van-swipe-item>
        </van-swipe>

        <div class=" w-full h-[70%] pt-4 ">
            <van-list v-model:loading="loading"
                      :finished="finished"
                      finished-text="没有更多了"
                      :offset="200"
                      @load="onLoad">
                <div class=" w-[40%] h-[6rem] bg-gray-100 mb-6"
                     v-for=" item in list"
                     @click="viewItem(item)">
                    <div class=" h-1/4 w-full bg-gray-200 flex justify-between items-center px-2">
                        <span class=" text-xs">{{ item.parent }}</span>
                        <van-icon color="yellow"
                                  name="shop-collect-o" />
                    </div>
                    <div></div>`
                </div>
            </van-list>
        </div>



        <div class=" absolute bottom-8 w-full h-[10%] flex justify-center items-center">
            <transition name="move-down">
                <div v-show="move"
                     class=" h-[60%] w-[80%]  ">
                    <van-button round
                                block
                                icon-position="right"
                                icon="hot-o"
                                class="right_icon btn-show"
                                @click="showBottom = true"
                                style="height: 100%;background-color: #14cd3f96;color:white;"
                                type="info">解锁我的土地</van-button>
                </div>
            </transition>
        </div>

        <!-- 圆角弹窗（底部） -->
        <van-popup v-model:show="showBottom"
                   round
                   closeable
                   position="bottom"
                   :style="{ height: '80%' }">
            <div class=" h-full w-full px-4 pt-[15%] pb-2 flex flex-col  justify-start items-center">
                <div v-for="(item, index) in priceList"
                     :key="index"
                     @click="selePrice = index"
                     :class="selePrice === index ? 'btn-show' : ''"
                     class="price_item relative  sele_border transition-all duration-500">
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
                    <div :class="selePrice === index ? ' opacity-100' : ' opacity-0'"
                         class=" absolute left-[-10%] transition-all duration-500 ">
                        <van-icon name="circle"
                                  size="18px"
                                  class=" text-blue-400" />
                    </div>
                </div>

                <div class=" w-full">
                    <van-divider :style="{ fontSize: '12px' }"
                                 hairline>价格规则及说明</van-divider>
                </div>
                <div @click="onPriceItem(selePrice)"
                     class=" absolute bottom-10 w-[70%] ">
                    <van-button round
                                block
                                style="background-color: #14cd3f96;color:white;"
                                icon-position="right"
                                class="btn-show"
                                icon="cash-back-record-o">支付</van-button>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script setup>
import { onMounted, ref, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { useMainStore } from '@/store/index.js'
import { storeToRefs } from 'pinia'

const router = useRouter();
const mainStor = useMainStore()
const { status, access_token, nursery_id, wherWx } = storeToRefs(mainStor)
const http = inject("http")
const load = inject("load")
const wxTools = inject("wxTools");



const list = ref([
]);
const loading = ref(false);
const finished = ref(false);

const paging = ref({
    page: 1,
    limit: 10
})
// 轮播
const bannerLists = ref([])
// 去购买
const move = ref(false)
// 购买
const unlock = ref(false)
// 价格数据
const priceList = ref({})
//当前选择的是哪一个
const selePrice = ref('two_years')
const showBottom = ref(false)

// 价格对应名称
const priceNameList = ref({
    one_year: '一年价格',
    two_years: '二年价格',
    three_years: '三年价格',
    four_years: '四年价格',
})



// 滚动触底
const onLoad = (type) => {
    if (finished.value) {
        return
    }
    if (!type) {
        unref(paging).page++
    }
    getNatur()
    loading.value = false;
}





// 地块 id
const farm_id = ref('')

// 价格按钮点击
const onPriceItem = async (index) => {
    try {
        load.loading('', true)
        // if (!wherWx) return load.error('请使用手机微信打开')
        // 支付方式
        const payMode = await http.post('getPay')
        const curIndex = payMode.data
        // 后期可能根据方式调取 不同支付方式
        switch (curIndex) {
            case '1':
                console.log('微信支付');
                // 订单 ID
                const payScribe = await http.post('subscribe', {
                    // farm_id: 1,
                    // farm_classroom_id: 1,
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
                        init()
                        showBottom.value = false
                    } else {
                        load.info('请刷新重试')
                    }
                })
                break;
            default:
                console.log('二维码');
                break;
        }
        load.clear()
    } catch (error) {
        load.clear()
        load.info('请刷新重试')
        console.log(error.message);

    }
}

// 课程
const getNatur = async () => {
    const { data } = await http.post('natur', {
        ...paging.value,
    })
    if (data.length === 0) {
        finished.value = true;
        return
    }

}

// 轮播
const fetchData = async () => {
    load.show()
    try {
        getNatur()
        const { data } = await http.post('getPrice')
        const response = await http.get('banner', {
            banner_type: 2
        }) // 使用封装的 get 请求
        bannerLists.value = response.data.map((i) => !i.is_show)
        priceList.value = data
    } catch (error) {
        console.error(error)
    }
    load.hide();
    move.value = true;
}


// 初始化 定义状态
const init = (e) => {
    http.post('myfarm').then((r) => {
        const { data } = r
        mainStor.farmPlotList = data
        mainStor.status = data.length === 0 ? 0 : 1
        if (data.length > 0) {
            mainStor.curFarmPlot = data[0]
        }
    })
}





onMounted(() => {
    fetchData()
})


</script>

<style scoped >
.price_item {
    background: #14cd3f96;
    color: white;
    width: 80%;
    margin-bottom: 2rem;
    border-radius: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: .8rem 3rem;
    text-align: left;
}
</style>
