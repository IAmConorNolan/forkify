import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
elements.searchInput.value = '';
};

export const clearResults = () => {
elements.searchResultList.innerHTML = '';
elements.searchResultsPages.innerHTML = '';
};

export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('result__link--active')
    });
    console.log(`Inside highlightSelected`);
    document.querySelector(`a[href='#${id}']`).classList.add('result__link--active'); //Search for all links with ID passed in.

}

const limitRecipeTitle = (title, limit=17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce( (a,c) => {
            if (a + c.length <= limit) {
                newTitle.push(c); //If the accumulator + new word chars are less than limit, push word, otherwise don't.
            }
            return a + c.length;
        }, 0);
        return `${newTitle.join(' ')} ...`;
    }
    return title;
};

const renderRecipe = recipe => {
    const markup = `
    <li>
        <a class="results__link results__link--active" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `;
    elements.searchResultList.insertAdjacentHTML('beforeend', markup);
};

const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;
                   

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults/resPerPage);
    let button;
    if(page === 1 && pages > 1) {
        button = createButton(page, 'next');
    } else if (page === pages) {
        button = createButton(page, 'prev');
    } else if (page < pages && pages > 1) {
        button = `
                ${createButton(page, 'prev')}
                ${createButton(page, 'next')}
        `;
    }

    elements.searchResultsPages.insertAdjacentHTML('afterbegin', button);
    
};

export const renderResults = (recipes, page=1, resPerPage=10) => {
    const start = (page-1) * resPerPage;
    const end = page * resPerPage;
    recipes.slice(start, end).forEach(renderRecipe);

    //render Pagination Button

    renderButtons(page, recipes.length, resPerPage);
};
