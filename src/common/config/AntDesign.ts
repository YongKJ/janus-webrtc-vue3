import {App} from "vue";
import {
    Row,
    Col,
    Form,
    Input,
    Button,
    Upload,
} from "ant-design-vue";

export const AntDesign = {
    install(Vue: App) {
        Vue.component(Row.name, Row);
        Vue.component(Col.name, Col);

        Vue.component(Form.name, Form);
        Vue.component(Input.name, Input);
        Vue.component(Button.name, Button);
        Vue.component(Upload.name, Upload);
    }
}