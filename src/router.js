import {createRouter, createWebHistory} from "vue-router";
import DeliveryRouteComponent from "@/delivery/delivery-route.component.vue";
import TestMapComponent from "@/delivery/test-map.component.vue";

const router=createRouter({
    history: createWebHistory(),
    routes:[
        {path:'/', component:TestMapComponent}
    ]
})

export default router;