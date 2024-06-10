import './assets/main.css'

import { createApp } from 'vue'
import PrimeVue from 'primevue/config';
import App from './App.vue';
import router from './router';

import 'primevue/resources/themes/lara-light-pink/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

import Card from 'primevue/card';
import Button from 'primevue/button';
import SelectButton from 'primevue/selectbutton';
import Sidebar from 'primevue/sidebar';
import Avatar from 'primevue/avatar';
import Menu from 'primevue/menu';
import Menubar from 'primevue/menubar';
import Toolbar from 'primevue/toolbar';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Steps from 'primevue/steps';
import InputText from 'primevue/inputtext';
import Divider from 'primevue/divider';
import Calendar from 'primevue/calendar';
import Rating from 'primevue/rating';
import InputNumber from 'primevue/inputnumber';
import InputMask from 'primevue/inputmask';
import Message from 'primevue/message';
import ButtonGroup from 'primevue/buttongroup';
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';

createApp(App)
    .use(router)
    .use(PrimeVue, { ripple: true })
    .component('PvCard', Card)
    .component('PvButton', Button)
    .component('PvSelectButton', SelectButton)
    .component('PvSidebar', Sidebar)
    .component('PvAvatar', Avatar)
    .component('PvMenu', Menu)
    .component('PvMenubar', Menubar)
    .component('PvToolbar', Toolbar)
    .component('PvDataTable', DataTable)
    .component('PvColumn', Column)
    .component('PvSteps', Steps)
    .component('PvInputText', InputText)
    .component('PvDivider', Divider)
    .component('PvCalendar', Calendar)
    .component('PvRating', Rating)
    .component('PvInputNumber', InputNumber)
    .component('PvInputMask', InputMask)
    .component('PvMessage', Message)
    .component('PvButtonGroup', ButtonGroup)
    .component('PvIconField', IconField)
    .component('PvInputIcon', InputIcon)
    .component('PvTextarea', Textarea)
    .component('PvDropdown', Dropdown)
    .mount('#app')
