import { createApp } from "vue";
import App from "./App.vue";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import { OhVueIcon, addIcons } from "oh-vue-icons";
import { FaFlag, RiZhihuFill, IoContrastOutline,RiBlurOffLine,MdBrightnesslowTwotone, BiZoomIn,BiZoomOut,GiSaveArrow,MdInvertcolors,MdDarkmode,GiBlackball,MdRotaterightSharp,MdLayersclearSharp,FaPen} from "oh-vue-icons/icons";

addIcons(FaFlag, RiZhihuFill, IoContrastOutline,RiBlurOffLine,MdBrightnesslowTwotone,BiZoomIn,BiZoomOut,GiSaveArrow,MdInvertcolors,MdDarkmode,GiBlackball,MdRotaterightSharp,MdLayersclearSharp,FaPen);

// const app = createApp(App);
// app.component("v-icon", OhVueIcon);
// app.mount("#app")

createApp(App).use(Antd).component("v-icon", OhVueIcon).mount("#app");
