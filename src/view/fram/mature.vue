<template>
    <div class=" ">
        <div v-if="framList.length === 0"><van-empty description="暂无蔬菜" />
        </div>
        <div class=" px-2">
            <van-skeleton title
                          avatar
                          :row="2"
                          v-for="(item, index) in framList"
                          :key="index + 'fram'"
                          :loading="loading">
                <div style="box-shadow: 0 3.2px 12px #00000014, 0 5px 25px #0000000a"
                     class=" flex justify-start items-start w-full rounded-xl  px-2 py-2 mt-4">
                    <van-image round
                               width="4rem"
                               height="4rem"
                               src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg" />
                    <div class=" flex flex-col justify-between items-start ml-4 h-[4rem]">
                        <div>title</div>
                        <div>描述..........</div>
                    </div>
                </div>
            </van-skeleton>

        </div>

    </div>
</template>

<script setup>
import { onMounted, onBeforeMount, inject, ref, unref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMainStore } from '@/store/index.js'
import { storeToRefs } from 'pinia'

const mainStor = useMainStore()
const { user, access_token, nursery_id, wherWx, farmPlotList } = storeToRefs(mainStor)


const http = inject("http");
const Tools = inject("Tools");
const load = inject("load");

const loading = ref(true);
const framList = ref([
    {}, {}, {}, {}, {}, {}, {}, {}, {},
])


const init = () => {
    load.show()
    // const { data } = await http.post('myfarm')
    http.post('myobtPro', {
        farm_plot_id: mainStor.curFarmPlot.farm_plot_id
    }).then((res) => {
        framList.value = res.data
    }).finally(() => load.hide())
}


onMounted(() => {
    init()
});


</script>

<style scoped ></style>
