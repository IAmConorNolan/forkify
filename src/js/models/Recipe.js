import axios from 'axios'; //better error handling, better json parsing
import {key} from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
            if (res.data.error) {
                alert(res.data.error);
            } else {
                this.result = res.data.recipes;
            }            
        } catch (error) {
            alert(error);
        }   
    }

    calcTime () {
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng/3);
        this.time = periods * 15;   // 15 mins for every 3 ingredients
    }

    calcServings() {
        this.servings = 4;
    }

        updateServings(type) {
        //Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;


        //Ingredients  
        this.ingredients.forEach(ing => {
            ing.count = ing.count * (newServings / this.servings);
        });

        this.servings = newServings;

    }

    updateServings(type) {
        //Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;


        //Ingredients  
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        });

        this.servings = newServings;

    }

    parseIngredients() {

        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds', 'pound'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'lb', 'lb'];
        const units = [...unitsShort, 'kg', 'g'];


        const newIngredients = this.ingredients.map(c => {

            //Uniform Units
            let ingredient = c.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });
            
            //Remove Paraenthesis
            ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");

            //Parse to count, unit and ingredient
            const arrIng = ingredient.split(' '); //change to array, with spaces
            const unitIndex = arrIng.findIndex(el => units.includes(el)); // finds the index of where there is a unit.

            let objIng;

            if (unitIndex > -1) { //exists

                const arrCount = arrIng.slice(0, unitIndex); // take portion before the unit i.e 4 1/2 cups = [4, 1/2]
                let count;
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+')); //deals with edge cases where people incorrectly enter 1-1/2 cups to show 1 1/2 cups.
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+')); //returns string "4+1/2" eval() executes the code inside
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' '),
                }

            } else if (parseInt(arrIng[0], 10)) { //no unit, but first is number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' '),
                }

            } else if (unitIndex === -1) { //no unit, no number
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }


            //return
            return objIng; //must return so something is mapped to array.
        });
        this.ingredients = newIngredients;
    }
}