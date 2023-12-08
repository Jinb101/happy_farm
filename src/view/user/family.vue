<template>
    <div class="h-full w-full">
        <div v-if="familyList.length === 0 && initLoading"><van-empty description="暂无" />
        </div>
        <div v-else>


        </div>

    </div>
</template>

<script setup>
import { ref, onMounted, inject, watch, unref, computed } from 'vue';
import { useMainStore } from '@/store/index.js'
import { storeToRefs } from 'pinia'
import ProductItem from "@/components/product/ProductItem.vue";

const http = inject("http");
const load = inject("load");
const Tools = inject("Tools");
const mainStor = useMainStore()
const { curFarmPlot, user } = storeToRefs(mainStor)

const familyList = ref([])
const initLoading = ref(false)

const init = async () => {
    load.show()
    const { data } = await http.post('family', {
        farm_plot_id: curFarmPlot.value.farm_plot_id
    })
    familyList.value = data.filter((i) => {
        i.user_id !== unref(user).user_id
    })
    initLoading.value = true
    load.hide()
}

onMounted(() => {
    init()
})

</script>

<style scoped ></style>
