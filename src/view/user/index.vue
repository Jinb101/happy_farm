<template>
    <div class=" h-full w-full  bg-[#14cd3f79]">

        <div class=" h-1/3  w-full">
            <div class=" h-1/2 w-full flex justify-between items-center px-4">
                <div class=" user_btn_show  bg-white flex justify-start items-center w-[40%] rounded-xl  px-3 py-3 mt-4">
                    <ProductItem :url="'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'"
                                 :text="'王大锤'" />
                    <div class=" flex flex-col justify-between items-start ml-4 h-[4rem] text-sm">
                        <div>王大锤</div>
                        <div>家长</div>
                    </div>
                </div>
                <div class="mt-4 h-full flex justify-center items-center ">
                    <van-icon name="exchange"
                              size="2rem"
                              color="white" />
                </div>
                <div class=" user_btn_show bg-white flex justify-start items-center w-[40%] rounded-xl px-3 py-3 mt-4">

                    <ProductItem :url="'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'"
                                 :text="'王小锤'" />
                    <div class=" flex flex-col justify-between items-start ml-4 h-[4rem] text-sm">
                        <div>王小锤</div>
                        <div>宝宝</div>
                    </div>
                </div>
            </div>

            <div class=" h-1/2 w-full flex justify-center items-center ">
                <div class=" h-3/4 w-[90%] bg-white user_btn_show rounded-2xl flex">
                    <div class=" h-full w-1/2 flex justify-center items-center">
                        <img src="/src/assets/images/pay.png"
                             class="  h-12 w-12 "
                             alt=""
                             srcset="">
                    </div>
                    <div class=" h-full w-1/2 flex justify-center items-center ">
                        <van-rolling-text class="my-rolling-text"
                                          :text-list="textList"
                                          auto-start
                                          :duration="2" />
                        <van-icon name="balance-o"
                                  size="24px"
                                  class=" ml-4" />
                    </div>
                </div>
            </div>

        </div>

        <div class="h-2/3 w-full shadow-inner  rounded-t-2xl absolute  left-0 bottom-0 bg-white pt-12">
            <van-cell-group>
                <van-cell v-for="(item, index) in menuList"
                          :key="item.key"
                          :title="item.title"
                          @click="toCEell(item, index)"
                          title-style="text-align:left"
                          is-link />
            </van-cell-group>
        </div>
    </div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import ProductItem from "@/components/product/ProductItem.vue";



const router = useRouter()

const load = inject('load')
const http = inject('http')


const myPay = ref({})
const textList = ref([
    '0.00'
]);

const menuList = ref([
    {
        title: '家庭成员',
        icon: '',
        to: '/family',
        key: 1
    },
    {
        title: '地址管理',
        icon: '',
        to: '/path',
        key: 2
    },
])


const toCEell = (item, index) => {
    router.push(item.to)
}


const init = async () => {

    // 我的钱包
    const { data } = await http.post('myWall')
    console.log(data);
    myPay.value = data
    textList.value.push(data.balance)
    console.log(myPay.value);
}


onMounted(() => {
    init()
})


</script>

<style scoped >
.my-rolling-text {
    --van-rolling-text-font-size: 24px;
    --van-rolling-text-gap: 2px;
    --van-rolling-text-item-border-radius: 5px;
    --van-rolling-text-item-width: 20px;
}
</style>
