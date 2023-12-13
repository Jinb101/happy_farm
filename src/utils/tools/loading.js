import { createApp, reactive } from "vue";
import {
  Toast,
  showToast,
  showSuccessToast,
  showFailToast,
  showLoadingToast,
  closeToast,
  showConfirmDialog,
  setToastDefaultOptions,
  resetToastDefaultOptions,
} from "vant";
import "vant/es/dialog/style";
import "vant/es/toast/style";
import myLoad from "@/components/loading/index.vue";

const msg = reactive({
  show: false,
});

setToastDefaultOptions({ duration: 1500 });

const $loading = createApp(myLoad, { msg }).mount(
  document.createElement("div")
);
const load = {
  show(full) {
    // 控制显示 loading 的方法
    msg.show = true;
    msg.full = full ?? false;
    document.body.appendChild($loading.$el);
  },
  hide() {
    // 控制 loading 隐藏的方法
    msg.show = false;
  },
  info(err) {
    showToast({
      message: err,
    });
  },
  loading(err, de = false) {
    let opt = {
      type: "loading",
      message: err ? err : "",
      forbidClick: true,
      overlay: false,
      duration: de ? 0 : 2000,
    };
    showToast(opt);
  },
  success(err) {
    showToast({
      type: "success",
      message: err ? err : "成功",
    });
  },
  error(err) {
    showToast({
      type: "error",
      message: err ? err : "失败",
    });
  },
  clear() {
    closeToast();
  },
  model(message, fu) {
    showConfirmDialog({
      message: message,
    })
      .then(() => {
        // on confirm
        fu(1);
      })
      .catch(() => {
        // on cancel
        fu(0);
      });
  },
};
export { load };
