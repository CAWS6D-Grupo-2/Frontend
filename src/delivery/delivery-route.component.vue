<script setup>
import { ref } from 'vue';
import TheToolbar from "/public/the-toolbar.component.vue";

const selectedCity = ref();
const selectedLocation = ref();
const selectedDestination = ref();
</script>

<template>
  <TheToolbar/>

  <div class="delivery-route-container">
    <div class="dropdown-container">
      <pv-dropdown v-model="selectedCity" :options="cities" filter optionLabel="name" placeholder="Select a City"
                     class="w-full md:w-14rem" @change="handleCitySelect(selectedCity.name)">
        <template #value="slotProps">
          <div v-if="slotProps.value" class="flex align-items-center">
            <div>{{ slotProps.value.name }}</div>
          </div>
          <span v-else>
            {{ slotProps.placeholder }}
          </span>
        </template>
        <template #option="slotProps">
          <div class="flex align-items-center">
            <div>{{ slotProps.option.name }}</div>
          </div>
        </template>
      </pv-dropdown>

      <pv-dropdown v-model="selectedLocation" :options="locations" filter optionLabel="name" placeholder="Select a Location"
                   class="w-full md:w-14rem" @change="handleLocationSelect(selectedLocation.name)">
        <template #value="slotProps">
          <div v-if="slotProps.value" class="flex align-items-center">
            <div>{{ slotProps.value.name }}</div>
          </div>
          <span v-else>
            {{ slotProps.placeholder }}
          </span>
        </template>
        <template #option="slotProps">
          <div class="flex align-items-center">
            <div>{{ slotProps.option.name }}</div>
          </div>
        </template>
      </pv-dropdown>

      <pv-dropdown v-model="selectedDestination" :options="destinations" filter optionLabel="name" placeholder="Select a Destination"
                   class="w-full md:w-14rem" @change="handleDestinationSelect(selectedDestination.name)">
        <template #value="slotProps">
          <div v-if="slotProps.value" class="flex align-items-center">
            <div>{{ slotProps.value.name }}</div>
          </div>
          <span v-else>
            {{ slotProps.placeholder }}
          </span>
        </template>
        <template #option="slotProps">
          <div class="flex align-items-center">
            <div>{{ slotProps.option.name }}</div>
          </div>
        </template>
      </pv-dropdown>

      <pv-button class="btn" icon="pi pi-trash" rounded @click="clearSelections()"/>
    </div>

    <div class="data-container">
      <pv-card class="card">
        <template #header>
          <h3 class="card-header">Datos seleccionados:</h3>
        </template>
        <template #content>
          <div class="select-restaurant-container">
            <i class="pi pi-face-smile"/><h3>Local: </h3><pv-chip :label="`${locationSelected}`" /><br>
            <i class="pi pi-face-smile"/><h3>Destino: </h3><pv-chip :label="`${destinationsSelected}`" /><br>
            <i class="pi pi-face-smile"/><h3>Ciudad: </h3><pv-chip :label="`${citySelected}`" />
          </div>
        </template>
      </pv-card>

      <pv-card class="card">
        <template #header>
          <h3 class="card-header">Destinos:</h3>
        </template>
        <template #content>
          <div class="map-container">
            <img src="/src/assets/images/placeholder.png" alt="Map" style="display: block; margin: 1rem auto 0; border-radius: 20px; width:75%;"/>
          </div>
        </template>
      </pv-card>

      <div class="btn-container">
        <pv-chip style="color: red;" label="Nodo Origen"/>
        <pv-chip style="color: blue;" label="Destinos"/>
        <pv-button class="btn" label="Calcular" @click="calculate()"/>
      </div>

      <pv-card v-if="optimizedRoute" class="card" :hidden="false">
        <template #header>
          <h3 class="card-header">Ruta Optimizada:</h3>
        </template>
        <template #content>
          <div class="map-container">
            <img src="/src/assets/images/placeholder.png" alt="Map" style="display: block; margin: 1rem auto 0; border-radius: 20px; width:75%;"/>
          </div>
        </template>
        <template #footer>
          <h3>Tiempo Estimado: {{ estimatedRouteTime }} minutos</h3>
        </template>
      </pv-card>
    </div>

  </div>
</template>

<script>
import { DeliveryApiService } from "@/services/delivery-api.service.js";

export default {
  name: 'delivery-route',
  data() {
    return {
      cities: [],
      locations: [],
      destinations: [],
      citySelected: '',
      locationSelected: '',
      destinationsSelected: [],
      estimatedRouteTime: '',
      optimizedRoute: false,
      deliveryApiService: new DeliveryApiService()
    };
  },
  async mounted() {
    await this.refresh();
  },
  methods: {
    async refresh() {
      await this.getCities();
    },
    async getCities() {
      try {
        const response = await this.deliveryApiService.getLocals();
        this.cities = response.data.map(local => ({
          name: local.city,
          code: local.state
        })).filter((value, index, self) =>
            self.findIndex(v => v.name === value.name) === index
        );
      } catch (error) {
        console.error(error);
      }
    },
    async getLocations(city) {
      try {
        const response = await this.deliveryApiService.getLocationsByCity(city);
        this.locations = response.data
            .filter(local => local.ID % 2 !== 0 && local.city === city)
            .map(local => ({
              name: local.ID + " " + local.type,
              code: local.postal_code
            }))
            .filter((value, index, self) =>
                self.findIndex(v => v.name === value.name) === index
            );
      } catch (error) {
        console.error(error);
      }
    },
    async getDestinations(city) {
      try {
        const response = await this.deliveryApiService.getLocationsByCity(city);
        this.destinations = response.data
            .filter(local => local.ID % 2 === 0 && local.city === city)
            .map(local => ({
              name: local.ID + " " + local.address_1 + " ",
              code: local.postal_code
            }))
            .filter((value, index, self) =>
                self.findIndex(v => v.name === value.name) === index
            );
      } catch (error) {
        console.error(error);
      }
    },
    async handleCitySelect(selectedCity) {
      this.citySelected = selectedCity;
      await this.getLocations(selectedCity);
      await this.getDestinations(selectedCity);
    },
    async handleLocationSelect(selectedLocation) {
      this.locationSelected = selectedLocation;
    },
    async handleDestinationSelect(selectedDestination) {
      this.destinationsSelected.push(selectedDestination);
    },
    async clearSelections() {
      window.location.reload();
    },
    async calculate(){
      if(this.locationSelected === '' || this.destinationsSelected.length === 0){
        alert('Por favor seleccione un local y al menos un destino');
        return;
      }else{
        this.optimizedRoute = true;
      }
    }
  }
};
</script>

<style scoped>
.delivery-route-container {
  margin: 3rem;
}
.dropdown-container {
  display: flex;
  flex-direction: row;
  gap: 2rem;
  justify-content: center;
  margin-bottom: 3rem;
}
.data-container{
  display: flex;
  flex-direction: column;
  align-items: center;
}
.btn-container{
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 3rem;
}
.card{
  width: 100vh;
  margin-bottom: 3rem;
}
.card-header {
  padding-top: 2rem;
  margin-left: 2rem;
}
.select-restaurant-container {
  margin-top: 1rem;
}
.select-restaurant-container h3 {
  display: inline;
}
.select-restaurant-container i {
  font-size: 1.5rem;
  color: #3CA89A;
  margin: 1rem;
}

</style>
