<template>
    <div class="h-full w-full overflow-hidden relative"
         ref="rendererContainer"
         id="tree-container"
         style="touch-action: none;">
        <div @click.stop="getMyFarm"
             class="absolute right-0 top-8 w-10  rounded-l-2xl flex justify-end items-center "
             style="box-shadow: 0 3.2px 12px #00000014, 0 5px 25px #0000000a">
            <img src="../../assets/images/rem.png"
                 alt=""
                 srcset="">
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch, inject } from 'vue';
import { useMainStore } from '@/store/index.js'
import { storeToRefs } from 'pinia'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as THREE from 'three';
import Hammer from 'hammerjs';

let rendererContainer;
let scene;
let camera;
let renderer;
let fbxLoader;
let controls;
let modelLoaded = ref(false);

const http = inject("http")
const load = inject("load")
const mainStor = useMainStore()
const { curFarmPlot } = storeToRefs(mainStor)


const emit = defineEmits(['masDeta'])



// 获取地块详情
const getMyFarm = async () => {
    load.loading('', true)
    const { data } = await http.post('masDeta', {
        farm_plot_id: curFarmPlot.value.farm_plot_id
    })
    emit('masDeta', data)
}



// 监听模型加载完成事件
watch(modelLoaded, (value) => {
    if (value) {
        // 在这里可以调用动画函数来实现在指定时间内转换到指定的视角坐标
        // 例如：animateToPosition(new THREE.Vector3(x, y, z), duration);

        // 示例：在 2 秒内转换到指定的视角坐标
        // animateToPosition(new THREE.Vector3(-3, 180, -630), 2000, new THREE.Euler(0, Math.PI / 2, 0));
        animateToPosition(new THREE.Vector3(-490, 230, -560), 2000, new THREE.Euler(0, Math.PI, 0));
    }
});

// 动画函数
const animate = () => {
    requestAnimationFrame(animate);

    // 更新控件
    controls.update();
    // 遍历场景中的模型，逐渐增加透明度
    scene.traverse((object) => {
        if (object.userData.className === 'model') {
            object.traverse((child) => {
                if (child.isMesh) {
                    child.material.opacity += 0.01; // 每帧增加透明度
                    if (child.material.opacity > 1) {
                        child.material.opacity = 1; // 限制透明度最大值为 1
                    }
                }
            });
        }
    });
    // 启用渲染阴影
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap // THREE.PCFShadowMap (default)
    // renderer.physicallyCorrectLights = true 	//正确的物理灯光照射
    // renderer.outputEncoding = THREE.sRGBEncoding	//采用 sRGBEncoding
    renderer.toneMapping = THREE.ACESFilmicToneMapping  //aces 标准
    renderer.toneMappingExposure = 1.1		//色调映射曝光度
    renderer.shadowMap.enabled = true	//阴影就不用说了
    renderer.shadowMap.type = THREE.PCFSoftShadowMap //阴影类型（处理运用 Shadow Map 产生的阴影锯齿）
    renderer.render(scene, camera);
};

onMounted(() => {
    // 创建场景
    scene = new THREE.Scene();

    // 创建相机
    const aspectRatio = rendererContainer.clientWidth / rendererContainer.clientHeight;
    camera = new THREE.PerspectiveCamera(50, aspectRatio, 0.1, 1000); // 修改 fov 值
    camera.position.set(0, 650, 0); // 设置相机位置

    // 创建渲染器
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(rendererContainer.clientWidth, rendererContainer.clientHeight);
    rendererContainer.appendChild(renderer.domElement);

    // 创建光源
    const ambientLight = new THREE.AmbientLight(0xffffff, 30); // 环境光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 30); // 方向光
    const pointLight = new THREE.PointLight(0xffffff, 30); // 点光源

    directionalLight.position.set(10, 10, 10);
    directionalLight.castShadow = true
    pointLight.position.set(0, 10, 0); // 设置光源位置
    directionalLight.shadow.mapSize.height = 512 * 2
    directionalLight.shadow.mapSize.width = 512 * 2
    // 0.00 <---> 0.05 最好的区间
    directionalLight.shadow.bias = 0.05 // 平面
    directionalLight.shadow.normalBias = 0.05 // 圆形表面，缩小受影响的网格，使其不会在自身上投射阴影
    pointLight.castShadow = true

    pointLight.shadow.mapSize.height = 512 * 2
    pointLight.shadow.mapSize.width = 512 * 2

    pointLight.shadow.camera.near = 0.1
    pointLight.shadow.camera.far = 5

    scene.add(ambientLight, directionalLight, pointLight);

    // 创建 FBXLoader
    fbxLoader = new FBXLoader();

    // 加载本地的 FBX 模型
    const fbxPath = '/model/model.fbx';
    fbxLoader.load(
        fbxPath,
        (fbx) => {
            console.log("模型加载成功", fbx);
            fbx.scale.set(.1, .1, .1);
            fbx.traverse(function (item) {
                if (item instanceof THREE.Mesh) {
                    item.castShadow = true;
                    item.receiveShadow = true;
                }
            });
            // 将加载的模型添加到场景中

            // 在这里可以设置模型的位置、旋转等属性
            // fbx.rotation.x = Math.PI / 2;

            // 获取模型的包围盒
            const boundingBox = new THREE.Box3().setFromObject(fbx);

            // 计算模型的中心点坐标
            const center = new THREE.Vector3();
            boundingBox.getCenter(center);

            // 将模型平移到页面中心
            fbx.position.sub(center);

            // 将模型向上移动一定距离
            fbx.position.y += 75; // 可根据需要调整移动的距离
            modelLoaded.value = true; // 标记模型已加载
            scene.add(fbx);
        },
        undefined,
        (error) => {
            console.error("模型加载失败", error);
        }
    );

    // 创建控件
    controls = new OrbitControls(camera, renderer.domElement);

    // 设置控件属性
    controls.enableDamping = true; // 启用阻尼效果
    controls.dampingFactor = 0.05; // 阻尼系数
    // 监听相机位置变化
    // controls.addEventListener('change', () => {
    //     const currentPosition = camera.position.clone();
    //     console.log("当前坐标:", currentPosition);
    // });

    const hammer = new Hammer(rendererContainer);
    hammer.get('pinch').set({ enable: true });

    hammer.on('pinch', (event) => {
        const scale = event.scale;
        camera.zoom = scale; // 调整相机的缩放比例
        camera.updateProjectionMatrix();
    });

    animate();
});

// 动画函数：在指定时间内转换到指定的视角坐标
const animateToPosition = (position, duration) => {
    const startPosition = camera.position.clone();
    const startTime = Date.now();

    const updateCameraPosition = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const newPosition = new THREE.Vector3().lerpVectors(startPosition, position, progress);
        camera.position.copy(newPosition);
        if (progress < 1) {
            requestAnimationFrame(updateCameraPosition);
        }
    };

    updateCameraPosition();
};
</script>

<style scoped>
.model {
    opacity: 0;
    /* 初始透明度为 0 */
    transition: opacity .3s;
    /* 添加过渡效果，持续 1 秒 */
}

#tree-container {
    /* background-color: #f0f0f025; */
    /* 设置背景色为灰色 */
}
</style>
