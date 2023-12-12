<template>
    <div class="h-11 w-11 rounded-full flex justify-center items-center bg-blue-400  text-white text-[12px] "
         :class="url ? '' : ' '">
        <template v-if="url">
            <img class="h-full w-full"
                 :src="url"
                 alt="product-image" />
        </template>
        <template v-else>
            <div class="text px-2 py-1">
                {{ truncatedText }}
            </div>
        </template>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    url: {
        type: String,
        default: ""
    },
    text: {
        type: String,
        default: ""
    }
});

const truncatedText = computed(() => {
    if (props.text.length > 5) {
        return props.text.slice(0, 5) + '...'; // 截断文本并添加省略号
    } else {
        return props.text;
    }
});
</script>

<style scoped>
.text {
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
