import { useLoaderData } from "react-router-dom"; // Import the data loader
import profileImage from "../assets/profileimagefood.png"; // Default profile image
import "./RecipeDetails.css";

const RecipeDetails = () => {
  // Get recipe data from loader
  const recipe = useLoaderData();
  console.log("recipe details page", recipe);

  // Check if the recipe exists, if not return an error message
  if (!recipe) {
    return <h3 className="error-message">Error: Recipe not found.</h3>;
  }

  // Default image URL fallback
  const recipeImage = recipe.imageUrl || "/path/to/default-image.jpg"; // Provide default image if missing
  const profileImageUrl = recipe.profileImage || profileImage; // Check if profile image is available

  return (
    <div className="outer-container">
      {/* Profile Section */}
      <div className="profile">
        <img src={profileImageUrl} width="50px" height="50px" alt="Profile" />
        <h5>{recipe.createdBy.email}</h5>{" "}
        {/* Display email of the user who posted */}
      </div>
      {/* Recipe Title */}
      <h3 className="title">{recipe.title}</h3> {/* Display recipe title */}
      {/* Recipe Cover Image */}
      <img src={recipeImage} width="220px" height="200px" alt="Recipe Cover" />
      {/* Recipe Details Section */}
      <div className="recipe-details">
        {/* Ingredients */}
        <div className="ingredients">
          <h4>Ingredients</h4>
          {recipe.ingredients && recipe.ingredients.length > 0 ? (
            <ul>
              {recipe.ingredients.map((item, index) => (
                <li key={index}>{item}</li> // List each ingredient
              ))}
            </ul>
          ) : (
            <p>No ingredients available.</p> // Fallback if no ingredients are available
          )}
        </div>

        {/* Instructions */}
        <div className="instructions">
          <h4>Instructions</h4>
          {recipe.instructions ? (
            <span>{recipe.instructions}</span> // Display recipe instructions
          ) : (
            <p>No instructions available.</p> // Fallback if no instructions are available
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;
