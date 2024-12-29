import axios from "axios";
import { BASE_URL } from "../utils/constant";

export class UserServices {

    static async getUsers() {
        const response = await axios.get(`${BASE_URL}api/Users`);
        console.log("user response", response.data);
        return response.data.$values;
    }

}