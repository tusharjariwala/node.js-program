
import { EventEmitter, Injectable } from "@angular/core";
import { Subject } from "rxjs";

import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Recipe } from "./recipe.model";

@Injectable()
export class RecipeService{
    recipesChanged=new Subject<Recipe[]>();
   recipeSelected=new Subject<Recipe>();
    private recipes:Recipe[]=[

        new Recipe('A Test Recipe','this is simply a test','https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=768,574',[
            new Ingredient('Meat',1),
            new Ingredient('french fries',20)
        ]),
        new Recipe('Another Test Recipe','this is simply a test','https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=768,574',[
            new Ingredient('Buns',2),
            new Ingredient('Meat',1)
        ])
      ];
    // private recipes:Recipe[] =[];
      constructor(private slService:ShoppingListService)
      {
          
      }
      setRecipes(recipes:Recipe[])
      {
          this.recipes=recipes;
          this.recipesChanged.next(this.recipes.slice());
      }
      getRecipes()
      {
          return this.recipes.slice();
      }
      getRecipe(index: number)
      {
          return this.recipes[index];
      }
      addIngredientsToShoppingList(ingredients:Ingredient[])
      {
       this.slService.addIngredients(ingredients);
      }
    addRecipe(recipe:Recipe)
    {
        this.recipes.push(recipe);
       this.recipesChanged.next(this.recipes.slice());
    }
    updateRecipe(index:number,newRecipe:Recipe)
    {
        this.recipes[index]=newRecipe;
        this.recipesChanged.next(this.recipes.slice());
    }
    deleteRecipe(index:number)
    {
        this.recipes.splice(index,1);
        this.recipesChanged.next(this.recipes.slice());
    }
}