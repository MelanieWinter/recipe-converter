const conversionInput = document.getElementById('conversion');
const originalRecipeInput = document.getElementById('original');
const formattedRecipeInput = document.getElementById('formatted');

function convertRecipe() {
    const conversionFactor = parseFloat(conversionInput.value);
    const originalRecipeHTML = originalRecipeInput.innerHTML;
    const convertedRecipeHTML = convertIngredientToDecimal(originalRecipeHTML, conversionFactor);

    formattedRecipeInput.innerHTML = convertedRecipeHTML;
}

document.getElementById('convert').addEventListener('click', convertRecipe);

function convertIngredientToDecimal(ingredient, conversionFactor) {
    // Regular expression to match fractions, mixed numbers, and whole numbers
    const ingredientRegex = /(\d+\s*\.*\d*\s*\/\s*\d+|\d+\.\d+|\d+)/g;

    return ingredient.replace(/(<[^>]+>)([^<]+)(<\/[^>]+>)/g, function (match, openTag, content, closeTag) {
        const convertedContent = content.replace(ingredientRegex, function (match) {
            if (match.includes('/') || match.includes(' ')) {
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
                return `<span style="font-size: 1em;">${(decimal * conversionFactor).toFixed(2).replace(/\.0{1,2}$/, '')}</span>`;
            } else if (!isNaN(parseFloat(match))) {
                // Handle whole numbers here
                const number = parseFloat(match);
                return `<span style="font-size: 1em;">${(number * conversionFactor).toFixed(2).replace(/\.0{1,2}$/, '')}</span>`;
            } else {
                return match; // No conversion for non-numeric content
            }
        });

        return openTag + convertedContent + closeTag;
    });
}

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

