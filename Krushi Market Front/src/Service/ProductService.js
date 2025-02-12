import axios from 'axios'
let baseUrl = 'http://localhost:8080/product'
class ProductService {
    constructor(){

    }
    getAllProducts(){
        return axios.get(baseUrl+"/all")
    }
}

export default new ProductService();