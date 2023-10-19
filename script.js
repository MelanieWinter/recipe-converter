
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
        
        // Create an array to store the converted recipe
        const convertedRecipe = [];

        // Iterate through the recipe lines and convert the ingredients to decimals
        for (const line of recipeLines) {
            const convertedLine = convertIngredientToDecimal(line, conversionFactor);
            convertedRecipe.push(convertedLine);
        }

        // Update the formatted recipe input
        formattedRecipeInput.value = convertedRecipe.join('\n');
    }
    else {
        // Handle invalid input
        formattedRecipeInput.value = "Please enter a valid conversion factor and recipe.";
    }
});

// Add an event listener to the "Save" button
document.querySelector('#formatted-recipe-div input[type="submit"]').addEventListener('click', function() {
    // Handle saving the formatted recipe here
});
