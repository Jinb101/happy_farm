<template>
    <div class=" h-full w-full">

        <div v-if="pathList.length === 0 && !initLoading"><van-empty description="暂无" />
            <div class=" h-[8%] w-full px-6">
                <van-button type="primary"
                            round
                            @click="onAdd"
                            block>新增地址</van-button>
            </div>
        </div>



        <div v-if="pathList.length > 0"
             class=" h-full w-full">
            <div class=" h-[92%] w-full px-2">


                <van-swipe-cell>
                    <div v-for="(item, index) in pathList"
                         :key="item.user_id"
                         class=" h-[6rem] w-full  flex justify-start items-center px-4 border-b ">
                        <div class=" w-[12%]">
                            <ProductItem :url="''"
                                         :text="item.consignee" />
                        </div>
                        <div class=" h-[90%] ml-4 flex flex-col justify-center items-start  w-[78%] ">
                            <div class=" w-1/2 h-1/2 flex justify-between items-center">
                                <span>{{ item.consignee }}</span>
                                <span>{{ item.mobile }}</span>
                            </div>
                            <div class=" address_text h-1/2 text-left mt-1 subpixel-antialiased   ">
                                <p>{{ item.address }}</p>
                            </div>
                        </div>
                        <div class=" flex justify-center items-center w-[10%]">
                            <van-icon name="arrow-left"
                                      size="4rem"
                                      color="gray" />
                        </div>
                        <!-- <template #right>
                        <van-button square
                                    text="删除"
                                    type="danger"
                                    class="delete-button" />
                    </template> -->
                    </div>

                </van-swipe-cell>


            </div>
            <div class=" h-[8%] w-full px-6">
                <van-button type="primary"
                            round
                            @click="onAdd"
                            block>新增地址</van-button>
            </div>
        </div>
        <!-- 新增 -->
        <van-popup v-model:show="addShow"
                   round
                   closeable
                   position="bottom"
                   :style="{ height: '70%' }">
            <van-form @submit="onSubmit"
                      class=" mt-10">
                <van-cell-group inset>
                    <van-field v-model="pathForm.consignee"
                               name="姓名"
                               label="姓名"
                               placeholder="姓名"
                               :rules="[{ required: true, message: '请填写姓名' }]" />
                    <van-field v-model="pathForm.mobile"
                               name="手机号"
                               label="手机号"
                               placeholder="手机号"
                               :rules="phoneRules" />
                    <van-field v-model="pathForm.pathAddress"
                               name="地址"
                               readonly
                               label="地区选择"
                               placeholder="点击选择省市区"
                               @click="pathShow = true"
                               is-link
                               :rules="[{ required: true, message: '请选择地址' }]" />
                    <van-field v-model="pathForm.address"
                               rows="1"
                               autosize
                               label="详情地址"
                               type="textarea"
                               placeholder="详情地址"
                               :rules="[{ required: true, message: '请选择地址' }]" />
                    <van-field name="switch"
                               input-align="right"
                               label="默认地址">
                        <template #input>
                            <van-switch v-model="pathForm.is_default"
                                        size="20" />
                        </template>
                    </van-field>
                </van-cell-group>
                <div style="margin: 16px;">
                    <van-button round
                                block
                                type="primary"
                                native-type="submit">
                        提交
                    </van-button>
                </div>

            </van-form>
            <SelePath :open="pathShow"
                      @finish="seleAddress"
                      @close="pathShow = false"
                      :list="pathJson"></SelePath>

        </van-popup>


    </div>
</template>

<script setup>
import { onMounted, inject, ref, unref, watch } from 'vue';
import { useMainStore } from '@/store/index.js'
import ProductItem from "@/components/product/ProductItem.vue";
import { storeToRefs } from 'pinia'
import SelePath from '@/components/sele_path/selePath.vue';
import citysJson from '@/assets/js/path.json'


const mainStor = useMainStore()
const { curFarmPlot, curMonthList } = storeToRefs(mainStor)

