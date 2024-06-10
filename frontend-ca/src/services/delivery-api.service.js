import axios from "axios";

const http = axios.create({
    baseURL:'http://localhost:3000'
})
export class DeliveryApiService {
    async getDeliveries() {
        return await http.get('/deliveries');
    }
    async getDeliveryById(id) {
        return await http.get('/deliveries/'+id)
    }
    async createDelivery(body) {
        return await http.post('/deliveries',body)
    }
    async getDeliveriesByArtisan(artisanId) {
        return await http.get(`/deliveries?artisan=${artisanId}`);
    }
}