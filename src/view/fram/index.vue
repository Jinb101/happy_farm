<template>
    <div class="h-full w-full flex flex-col justify-between">
        <div class="h-2/3 w-full flex flex-col justify-center items-start">
            <van-swipe class="my-swipe h-[40%] w-full"
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
            <div class="card h-[60%] w-full flex justify-between items-center flex-wrap px-6  py-4">
                <div v-for="(item, index ) in btnList"
                     :key="index"
                     @click="cardSelected(item, index)"
                     :class="!item.state && index !== 3 ? 'bg-gray-300' : ''"
                     class="btn-show w-1/3 h-[40%] flexitems-center justify-center rounded-xl relative bg-[#14cd3f96] text-[#fff] px-2">
                    <div class=" absolute right-2 bottom-2">
                        <van-icon :name="item.icon"
                                  size="20" />
                    </div>
                    <div class=" flex justify-start items-start w-full h-full pt-4 text-left">
                        {{ item.title }}
                    </div>
                </div>
            </div>
        </div>
        <div class=" h-1/3 w-full rounded-t-lg shadow-inner shadow-slate-300">
            <FarmModel />
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { useMainStore } from '@/store/index.js'
import { storeToRefs } from 'pinia'
import FarmModel from '@/view/fram/model.vue'

const router = useRouter();
const mainStor = useMainStore()
const { status, access_token, nursery_id, wherWx } = storeToRefs(mainStor)
const http = inject("http")


const btnList = [
    {
        title: '选种子',
        to: 'seed',
        icon: 'hot-o',
        state: status
    },
    {
        title: '我的蔬菜',
        to: 'veg',
        icon: 'flower-o',
        state: status
    },
    {
        title: '逛菜市',
        to: 'market',
        icon: 'notes-o',
        state: status
    },
    {
        title: '大自然教育',
        to: 'edu',
        icon: 'hotel-o',
        state: status
    },
]



// 轮播
const bannerLists = ref([])

const cardSelected = (item, index) => {
    if (!item.state && index !== 3) {
        return
    }
    router.push(item.to)
}

const fetchData = async () => {
    try {
        const response = await http.get('banner') // 使用封装的get请求
        bannerLists.value = response.data.map((i) => !i.is_show)
    } catch (error) {
        console.error(error)
    }
}

onMounted(() => {
    fetchData()
})

</script>

<style scoped>
.card {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.my-swipe .van-swipe-item {
    width: 100%;
    color: #fff;
    font-size: 20px;
    line-height: 150px;
    text-align: center;
    background-color: rgba(128, 128, 128, 0.384);
}
</style>
