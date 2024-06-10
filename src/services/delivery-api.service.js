import axios from "axios";

const http = axios.create({
    baseURL:'http://localhost:3000'
})
export class DeliveryApiService {
    async getLocals(){
        return await http.get('/locals');
    }
    /*async getStates() {
        return await http.get('/states');
    }
    async getCities() {
        return await http.get('/cities');
    }
    async getCitiesByState(stateId) {
        return await http.get(`/cities?state=${stateId}`);
    }
    async getRestaurants() {
        return await http.get('/restaurants');
    }
    async getRestaurantByCity(cityId) {
        return await http.get(`/restaurants?city=${cityId}`)
    }
    async createRoute(body) {
        return await http.post('/routes',body)
    }*/

}