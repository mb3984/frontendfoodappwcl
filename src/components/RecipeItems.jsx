import { useEffect, useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { BsStopwatchFill } from "react-icons/bs";
import { FaHeart, FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import "./RecipeItems.css";
import axios from "axios";

const RecipeItems = () => {
  const recipes = useLoaderData();
  const [allRecipes, setAllRecipes] = useState([]);
  const [favItems, setFavItems] = useState(
    JSON.parse(localStorage.getItem("fav")) ?? []
  );
  const [loadingId, setLoadingId] = useState(null); // Track which item is being deleted
  const navigate = useNavigate();
  let path = window.location.pathname === "/myRecipe";

  useEffect(() => {
    console.log("useEffect triggered. Recipes from loader:", recipes);
    if (recipes && Array.isArray(recipes)) {
      setAllRecipes(recipes);
    } else {
      console.warn("⚠️ Invalid or empty recipe data received.");
    }
  }, [recipes]);

  // DELETE Recipe with a Faded Icon Effect
  const onDelete = async (id) => {
    console.log(`Attempting to delete recipe with id: ${id}`);
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;

    try {
      setLoadingId(id); // Indicate loading for this item
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      await axios.delete(
        `https://backendfoodappwcl.onrender.com/recipe/delete/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAllRecipes((prev) => prev.filter((recipe) => recipe._id !== id));
      const updatedFavItems = favItems.filter((recipe) => recipe._id !== id);
      setFavItems(updatedFavItems);
      localStorage.setItem("fav", JSON.stringify(updatedFavItems));
      console.log(`Recipe with id: ${id} deleted successfully.`);
    } catch (error) {
      console.error(
        "❌ Error deleting recipe:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setLoadingId(null); // Reset loading state
    }
  };

  // FAVORITE Recipe Toggle
  const favRecipe = (item) => {
    console.log(`Toggling favorite status for recipe: ${item.title}`);
    let updatedFavs = favItems.some((recipe) => recipe._id === item._id)
      ? favItems.filter((recipe) => recipe._id !== item._id)
      : [...favItems, item];

    setFavItems(updatedFavs);
    localStorage.setItem("fav", JSON.stringify(updatedFavs));
  };

  return (
    <div className="card-container">
      {allRecipes.length === 0 ? (
        <p>No recipes available. Add some new recipes!</p>
      ) : (
        allRecipes.map((item, index) => (
          <div
            key={index}
            className="card"
            onDoubleClick={() => {
              if (item && item._id) {
                console.log("Navigating to:", `/recipe/${item._id}`);
                navigate(`/recipe/${item._id}`);
              } else {
                console.error("❌ Recipe item is missing _id");
              }
            }}
          >
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                width="120px"
                height="100px"
                alt={item.title}
              />
            ) : (
              <div className="image-placeholder">No Image Available</div>
            )}
            <div className="card-body">
              <div className="title">{item.title}</div>
              <div className="icons">
                <div className="timer">
                  <BsStopwatchFill /> {item.time || "N/A"}
                </div>
                {!path ? (
                  <FaHeart
                    onClick={() => favRecipe(item)}
                    style={{
                      color: favItems.some((res) => res._id === item._id)
                        ? "red"
                        : "",
                    }}
                  />
                ) : (
                  <div className="action">
                    {item._id && (
                      <Link to={`/editRecipe/${item._id}`} className="editIcon">
                        <FaEdit />
                      </Link>
                    )}
                    <MdDelete
                      onClick={() => onDelete(item._id)}
                      className="deleteIcon"
                      style={{
                        opacity: loadingId === item._id ? 0.5 : 1, // Fade effect while loading
                        pointerEvents: loadingId === item._id ? "none" : "auto",
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default RecipeItems;
