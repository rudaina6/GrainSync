
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/employees';

export const addEmployee = async (employeeData) => {
    try {
        console.log(employeeData); 
        const response = await axios.post(API_URL, employeeData);
        return response.data;
    } catch (error) {
        console.error("Error adding employee", error);
        throw error;
    }
};