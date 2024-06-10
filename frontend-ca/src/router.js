import {createRouter, createWebHistory} from "vue-router";
import DeliveryRouteComponent from "@/delivery/delivery-route.component.vue";

const router=createRouter({
    history: createWebHistory(),
    routes:[
        {path:'/', component:DeliveryRouteComponent}
    ]
})

export default router;