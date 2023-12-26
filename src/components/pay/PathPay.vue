<template>
    <van-popup v-model:show="open"
               round
               closeable
               @click-close-icon="closeEmit"
               @click-overlay="closeEmit"
               :overlay="overlay"
               position="bottom"
               :style="{ minHeight: '60%' }">
        <div class="pt-[15%]">
            <van-radio-group v-model="currentPath"
                             @change="editItem">
                <div v-for="(item, index) in pathList"
                     :key="item.user_id"
                     class="  h-[6rem] w-full  flex justify-start items-center px-4 border-b ">
                    <div class=" h-[90%] ml-4 flex flex-col justify-center items-start  w-[80%] ">
                        <div class=" w-1/2 h-1/2 flex justify-between items-center">
                            <span>{{ item.consignee }}</span>
                            <span>{{ item.mobile }}</span>
                        </div>
                        <div class=" address_text h-1/2 text-left mt-1 subpixel-antialiased   ">
                            <p>{{ item.address }}</p>
                        </div>
                    </div>
                    <div>
                        <van-radio :name="item"></van-radio>
                    </div>
                </div>
            </van-radio-group>
        </div>
    </van-popup>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
    open: Boolean,
    overlay: {
        type: Boolean,
        default: false,
    },
    currentPath: Object,
    pathList: Array,
});

const emit = defineEmits(['close', 'changes']);

const closeEmit = () => {
    emit('close');
};
const editItem = (item) => {
    emit('changes', item);
    emit('close');
};

const open = ref(props.open);
const currentPath = ref(props.currentPath);
const pathList = ref(props.pathList);

// Verfolgen Sie Änderungen an den props
watch(() => props.open, (newValue) => {
    open.value = newValue;
});

watch(() => props.currentPath, (newValue) => {
    currentPath.value = newValue;
});

watch(() => props.pathList, (newValue) => {
    pathList.value = newValue;
});

onMounted(() => {
    console.log(props, pathList.value);
});
</script>
