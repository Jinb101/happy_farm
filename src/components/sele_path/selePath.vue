<template>
    <van-popup v-model:show="props.open"
               position="bottom"
               :style="{ height: '50%' }"
               get-container="#app"
               close-on-popstate
               safe-area-inset-bottom>
        <van-cascader v-model="code"
                      swipeable
                      title="请选择所在地区"
                      :options="props.list"
                      @finish="finish"
                      @close="close"
                      :field-names="fieldNames" />
    </van-popup>
</template>


<script setup>
import { ref, reactive, watchEffect, onMounted, toRefs } from 'vue';



const emit = defineEmits(['finish', 'close'])
const props = defineProps({
    open: Boolean,
    list: {
        type: Array,
        default: () => []
    },
});

const code = ref('');
const fieldNames = {
    text: 'n',
    value: 'i',
    children: 'children',
};

const finish = (e) => {
    emit('finish', e)
}
const close = () => {
    emit('close')
}




</script>

<style lang='less'></style>
