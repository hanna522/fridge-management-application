// src/components/Home.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function MealPlan() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl =
    `https://api.edamam.com/api/recipes/v2?type=public&app_id=${process.env.REACT_APP_API_ID}&app_key=${process.env.REACT_APP_API_KEY}&q=recipe`

  const requiredIngredients = ["garlic"]; // List of ingredients to filter by

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        console.log(result); // Log the response structure

        // Filter recipes that include all the required ingredients
        const filteredRecipes = result.hits.filter((item) =>
          requiredIngredients.every((ingredient) =>
            item.recipe.ingredients.some((recipeIngredient) =>
              recipeIngredient.food.toLowerCase().includes(ingredient)
            )
          )
        );

        setData(filteredRecipes); // Set the filtered data
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Meal Plan</h1>
      <ul>
        {data.map((item, index) => (
          <li key={index}>
            <h2>{item.recipe.label}</h2>
            <p>{item.recipe.source}</p>
            <img src={item.recipe.image} alt={item.recipe.label} />
            {item.recipe.ingredients.map((ingredient, ingredientIndex) => (
              <p key={ingredientIndex}>{ingredient.food}</p>
            ))}
            <Link
              to={{ pathname: item.recipe.url }}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Recipe
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MealPlan;
