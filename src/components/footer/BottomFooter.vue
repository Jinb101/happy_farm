<template>
    <div>
        <nav>
            <div class="link-bg"></div>
            <ul>
                <li class=" w-1/3"
                    v-for="(item, index) in menuList"
                    :key="index">
                    <a class="active"
                       @click.stop="selefMenu(item.key, index)">
                        <img :class="'fram fa '"
                             :src="item.imgUrl"
                             alt=""
                             srcset="">
                        <span class=" link-text">{{ item.text }}</span>
                    </a>
                </li>

            </ul>
        </nav>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { nextTick } from '@vue/runtime-core'
import { useRoute, useRouter } from 'vue-router';


const route = useRoute();
const router = useRouter();

const active = ref(0);
const menuList = ref([
    {
        key: '/fram',
        text: '云土地',
        imgUrl: '/src/assets/images/tudi.png',
        selfUrl: '/src/assets/images/tudi_s.png',
    },
    {
        key: '/har',
        text: '菜市',
        imgUrl: '/src/assets/images/har.png',
        selfUrl: '/src/assets/images/har_s.png',
    },
    {
        key: '/user',
        text: '我的',
        imgUrl: '/src/assets/images/msg.png',
        selfUrl: '/src/assets/images/msg_s.png',
    },
])


watch(
    () => route.meta,
    () => {
        nextTick(() => {
            if (`/${menuList.value[active.value]}` !== `/${route.meta.name}`) { // 判断是否匹配
                // 遍历menuList数组
                for (let i = 0; i < menuList.value.length; i++) {
                    const item = menuList.value[i];
                    if (`${item.key}` === `/${route.meta.name}`) { // 判断是否匹配
                        active.value = i; // 匹配则更新active.value
                        // 根据active的值计算link-bg的位置
                        const links = document.querySelectorAll('a');
                        const bg = document.querySelector('.link-bg');
                        const rect = links[active.value].getBoundingClientRect();
                        const distance = rect.left - rect.width / 2 + 40;
                        bg.style.transform = `translate(${distance}px, -50%)`;
                        break; // 找到第一个匹配项后退出循环
                    }
                }
            }

        });
    },
    { immediate: true }
);


const selefMenu = (i, index) => {
    active.value = index
    // 修改这里
    console.log(i);
    nextTick(() => {
        router.push(i)
    })
}

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
nav {
    position: relative;
}

ul {
    width: 100%;
    list-style-type: none;
    padding: 0;
    /* background-color: #2193b0; */
    display: flex;
    border-radius: 0 0 20px 20px;
    box-shadow: 2px 10px 20px #95989980
}

li {
    height: 50px;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 15px 8px;
}

li:first-child {
    margin-left: 15px;
}

li:last-child {
    margin-right: 15px;
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
    width: 22px;
    height: 22px;
    color: #6dd5ed;
    transform: translateX(30px);
    transition: .4s ease;
}

li .link-text {
    color: white;
    margin-left: 8px;
    position: relative;
    z-index: 1;
    user-select: none;
    opacity: 0;
    transition: .3s ease;
}

li a.active {
    color: white;
}

li a.active .fa {
    color: white;
    transform: translateX(0);
}

li a.active .link-text {
    opacity: 1;
    transition: .1s;
}

.link-bg {
    width: 90px;
    height: 50px;
    background-color: #14cd3f8e;
    border-radius: 18px;
    position: absolute;
    left: 25px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 0;
    transition: 0.4s cubic-bezier(0.77, 0, 0.175, 1);
}
</style>
