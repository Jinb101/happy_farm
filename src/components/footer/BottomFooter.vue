<template>
    <nav>
        <div class="link-bg btn-show"></div>
        <ul>
            <li class=" w-1/3 "
                v-for="(item, index) in menuList"
                :key="index">
                <a :class="index === active ? 'active' : ''"
                   @click.stop="selefMenu(item.key, index)">
                    <i class="fa">
                        <van-icon :name="item.icon" />
                    </i>
                    <span class=" link-text">{{ item.text }}</span>
                </a>
            </li>

        </ul>
    </nav>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeMount, inject } from 'vue'
import { nextTick } from '@vue/runtime-core'
import { useRoute, useRouter } from 'vue-router';
import { useMainStore } from '@/store/index.js'
import { storeToRefs } from 'pinia'


const route = useRoute();
const router = useRouter();
const Tools = inject("Tools");
const wxTools = inject("wxTools");
const mainStor = useMainStore()
const { curActive } = storeToRefs(mainStor)



const active = ref(0);
const menuList = ref([
    {
        key: '/fram',
        text: '云土地',
        icon: 'guide-o',
        imgUrl: '/src/assets/images/tudi.png',
        selfUrl: '/src/assets/images/tudi_s.png',
    },
    {
        key: '/har',
        text: '菜市',
        icon: 'shop-o',
        imgUrl: '/src/assets/images/har.png',
        selfUrl: '/src/assets/images/har_s.png',
    },
    {
        key: '/user',
        text: '我的',
        icon: 'friends-o',
        imgUrl: '/src/assets/images/msg.png',
        selfUrl: '/src/assets/images/msg_s.png',
    },
])

const selefMenu = (i, index) => {
    active.value = index
    curActive.value = index
    // 修改这里
    router.push(i)
}


watch(
    () => route.meta,
    () => {
        nextTick(() => {
            if (active.value !== curActive.value && route.meta.tab) { // 判断是否匹配\
                const bg = document.querySelector('.link-bg');
                const ul = document.querySelector('ul');
                const li = ul.querySelectorAll('li')[curActive.value];
                bg.style.backgroundColor = 'transparent';
                // 使用nextTick确保在下一次DOM更新周期之后执行
                nextTick(() => {
                    const rect = li.getBoundingClientRect();
                    const distance = rect.left - ul.offsetLeft - rect.width / 2 + 40;
                    bg.style.transform = `translate(${distance}px, -50%)`;
                    bg.style.backgroundColor = '#14cd3f8e';
                    active.value = curActive.value; // 匹配则更新active.value
                });
            }
        })
    },
);



const selefApp = () => {
    const links = document.querySelectorAll('a')
    let bg = document.querySelector('.link-bg')
    function setActive(el) {
        links.forEach(link => {
            link.classList.remove('active')
        })
        el.classList.add('active')
    }
    // 遍历所有a便签 绑定事件
    links.forEach((link, index) => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const rect = e.currentTarget.getBoundingClientRect();
            const distance = rect.left - rect.width / 2 + 40;
            bg.style.transform = `translate(${distance}px, -50%)`;
            setActive(e.currentTarget)
        })
    })
}


onMounted(() => {
    selefApp()
})

</script>


<style scoped>
* {
    margin: 0;
    padding: 0;
}

nav {
    position: relative;

}

ul {
    width: 100%;
    list-style-type: none;
    padding: 0;
    display: flex;
    border-radius: 0 0 20px 20px;
    box-shadow: 2px 10px 20px #95989980;
    justify-content: center;
    align-items: center;
}

li {
    width: 30%;
    margin: .6rem 0;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
}

li a {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

li .fa {
    font-size: 22px;
    color: rgb(182, 171, 171);
    transform: translateX(18px);
    transition: .4s ease;
}

li .link-text {
    font-size: 16px;
    color: white;
    position: relative;
    z-index: 1;
    user-select: none;
    opacity: 0;
    transition: .3s ease;
}

li a.active {

    color: white;
}

li a.active .link-text {
    font-size: 13px;
    opacity: 1;
    transition: .1s;
}

li a.active .fa {
    color: rgb(245, 244, 244);
    transform: translateX(0);
}

.link-bg {
    width: 6rem;
    height: 50px;
    background-color: #14cd3f8e;
    border-radius: 18px;
    position: absolute;
    left: 30px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 0;
    transition: 0.4s cubic-bezier(0.77, 0, 0.175, 1);
}
</style>
