<template>
  <div id="map-container">
    <div id="map"></div>
  </div>
</template>

<script>
import L from "leaflet";
import { DeliveryApiService } from "@/services/delivery-api.service.js";

export default {
  data() {
    return {
      locals: [],
      localsOptions: [],
      destinationsOptions: [],
      local: {},
      deliveryApiService: null,
      currentLocal: null,
      selectedDestinations: [],
      map: null,
    };
  },
  created() {
    this.deliveryApiService = new DeliveryApiService();

    // adding data to locals array
    this.deliveryApiService.getLocals().then((response) => {
      this.locals = response.data;
    });

    // adding all locals with odd ID to localsOptions array - impares
    this.deliveryApiService.getLocals().then((response) => {
      this.localsOptions = response.data.filter((local) => local.ID % 2 !== 0);
    });

    // adding all locals with even ID to destinationsOptions array - pares
    this.deliveryApiService.getLocals().then((response) => {
      this.destinationsOptions = response.data.filter((local) => local.ID % 2 === 0);
    });

    // inserting values to currentLocal array - inserting test values
    this.deliveryApiService.getLocals().then((response) => {
      const data = response.data;
      this.localsOptions = data.filter((local) => local.ID % 2 !== 0);
      this.destinationsOptions = data.filter((local) => local.ID % 2 === 0);
      if (this.localsOptions.length > 0) {
        this.currentLocal = this.localsOptions[2];
      }
      if (this.destinationsOptions.length >= 3) {
        this.selectedDestinations = [
          this.destinationsOptions[0],
          this.destinationsOptions[1],
          this.destinationsOptions[3],
          this.destinationsOptions[4],
          this.destinationsOptions[2],
        ];
      }
      this.showMapWithConnectedNodes();
    });
  },
  methods: {
    showMapWithConnectedNodes() {
      if (!this.currentLocal || this.selectedDestinations.length === 0) {
        return;
      }

      // Initialize the map
      this.map = L.map("map").setView([this.currentLocal.latitude, this.currentLocal.longitude], 10);

      // Add OSM tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map);

      // Add custom icon for the current local
      const redIcon = L.icon({
        iconUrl: "https://img.icons8.com/?size=100&id=124191&format=png&color=000000",
        iconSize: [35, 45],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      });

      // Add marker for the current local with custom icon
      L.marker([this.currentLocal.latitude, this.currentLocal.longitude], { icon: redIcon })
          .addTo(this.map)
          .bindPopup(`<b>${this.currentLocal.type}</b><br>${this.currentLocal.address_1}`)
          .openPopup();

      // Add markers for the selected destinations
      this.selectedDestinations.forEach((destination) => {
        L.marker([destination.latitude, destination.longitude])
            .addTo(this.map)
            .bindPopup(`<b>${destination.type}</b><br>${destination.address_1}`);
      });

      // Connect all nodes to each other
      const allNodes = [this.currentLocal, ...this.selectedDestinations];
      for (let i = 0; i < allNodes.length; i++) {
        for (let j = i + 1; j < allNodes.length; j++) {
          const latlngs = [
            [allNodes[i].latitude, allNodes[i].longitude],
            [allNodes[j].latitude, allNodes[j].longitude],
          ];
          L.polyline(latlngs, { color: "black" }).addTo(this.map);
        }
      }
    },

  },

};
</script>

<style>
@import url('https://unpkg.com/leaflet/dist/leaflet.css');

#map-container{
  display: flex;
  justify-content: center;
  align-items: center;
}

#map {
  margin: 100px;
  height: 600px;
  width: 100%;
}
</style>
