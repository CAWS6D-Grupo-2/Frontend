<script setup>
import {ref} from 'vue';
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

      <pv-button class="btn" icon="pi pi-trash" severity="danger" outlined rounded @click="clearSelections()"/>
    </div>

    <div class="data-container">
      <pv-card class="card">
        <template #header>
          <h3 class="card-header">Datos seleccionados:</h3>
        </template>
        <template #content>
          <div class="select-restaurant-container">
            <i class="pi pi-map-marker"/><h3>Local: </h3><pv-chip :label="`${locationSelected}`" /><br>
            <i class="pi pi-home"/><h3>Destinos: </h3><pv-chip :label="`${destinationsSelected}`" /><br>
            <i class="pi pi-building"/><h3>Ciudad: </h3><pv-chip :label="`${citySelected}`" />
          </div>
          <pv-button class="font-semibold ml-3" severity="help" outlined @click="showMapWithConnectedNodes(locationSelected,destinationsSelected)">Generar mapa</pv-button>
        </template>
      </pv-card>

      <pv-card class="card">
        <template #header>
          <h3 class="card-header">Mapa de destinos</h3>
        </template>
        <template #content>
          <div id="map-container">
            <div id="map"></div>
          </div>
        </template>
      </pv-card>

      <div class="btn-container">
        <pv-chip class="py-0 pl-0 pr-3">
          <span class="bg-red-600 border-circle w-3rem h-3rem flex align-items-center justify-content-center" style="color:white;">L</span>
          <span class="ml-2 font-semibold">Local</span>
        </pv-chip>
        <pv-chip class="py-0 pl-0 pr-3">
          <span class="bg-blue-500 border-circle w-3rem h-3rem flex align-items-center justify-content-center" style="color:white;">D</span>
          <span class="ml-2 font-semibold">Destinos</span>
        </pv-chip>
        <pv-button severity="help" outlined @click="optimizeRouteInMap()">
         Calcular ruta</pv-button>
      </div>

      <pv-card  class="card" >
        <template #header>
          <h3 class="card-header">Ruta Optimizada:</h3>
        </template>
        <template #content>
          <div id="map-container">
            <div id="map-optimized"></div>
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
import L from 'leaflet';

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
      currentLocal: null,
      destinationsDataForMap: [],
      estimatedRouteTime: '',
      showOptimizedRoute: false,
      deliveryApiService: new DeliveryApiService(),
      map: null,
      mapOptimized: null
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
      console.log(this.citySelected)
    },
    async handleLocationSelect(selectedLocation) {
      this.locationSelected = selectedLocation;
      console.log(this.locationSelected)
    },
    async handleDestinationSelect(selectedDestination) {
      this.destinationsSelected.push(selectedDestination);
    },

    async clearSelections() {
      window.location.reload();
    },
    async showMapWithConnectedNodes(locationSelected, destinationsSelected) {

      console.log(locationSelected, destinationsSelected);
      let locationSelectedId = locationSelected.split(" ")[0];
      let destinationsSelectedIds = destinationsSelected.map(destination => destination.split(" ")[0]);

      try {
        const response = await this.deliveryApiService.getLocals();
        const localsData = response.data || [];

        this.currentLocal = localsData.find(local => local.ID == locationSelectedId);
        this.destinationsDataForMap = localsData.filter(local => destinationsSelectedIds.includes(local.ID.toString()));

        if (!this.currentLocal || this.destinationsDataForMap.length === 0) {
          console.error('No se encontraron datos para los IDs proporcionados');
          return;
        }

        // Initialize the map
        if (this.map) {
          this.map.remove();
        }
        this.map = L.map("map").setView([this.currentLocal.latitude, this.currentLocal.longitude], 11);

        // Add OSM tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(this.map);

        // Add custom icon for the current local
        const redIcon = L.icon({
          iconUrl: "https://maps.gstatic.com/intl/en_us/mapfiles/marker.png",
          iconSize: [30, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        });

        // Add marker for the current local with custom icon
        L.marker([this.currentLocal.latitude, this.currentLocal.longitude], {icon: redIcon})
            .addTo(this.map)
            .bindPopup(`<b>${this.currentLocal.type}</b><br>${this.currentLocal.address_1}`)
            .openPopup();

        // Add markers for the selected destinations
        this.destinationsDataForMap.forEach((destination) => {
          L.marker([destination.latitude, destination.longitude])
              .addTo(this.map)
              .bindPopup(`<b>Client</b><br>${destination.address_1}`);
        });

        // Connect all nodes to each other
        const allNodes = [this.currentLocal, ...this.destinationsDataForMap];
        for (let i = 0; i < allNodes.length; i++) {
          for (let j = i + 1; j < allNodes.length; j++) {
            const latlngs = [
              [allNodes[i].latitude, allNodes[i].longitude],
              [allNodes[j].latitude, allNodes[j].longitude],
            ];
            L.polyline(latlngs, {color: "blue"}).addTo(this.map);
          }
        }
      } catch (error) {
        console.error('Error al obtener los datos de los locales:', error);
      }

    },
    calculateDistance(lat1, lon1, lat2, lon2) {
      const toRad = (value) => (value * Math.PI) / 180;
      const R = 6371; // Radius of the Earth in km
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    },
    optimizeRouteInMap() {
      let velocity = 30; // velocity estimated to 30 km/h
      if (!this.currentLocal || this.destinationsDataForMap.length === 0) {
        return;
      }

      // Create an array of edges with weights
      const edges = [];
      const allNodes = [this.currentLocal, ...this.destinationsDataForMap];
      for (let i = 0; i < allNodes.length; i++) {
        for (let j = i + 1; j < allNodes.length; j++) {
          const distance = this.calculateDistance(
              allNodes[i].latitude, allNodes[i].longitude,
              allNodes[j].latitude, allNodes[j].longitude
          );
          edges.push([distance, i, j]);
        }
      }

      // Kruskal's algorithm to find MST
      edges.sort((a, b) => a[0] - b[0]);

      const parent = Array(allNodes.length).fill().map((_, index) => index);

      const find = (i) => {
        if (parent[i] === i) return i;
        return parent[i] = find(parent[i]);
      };

      const union = (i, j) => {
        const rootI = find(i);
        const rootJ = find(j);
        if (rootI !== rootJ) parent[rootI] = rootJ;
      };

      const mst = [];
      let totalDistance = 0;
      for (let [distance, i, j] of edges) {
        if (find(i) !== find(j)) {
          union(i, j);
          mst.push([i, j]);
          totalDistance += distance;
        }
      }

      // Display the optimized route on the map
      if (this.mapOptimized) {
        this.mapOptimized.remove();
      }
      this.mapOptimized = L.map("map-optimized").setView([this.currentLocal.latitude, this.currentLocal.longitude], 11);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.mapOptimized);

      // Add markers again
      const redIcon = L.icon({
        iconUrl: "https://maps.gstatic.com/intl/en_us/mapfiles/marker.png",
        iconSize: [30, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      });

      L.marker([this.currentLocal.latitude, this.currentLocal.longitude], {icon: redIcon})
          .addTo(this.mapOptimized)
          .bindPopup(`<b>${this.currentLocal.type}</b><br>${this.currentLocal.address_1}`)
          .openPopup();

      this.destinationsDataForMap.forEach((destination) => {
        L.marker([destination.latitude, destination.longitude])
            .addTo(this.mapOptimized)
            .bindPopup(`<b>Client</b><br>${destination.address_1}`);
      });

      // Draw the MST
      mst.forEach(([i, j]) => {
        const latlngs = [
          [allNodes[i].latitude, allNodes[i].longitude],
          [allNodes[j].latitude, allNodes[j].longitude],
        ];
        L.polyline(latlngs, {color: "green"}).addTo(this.mapOptimized);
      });

      const averageSpeedKmH = 30;
      const estimatedTimeMinutes = (totalDistance / averageSpeedKmH) * 60;
      this.estimatedRouteTime = estimatedTimeMinutes.toFixed(2) + ' minutos';

      this.showOptimizedRoute = true;
    },
  }
};
</script>

<style>

@import url('https://unpkg.com/leaflet/dist/leaflet.css');

#map-container{
  display: flex;
  justify-content: center;
  align-items: center;
}

#map, #map-optimized {
  height: 400px;
  width: 100%;
}

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
