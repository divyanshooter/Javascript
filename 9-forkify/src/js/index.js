import Search from './models/Search';
import Recipe from'./models/Recipe';
import {elements,renderLoader,clearLoader} from './views/base';
import * as searchViews from './views/searchViews';
import * as recipeView from './views/recipeView';
const state={};
const controlSearch=async ()=>{
    const query=searchViews.getInput();
    if(query)
    {
        state.search=new Search(query);
        try
        {
            searchViews.clearInput();
            searchViews.clearResults();
            renderLoader(elements.searchRes);
            await state.search.getResults();
            clearLoader();
            searchViews.renderResults(state.search.result);
        }
        catch(err)
        {
            alert('Something went wrong in processing the search');
            alert(err);
        }
    
    }
    
};
elements.searchForm.addEventListener('submit',event=>{
   event.preventDefault();
   controlSearch();
});

elements.searchResPages.addEventListener('click',event=>{
    const btn=event.target.closest('.btn-inline');
    if(btn)
    {
        const goToPage = btn.dataset.goto;
        searchViews.clearResults();
        searchViews.renderResults(state.search.result.goToPage);
        
    }
});

const controlRecipe=async ()=>{
    const id=window.location.hash.replace('#','');
    if(id)
    {
        renderLoader(elements.recipe);
        state.recipe=new Recipe(id);
        if(state.search)
        {
            searchViews.highlightSelected(id);
        }
        
        try{
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            console.log(state.recipe.ingedients);
            state.recipe.calcTime();
            state.recipe.calcServings();
            clearLoader();
            recipeView.renderRecipe(state.recipe);
    }
    catch(err)
    {
        alert('Not able To Load Recipe');
        alert(err);
    }
  }
}

['hashchange','load'].forEach(event=>window.addEventListener(event,controlRecipe));

elements.recipe.addEventListener('click',el=>{
  if(el.target.matches('.btn-decrease , btn-decrease *'))
   {
       state.recipe.updateServings('dec');
   }
   else if(el.target.matches('.btn-increase , btn-increase *'))
   {
    state.recipe.updateServings('inc');
   }
   console.log(state.recipe);
});