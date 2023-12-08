import { createApp, reactive } from "vue";
import {
  showToast,
  showSuccessToast,
  showFailToast,
  showLoadingToast,
  closeToast,
  showConfirmDialog,
  showDialog,
} from "vant";
import "vant/es/dialog/style";
import "vant/es/toast/style";
import myLoad from "@/components/loading/index.vue";

const msg = reactive({
  show: false,
});

const $loading = createApp(myLoad, { msg }).mount(
  document.createElement("div")
);
const load = {
  show(full) {
    // 控制显示loading的方法
    msg.show = true;
    msg.full = full ?? false;
    document.body.appendChild($loading.$el);
  },

  hide() {
    // 控制loading隐藏的方法
    msg.show = false;
  },
  info(err) {
    showToast({
      message: err,
    });
  },
  loading(err, de) {
    let opt = {
      type: "loading",
      message: err ? err : "",
      forbidClick: true,
      overlay: false,
    };
    if (de) {
      opt.duration = 0;
    }
    showToast(opt);
  },
  success(err) {
    showSuccessToast({
      message: err ? err : "成功",
      wordBreak: "break-all",
      duration: 2000,
    });
  },
  error(err) {
    showFailToast(err ? err : "失败");
  },
  clear() {
    closeToast();
    // Toast.clear();
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
