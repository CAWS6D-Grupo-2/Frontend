<script setup>
import { ref } from 'vue';
import TheToolbar from "/public/the-toolbar.component.vue";

const selectedCity = ref();
const groupedCities = ref([
  {
    label: 'New York',
    code: 'NY',
    items: [
      { label: 'Bronx', value: 'Bronx' },
      { label: 'city', value: 'city' },
      { label: 'city', value: 'city' }
    ]
  },
  {
    label: 'Florida',
    code: 'FL',
    items: [
      { label: 'city', value: 'city' },
      { label: 'city', value: 'city' },
      { label: 'city', value: 'city' }
    ]
  },
  {
    label: 'Texas',
    code: 'TX',
    items: [
      { label: 'city', value: 'city' },
      { label: 'city', value: 'city' },
      { label: 'city', value: 'city' }
    ]
  }
]);
</script>

<template>
  <TheToolbar/>

  <div class="delivery-route-container">
    <h2>Selecciona una ciudad</h2>
    <div class="dropdown-container">
      <pv-dropdown v-model="selectedCity" :options="groupedCities" optionLabel="label" optionGroupLabel="label" optionGroupChildren="items"
                   placeholder="Select a City" class="w-full md:w-14rem" @click="handleCitySelect">
        <template #optiongroup="slotProps">
          <div class="flex align-items-center">
            <img src="/src/assets/images/usa-flag.png" style="width: 20px; margin-right: 1rem;" />
            <div style="color: #3CA89A;">{{ slotProps.option.label }}</div>
          </div>
        </template>
      </pv-dropdown>
    </div>

    <PvCard class="card">
      <template #header>
        <h3 class="card-header">Selecciona un Restaurante</h3>
      </template>
      <template #content>
        <div class="select-restaurant-container">
          <i class="pi pi-face-smile"/><h3>Local:</h3><br>
          <i class="pi pi-face-smile"/><h3>Destino:</h3>
          <pv-button class="btn" label="D1"/>
          <pv-button class="btn" label="D2"/>
          <pv-button class="btn" label="D3"/><br>
          <i class="pi pi-face-smile"/><h3>Ciudad:</h3>
        </div>
      </template>
    </PvCard>


  </div>

</template>

<script>
import {DeliveryApiService} from "@/services/delivery-api.service.js";

export default {
  name: 'delivery-route',
  data(){
    return{
      states:[],
      cities:[],
      restaurants:[],
      destinations:[],
      deliveryApiService: new DeliveryApiService()
    }
  },
  async mounted(){
    await this.refresh();
  },
  methods:{
    async refresh(){
      /*const responseStates = await this.deliveryApiService.getStates();
      this.states = responseStates.data;
      const responseCities = await this.deliveryApiService.getCities();
      this.cities = responseCities.data;*/
      const responseRestaurants = await this.deliveryApiService.getLocals();
      this.restaurants = responseRestaurants.data;
    }
  }
}
</script>

<style scoped>
.delivery-route-container{
  display: flex;
  flex-direction: column;
  margin: 3rem;
}
.dropdown-container {
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
}
.card-header{
  margin: 2rem 2rem 0;
}
.select-restaurant-container{
  margin-top: 1rem;
}
.select-restaurant-container h3{
  display: inline;
}
.select-restaurant-container i{
  font-size: 1.5rem;
  color: #3CA89A;
  margin: 1rem;
}
.btn{
  margin-left: 1rem;
  background-color: #3CA89A;
  border: 0;
}
</style>