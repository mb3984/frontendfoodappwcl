import axios from "axios";
import "./EditRecipe.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditRecipe = () => {
  const [recipeData, setRecipeData] = useState({
    title: "",
    ingredients: "",
    instructions: "",
    time: "",
    imageUrl: "", // Only storing image URL
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(
          `https://backendfoodappwcl.onrender.com/recipe/get/${id}`
        );
        const { title, ingredients, instructions, time, imageUrl } =
          response.data;
        setRecipeData({
          title,
          ingredients: ingredients.join(", "),
          instructions,
          time,
          imageUrl,
        });
      } catch (error) {
        console.error("Error fetching recipe:", error);
      }
    };
    fetchRecipe();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipeData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const updatedRecipe = {
      title: recipeData.title,
      ingredients: recipeData.ingredients.split(",").map((item) => item.trim()),
      instructions: recipeData.instructions,
      time: recipeData.time,
      imageUrl: recipeData.imageUrl, // Using only image URL
    };

    try {
      await axios.put(
        `https://backendfoodappwcl.onrender.com/recipe/update/${id}`,
        updatedRecipe,
        {
          headers: {
            authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      alert("Recipe updated successfully!");
      navigate("/myRecipe");
    } catch (error) {
      console.error("Error updating recipe:", error);
      alert("Failed to update recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-control">
          <label>Title</label>
          <input
            type="text"
            className="input"
            name="title"
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
            value={recipeData.imageUrl}
            required
          />
        </div>
        {recipeData.imageUrl && (
          <img
            src={recipeData.imageUrl}
            alt="Recipe Preview"
            width="100"
            height="100"
            style={{ marginTop: "10px" }}
          />
        )}
        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Recipe"}
        </button>
      </form>
    </div>
  );
};

export default EditRecipe;
