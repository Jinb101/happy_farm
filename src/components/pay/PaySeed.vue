<template>
    <van-popup v-model:show="open"
               round
               closeable
               @click-close-icon="closeEmit"
               @click-overlay="closeEmit"
               :overlay="overlay"
               position="bottom"
               :style="{ minHeight: '70%' }">
        <div class="pt-[15%] pb-14 h-full w-full">
            <div class="w-full text-left  px-4 bg-slate-50 h-8 flex justify-between items-center">
                <span>地址 : </span>
                <span>预计邮费 : {{ postage }} 元</span>
            </div>
            <div class="  h-[6rem] w-full  px-4  flex justify-start items-center "
                 @click="selePath = true">
                <div class=" h-[90%]  flex flex-col justify-center items-start  w-[80%] ">
                    <div class=" w-1/2 h-1/2 flex justify-between items-center">
                        <span>{{ currentPath.consignee }}</span>
                        <span>{{ currentPath.mobile }}</span>
                    </div>
                    <div class=" address_text h-1/2 text-left mt-1 subpixel-antialiased   ">
                        <p>{{ currentPath.address }}</p>
                    </div>
                </div>
                <div class=" flex justify-end items-center  w-[20%] h-full py-4">
                    <van-icon name="arrow" />
                </div>
            </div>
            <div class="w-full text-left  px-4 bg-slate-50 h-8 flex justify-between items-center"><span>{{ text }} :</span>
                <span v-show="money !== 0">{{ '总 ' + (money + postage) + ' 元' }}</span>
            </div>
            <div class=" overflow-y-auto w-full">
                <div v-for="(veg, index) in list"
                     class="flex justify-between items-center px-4 border-b border-gray-100"
                     :key="index">
                    <div class=" w-1/3 h-14  flex justify-start items-center">
                        <ProductItem :url="''"
                                     :text="veg.product_name" />
                        <span v-if="veg.url"
                              class=" ml-4">{{ veg.product_name }}</span>
                    </div>
                    <div class="w-1/3  flex justify-center items-center">
                        {{ (veg.num * Number(veg.FarmStall.selling_price)) + " 元" }}
                    </div>
                    <div class=" w-1/3 flex justify-end items-center ">
                        {{ veg.num || veg.FarmStall.sales_quantity }}
                        斤
                    </div>
                </div>
            </div>
            <div class=" w-full h-14 absolute left-0 bottom-0 px-10">
                <van-button type="primary"
                            @click="confirm"
                            block>确认</van-button>
            </div>
        </div>
        <PathPay :open="selePath"
                 :currentPath="currentPath"
                 :pathList="pathList"
                 :overlay="true"
                 @close="selePath = false"
                 @changes="(e) => currentPath = e">
        </PathPay>
    </van-popup>
</template>

<script setup>
import { ref, onMounted, watch, inject } from 'vue';
import PathPay from "@/components/pay/PathPay.vue";


const http = inject("http");
const load = inject("load");

const props = defineProps({
    open: Boolean,
    overlay: {
        type: Boolean,
        default: true,
    },
    text: {
        type: String,
        default: '已选',
    },
    money: {
        type: Number,
        default: 0,
    },
    list: Array,
});

const emit = defineEmits(['close', 'subit', 'path']);


const closeEmit = () => {
    emit('close');
};
const confirm = () => {
    emit('subit', currentPath);
};

const open = ref(props.open);
const list = ref(props.list);
const text = ref(props.text);
const money = ref(props.money);

// 邮费
const postage = ref();
const selePath = ref(false);
const currentPath = ref({});
const pathList = ref([]);



// Verfolgen Sie Änderungen an den props
watch(() => props.open, async (newValue) => {
    if (newValue) {
        load.show();
        await getPath()
        await getPostage()
        load.hide();

    }
    open.value = newValue;
});

watch(() => props.list, (newValue) => {
    list.value = newValue;
});
watch(() => props.text, (newValue) => {
    text.value = newValue;
});
watch(() => props.money, (newValue) => {
    money.value = newValue;
});



// 地址铺
const getPath = async () => {
    try {
        const { data } = await http.post('familyPath', {
            page: 1,
            limit: 999,
        })
        pathList.value = data
        currentPath.value = data.find((i) => {
            return i.is_default === '1';
        });
    } catch (error) {
        console.error(error);
        // 处理错误情况
    }
}
// 地址铺
const getPostage = async () => {
    try {
        console.log(list);
        const farm_stall = list.value.map(item => {
            return {
                farm_stall_id: item.FarmStall.farm_stall_id,
                number: item.num ? item.num : item.FarmStall.sales_quantity
            };
        });
        const { data } = await http.post('postage', {
            farm_stall: JSON.stringify(farm_stall),
            farm_address_id: currentPath.value.farm_address_id
        })
        postage.value = data.amount
    } catch (error) {
        console.error(error);
        // 处理错误情况
    }
}


</script>
