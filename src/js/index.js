// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import {elements, renderLoader, clearLoader} from './views/base';
import lottie from 'lottie-web';

/**
 * Global State
 * Search Object
 * Current Recipe Object
 * Shopping List Object
 * Liked Recipes
 */

const state = {}; 
window.state = state;

const controlSearch = async () => {
    //Get Query from View
    const query = searchView.getInput(); 
    console.log(query);

    if (query) {
        //New search object, add to state
        state.search = new Search(query);

        //Prepare UI
        searchView.clearResults();
        searchView.clearInput();
        renderLoader(elements.searchResults);


                //Search for recipes
        try {
            await state.search.getResults();

            //Display results in UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (error) {
            alert(error);
            clearLoader();            
        }

        
    }
};


const controlRecipe= async () => {
    //Get the ID
    const id = window.location.hash.replace('#', '');

    if (id) {
        //Prepare UI
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //Highlight Selected Item
        if (state.search) searchView.highlightSelected(id);

        //Create Recipe Object
        state.recipe = new Recipe(id);

        window.r = state.recipe; // EXPOSE THIS VARIABLE FOR TESTING

        //Get Recipe Data - this could go wrong, so try catch.

        try {
            await state.recipe.getRecipe();

            //Parse Ingredients
            state.recipe.parseIngredients();

            //Calculate Servings and Time
            state.recipe.calcTime();
            state.recipe.calcServings();
    
            //Render
            clearLoader();
            recipeView.renderRecipe(state.recipe);
            
        } catch (error) {
            alert(error);
        }
    }
};

const controlList = () => {
    if (!state.list) state.list = new List();

    state.recipe.ingredients.forEach(el => { //Add to list, then to
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}




elements.searchField.addEventListener('submit', e => {
    e.preventDefault(); //stops reload
    controlSearch();
});

elements.searchResultsPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline'); //Chooses closest inline btn to whatever is clicked.
    if (btn) {
        const goToPage =   parseInt(btn.dataset.goto); //this is stored here because in html data-goto= is specified

        //clear Old page
        searchView.clearResults();



        searchView.renderResults(state.search.result, goToPage);
        
        //renders with page goToPage instead of page 1
    }
});

//window.addEventListener('hashchange', controlRecipe); // when url changes, control recipe
//window.addEventListener('load', controlRecipe); 

['hashchange', 'load'].forEach(e => window.addEventListener(e, controlRecipe));

//Handling Recipe Button Clicks

elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-dec, .btn-dec *')) { // if it's btn-dec, or any child of btn-dec.
        //Dec clicked
        if (state.recipe.servings > 1) {
        state.recipe.updateServings('dec');
        recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-inc, .btn-inc *')) { // if it's btn-inc, or any child of btn-dec.
    //inc clicked
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        //Add to Shopping List Clicked
        controlList();
    }
}); //Target +/- button even though they aren't on page yet

elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    //Finds the closest item's id.

    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        state.list.deleteItem(id);
        listView.delItem(id);
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value);
        state.list.updateCount(id, val);
    }
});
