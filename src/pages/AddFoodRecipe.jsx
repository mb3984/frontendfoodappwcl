import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddFoodRecipe = () => {
  const [recipeData, setRecipeData] = useState({
    title: "",
    time: "",
    ingredients: "",
    instructions: "",
    imageUrl: "", // Image URL as a text field
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const onHandleChange = (e) => {
    const { name, value } = e.target;
    setRecipeData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const onHandleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", recipeData.title);
    formData.append("time", recipeData.time);
    formData.append("instructions", recipeData.instructions);

    // Format ingredients to an array of strings
    const formattedIngredients = recipeData.ingredients
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");
    formData.append("ingredients", JSON.stringify(formattedIngredients));

    // Add imageUrl as a text field (URL string)
    formData.append("imageUrl", recipeData.imageUrl);

    try {
      await axios.post(
        "https://backendfoodappwcl.onrender.com/recipe/post", // Use your backend endpoint
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      alert("Recipe added successfully");
      navigate("/"); // Redirect to homepage or other page
    } catch (error) {
      console.error(
        "Error adding recipe:",
        error.response?.data || error.message
      );
      alert("Failed to add recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <form className="form" onSubmit={onHandleSubmit}>
        <div className="form-control">
          <label>Title</label>
          <input
            type="text"
            className="input"
            name="title"
            onChange={onHandleChange}
            value={recipeData.title}
            required
          />
        </div>

        <div className="form-control">
          <label>Time</label>
          <input
            type="text"
            className="input"
            name="time"
            onChange={onHandleChange}
            value={recipeData.time}
            required
          />
        </div>

        <div className="form-control">
          <label>Ingredients (comma-separated)</label>
          <textarea
            className="input-textarea"
            name="ingredients"
            rows="5"
            onChange={onHandleChange}
            value={recipeData.ingredients}
            required
          ></textarea>
        </div>

        <div className="form-control">
          <label>Instructions</label>
          <textarea
            className="input-textarea"
            name="instructions"
            rows="5"
            onChange={onHandleChange}
            value={recipeData.instructions}
            required
          ></textarea>
        </div>

        <div className="form-control">
          <label>Image URL</label>
          <input
            type="text"
            className="input"
            name="imageUrl"
            onChange={onHandleChange}
            value={recipeData.imageUrl}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Recipe"}
        </button>

        {loading && <p className="loading-text">Posting your recipe...</p>}
      </form>
    </div>
  );
};

export default AddFoodRecipe;
