<template>
    <keep-alive>
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
                         @click="cardSelected(item)"
                         style="box-shadow: 0 3.2px 12px #00000014, 0 5px 25px #0000000a"
                         class=" w-1/3 h-[40%] flex items-center justify-center rounded-xl relative bg-[#14cd3f8e] text-white">
                        <div class=" absolute right-2 bottom-2">
                            <van-icon :name="item.icon"
                                      size="20" />
                        </div>
                        {{ item.title }}
                    </div>
                </div>
            </div>
            <div class="h-1/3 w-full rounded-t-lg shadow-inner shadow-slate-300">
                <FarmModel />
            </div>
        </div>
    </keep-alive>
</template>

<script setup>
import { onMounted, ref, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router';

import FarmModel from '@/view/fram/model.vue'
import { load } from '@/utils/tools/loading.js';

const router = useRouter();
const http = inject("http")


const btnList = [
    {
        title: '我的蔬菜',
        to: 'veg',
        icon: 'flower-o'
    },
    {
        title: '种子列表',
        to: 'seed',
        icon: 'hot-o'
    },
    {
        title: '成熟列表',
        to: 'mature',
        icon: 'notes-o'
    },
]



// 轮播
const bannerLists = ref([])

const cardSelected = (item) => {
    router.push(item.to)
}

const fetchData = async () => {
    load.show('');
    try {
        const response = await http.get('banner') // 使用封装的get请求
        bannerLists.value = response.data.map((i) => !i.is_show)
        console.log(response.data);
    } catch (error) {
        console.error(error)
    } finally {
        load.hide();
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
