<template>
    <div class=" h-full w-full relative">

        <div class="bg-[#14cd3f79] flex justify-between items-start pt-6 px-4 h-[30%] ">
            <div style="box-shadow: 0 3.2px 12px #00000014, 0 5px 25px #0000000a"
                 class=" bg-white flex justify-start items-center w-[40%] rounded-xl  px-3 py-3 mt-4">
                <van-image round
                           width="3rem"
                           height="3rem"
                           src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg" />
                <div class=" flex flex-col justify-between items-start ml-4 h-[4rem] text-sm">
                    <div>王大锤</div>
                    <div>农民</div>
                </div>
            </div>
            <div class="mt-4 h-full flex justify-center items-start py-6">
                <van-icon name="exchange"
                          size="2rem"
                          color="white" />
            </div>
            <div style="box-shadow: 0 3.2px 12px #00000014, 0 5px 25px #0000000a"
                 class=" bg-white flex justify-start items-center w-[40%] rounded-xl px-3 py-3 mt-4">
                <van-image round
                           width="3rem"
                           height="3rem"
                           src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg" />
                <div class=" flex flex-col justify-between items-start ml-4 h-[4rem] text-sm">
                    <div>王小锤</div>
                    <div>地主</div>
                </div>
            </div>

        </div>

        <div class="h-[75%] rounded-t-2xl absolute bottom-[1%] left-0 right-0  bg-white pt-12">
            <van-cell-group>
                <van-cell title="个人地址"
                          title-style="text-align:left"
                          is-link />
                <van-cell title="家庭管理"
                          title-style="text-align:left"
                          is-link />

                <!-- <van-cell title="我的地址"
                          value="内容"
                          label="描述信息"
                          title-style="text-align:left"
                          is-link /> -->
            </van-cell-group>
        </div>
    </div>
</template>

<script setup>
</script>

<style scoped ></style>
