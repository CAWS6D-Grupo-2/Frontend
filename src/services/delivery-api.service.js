import axios from "axios";

const http = axios.create({
    baseURL:'https://api.npoint.io/bf7e711b211cf4105574'
})
export class DeliveryApiService {
    async getLocals() {
        return await http.get('/locals');
    }
    async getLocationsByCity(city){
        return await http.get(`/locals?city=${city}`);
    }
}