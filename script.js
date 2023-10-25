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