const http = inject("http");
const load = inject("load");
const Tools = inject("Tools");


// 获取的 我的地址列表
const pathList = ref([])
// 初始化加载
const initLoading = ref(true)
// 添加 底部 控制器
const addShow = ref(false)
const onAdd = () => addShow.value = true;
const onEdit = (item, index) => Toast('编辑地址:' + index);

// 地址json
const pathJson = ref(null)
// 地址控制器
const pathShow = ref(false)
// 表单
const pathForm = ref({
    consignee: '',
    mobile: '',
    province_id: null,
    city_id: null,
    county_id: null,
    address: null,
    is_default: 0,
    pathAddress: '',
});

// 选择区域
const seleAddress = (e) => {
    unref(pathForm).province_id = e.selectedOptions[0].i
    unref(pathForm).city_id = e.selectedOptions[1].i
    unref(pathForm).county_id = e.selectedOptions[2].i
    unref(pathForm).pathAddress = e.selectedOptions.map((option) => option.n).join('/').replace(/\//g, '-')
    pathShow.value = false
}

// 校验
const phoneRules = [
    { required: true, message: '请输入手机号码' },
    {
        pattern: /^1[3-9]\d{9}$/,
        message: '手机号码格式错误'
    }
];
const onSubmit = async (values) => {
    try {
        load.show()
        const res = await http.post('addPath', {
            ...unref(pathForm),
        })
        getPaht()
        load.success(res.msg)
        load.hide()
        addShow.value = !addShow.value
        console.log('submit', values, res);
    } catch (error) {
        load.error(error.msg)
        load.hide()
    }
};



// 地址json 处理
const appDataCity = (name = "text") => {
    let c = city().map((s) => {
        s[name] = s.n;
        s.children = (s.children || []).map((r) => {
            r[name] = r.n;
            r.children = (r.children || []).map((x) => {
                x[name] = x.n;
                return x;
            });
            return r;
        });
        return s;
    });
    return c;
}
// 地址json 处理
let city = (ids = [], type) => {
    if (!ids.length) return citysJson
    if (ids.length === 3) {
        let id = []
        if (type === 'zh' || type === 'zhs') {
            // 汉字
            let b = citysJson.filter(r => {
                return r.n === ids[0]
            })[0] || {}
            if (!b.i) return id
            id[0] = b.n
            let c = b.children.filter(r => {
                return r.n === ids[1]
            })[0] || {}
            if (!c.i) return id
            id[1] = c.n
            let d = c.children.filter(r => {
                return r.n === ids[2]
            })[0] || {}
            if (!d.i) return id
            id[2] = d.n
            if (type === 'zhs') {
                id = [b, c, d]
            }
        } else if (type === 'id') {
            // id
            let e = citysJson.filter(r => {
                return r.i === +ids[0]
            })[0] || {}
            if (!e.i) return id
            id[0] = e.n
            let f = e.children.filter(r => {
                return r.i === +ids[1]
            })[0] || {}
            if (!f.i) return id
            id[1] = f.n
            let g = f.children.filter(r => {
                return r.i === +ids[2]
            })[0] || {}
            if (!g.i) return id
            id[2] = g.n
        } else {
            // 索引
            let a = citysJson[+ids[0]]
            id[0] = a.i
            id[1] = a.children[+ids[1]].i
            id[2] = a.children[+ids[1]].children[+ids[2]].i
        }
        return id
    }
}

// 获取列表
const getPaht = async () => {
    load.show()
    const { data } = await http.post('familyPath', {
        page: 1,
        limit: 200,
    })
    initLoading.value = false
    pathList.value = data
    pathJson.value = appDataCity()
    load.hide()
}

onMounted(() => {
    getPaht()
})

</script>

<style scoped >
.address_text {
    /* 设置文本内容的行数 */
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    /* 显示两行 */
    overflow: hidden;
}
</style>
