import axios from 'axios'; //better error handling, better json parsing
import {key} from '../config';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        try {
            const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            if (res.data.error) {
                alert(res.data.error);
            } else {
                this.result = res.data.recipes;
            }            
        } catch (error) {
            alert(error);
        }   
    }
}