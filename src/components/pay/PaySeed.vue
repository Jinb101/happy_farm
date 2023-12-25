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
            <slot></slot>
            <div class="w-full text-left  px-4 bg-slate-50 h-8 flex justify-start items-center">{{ text }} :</div>
            <div class=" overflow-y-auto w-full">
                <div v-for="(veg, index) in list"
                     class="flex justify-between items-center px-4 border-b border-gray-100"
                     :key="index">
                    <div class=" w-1/2 h-14  flex justify-start items-center">
                        <ProductItem :url="''"
                                     :text="veg.product_name" />
                        <span v-if="veg.url"
                              class=" ml-4">{{ veg.product_name }}</span>
                    </div>
                    <div>
                        {{ veg.num + ' 斤' }}
                    </div>
                </div>
            </div>
            <div class=" w-full h-14 absolute left-0 bottom-0 px-10">
                <van-button type="primary"
                            @click="confirm"
                            block>确认</van-button>
            </div>
        </div>
    </van-popup>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

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
    list: Array,
});

const emit = defineEmits(['close', 'subit']);


const closeEmit = () => {
    emit('close');
};
const confirm = () => {
    emit('subit');
};

const open = ref(props.open);
const list = ref(props.list);
const text = ref(props.text);

// Verfolgen Sie Änderungen an den props
watch(() => props.open, (newValue) => {
    open.value = newValue;
});

watch(() => props.list, (newValue) => {
    list.value = newValue;
});
watch(() => props.text, (newValue) => {
    text.value = newValue;
});


</script>
