import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditRecipe = () => {
  const [recipeData, setRecipeData] = useState({
    title: "",
    ingredients: "",
    instructions: "",
    time: "",
    imageUrl: "", // Store the image URL here
    imageFile: null, // For storing the selected image file
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
          ingredients: ingredients.join(", "), // Convert array to comma-separated string
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
    const { name, value, files } = e.target;
    if (name === "image") {
      // Handle image file selection
      const file = files[0];
      setRecipeData((prevData) => ({ ...prevData, imageFile: file }));
    } else {
      setRecipeData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = recipeData.imageUrl;

      // If a new image file is selected, handle it here
      if (recipeData.imageFile) {
        const reader = new FileReader();
        reader.onloadend = () => {
          imageUrl = reader.result; // Update imageUrl with the local file URL
          updateRecipeData(imageUrl);
        };
        reader.readAsDataURL(recipeData.imageFile);
      } else {
        updateRecipeData(imageUrl);
      }
    } catch (error) {
      console.error("Error updating recipe:", error);
      alert("Failed to update recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateRecipeData = (imageUrl) => {
    const updatedRecipe = {
      title: recipeData.title,
      ingredients: recipeData.ingredients.split(",").map((item) => item.trim()),
      instructions: recipeData.instructions,
      time: recipeData.time,
      imageUrl, // Include the image URL
    };

    // Send the updated recipe data to your backend
    axios
      .put(
        `https://backendfoodappwcl.onrender.com/recipe/update/${id}`,
        updatedRecipe,
        {
          headers: {
            authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then(() => {
        alert("Recipe updated successfully!");
        navigate("/myRecipe");
      })
      .catch((error) => {
        console.error("Error updating recipe:", error);
        alert("Failed to update recipe. Please try again.");
      });
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
          <label>Recipe Image</label>
          <input
            type="file"
            className="input"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />
          {/* Show image preview if one is selected */}
          {recipeData.imageFile && (
            <img
              src={URL.createObjectURL(recipeData.imageFile)}
              alt="Image Preview"
              width="100"
              height="100"
              style={{ marginTop: "10px" }}
            />
          )}
          {/* If there's an existing image URL (for editing), show it as well */}
          {recipeData.imageUrl && !recipeData.imageFile && (
            <img
              src={recipeData.imageUrl}
              alt="Existing Image"
              width="100"
              height="100"
              style={{ marginTop: "10px" }}
            />
          )}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Recipe"}
        </button>
        {loading && <p className="loading-text">Updating recipe...</p>}
      </form>
    </div>
  );
};

export default EditRecipe;
