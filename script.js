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
    const measurementTerms = ["cup", "c", "teaspoon", "t", "tsp", "tablespoon", "T", "tbsp", "quart", "qt", "pint", "pt", "ounce", 'oz', "gallon", "gal", "lb", "lb.", "pound","milligram", "mg", "gram", "kilogram", "kg", "milliliter", "ml", "liter", "l"];

    // Regular expression to match fractions, mixed numbers, and whole numbers
    const ingredientRegex = /(\d+\s*\.*\d*\s*\/\s*\d+|\d+\.\d+|\d+)/g;

    return ingredient.replace(/(<[^>]+>)([^<]+)(<\/[^>]+>)/g, function(match, openTag, content, closeTag) {
        const convertedContent = content.replace(ingredientRegex, function(match) {
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
                // Check if the next word is a measurement term
                const nextWord = content.substring(content.indexOf(match) + match.length).split(' ')[0];
                if (measurementTerms.includes(nextWord.toLowerCase())) {
                    const number = parseFloat(match);
                    if (!isNaN(number)) {
                        return `<span style="font-size: 1em;">${(number * conversionFactor).toFixed(2).replace(/\.0{1,2}$/, '')}</span>`;
                    }
                }
            }
            return match;
        });

        return openTag + convertedContent + closeTag;
    });
}

document.getElementById('save').addEventListener('click', function() {
    const formattedRecipeHTML = formattedRecipeInput.innerHTML;

    // Create a new jsPDF instance
    const pdf = new jsPDF();

    // Add the content (formatted recipe) to the PDF
    pdf.fromHTML(formattedRecipeHTML, 15, 15);

    // Save the PDF to a file
    pdf.save('converted_recipe.pdf');
});

