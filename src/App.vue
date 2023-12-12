<script setup>
import './style.css'
import { defineAsyncComponent, inject, onMounted } from 'vue';
import { RouterView } from 'vue-router';
import Loading from '@/components/loading/index.vue'

const AsyncRouterView = defineAsyncComponent(() => import('vue-router').then(m => m.RouterView));

const http = inject("http");
const Tools = inject("Tools");
const wxTools = inject("wxTools");



onMounted(() => {
    // 配置支付信息
    // wxTools.initWxConfig()
})


</script>

<template>
    <div id="app">
        <transition>
            <shell>
                <Loading />
                <AsyncRouterView>

                </AsyncRouterView>

            </shell>
        </transition>
    </div>
</template>

<style ></style>
