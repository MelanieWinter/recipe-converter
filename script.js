
const conversionInput = document.getElementById('conversion');
const originalRecipeInput = document.getElementById('original');
const formattedRecipeInput = document.getElementById('formatted');

function convertIngredientToDecimal(ingredient, conversionFactor) {
    // Regular expression to match fractions, mixed numbers, and whole numbers
    const ingredientRegex = /(\d+\s*\.*\d*\s*\/\s*\d+|\d+\.\d+|\d+)/g;

    return ingredient.replace(ingredientRegex, function(match) {
        if (match.includes('/') || match.includes(' ')) {
            // If the match is a fraction or mixed number, convert it to a decimal
            let parts = match.split(' ');
            let decimal = 0;

            for (const part of parts) {
                const fractionParts = part.split('/');
                if (fractionParts.length === 2) {
                    const numerator = parseFloat(fractionParts[0]);
                    const denominator = parseFloat(fractionParts[1]);
                    decimal += numerator / denominator;
                } else {
                    decimal += parseFloat(part);
                }
            }
            return (decimal * conversionFactor).toFixed(2).replace(/\.0{1,2}$/, ''); 
            // Multiply by the conversion factor and remove trailing zeros
        } else {
            // If it's not a fraction or mixed number, try to parse it as a float
            const number = parseFloat(match);
            if (!isNaN(number)) {
                return (number * conversionFactor).toFixed(2).replace(/\.0{1,2}$/, ''); 
                // Multiply by the conversion factor and remove trailing zeros
            }
        }
        return match;
    });
}

// Add an event listener to the "Convert" button
document.querySelector('#original-recipe-div input[type="submit"]').addEventListener('click', function() {
    // Get the conversion factor from the input
    const conversionFactor = parseFloat(conversionInput.value);

    // Get the original recipe from the input
    const originalRecipe = originalRecipeInput.value;

    // Check if the input is a valid number and if there's a recipe
    if (!isNaN(conversionFactor) && originalRecipe) {
        // Split the recipe into lines (assuming each line is a step)
        const recipeLines = originalRecipe.split('\n');
        const convertedRecipe = [];
        for (const line of recipeLines) {
            const convertedLine = convertIngredientToDecimal(line, conversionFactor);
            convertedRecipe.push(convertedLine);
        }
        formattedRecipeInput.value = convertedRecipe.join('\n');
    }
    else {
        formattedRecipeInput.value = "Please enter a valid conversion factor and recipe.";
    }
});

document.querySelector('#formatted-recipe-div input[type="submit"]').addEventListener('click', function() {
    // Handle saving the formatted recipe here
});

// const request = require('request-promise');
// const cheerio = require('cheerio');

// const url = 'https://www.thechunkychef.com/chicken-and-rice-soup/';
// request(url)
//   .then((html) => {
//     const $ = cheerio.load(html);

//     let recipeData = {
//       title: $('h1.entry-title').text().trim(),
//       prepTime: $('span.wprm-recipe-prep-time').text().trim(),
//       cookTime: $('span.wprm-recipe-cook-time').text().trim(),
//       totalTime: $('span.wprm-recipe-total-time').text().trim(),
//       servings: $('span.wprm-recipe-servings').text().trim(),
//       calories: $('span.wprm-recipe-calories').text().trim(),
//     };

//     let ingredients = [];
//     $('ul.wprm-recipe-ingredients li').each((index, element) => {
//       ingredients.push($(element).text().trim());
//     });

//     let instructions = [];
//     $('div.wprm-recipe-instruction-text').each((index, element) => {
//       instructions.push(`${index + 1}. ${$(element).text().trim()}`);
//     });

//     recipeData.ingredients = ingredients;
//     recipeData.instructions = instructions;

//     // Log the recipe data
//     console.log(recipeData);
//   })
//   .catch((error) => {
//     console.error(error);
//   });


