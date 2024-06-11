import axios from "axios";

const http = axios.create({
    baseURL:'http://localhost:3000'
})
export class DeliveryApiService {
    async getLocals() {
        return await http.get('/locals');
    }
    async getLocationsByCity(city){
        return await http.get(`/locals?city=${city}`);
    }
}