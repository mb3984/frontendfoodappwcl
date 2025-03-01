import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import MainNavigation from "./components/MainNavigation";
import axios from "axios";
import AddFoodRecipe from "./pages/AddFoodRecipe";
import EditRecipe from "./pages/EditRecipe";
import RecipeDetails from "./pages/RecipeDetails";

const API_BASE_URL = "https://backendfoodappwcl.onrender.com/recipe";

// ✅ Fetch all recipes
const getAllRecipes = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/getAll`);
    return res.data;
  } catch (error) {
    console.error("❌ Error fetching all recipes:", error);
    return []; // Return an empty array to prevent issues in the UI
  }
};

// ✅ Fetch user's own recipes
const getMyRecipes = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log("🔍 Retrieved user from localStorage:", user);

  if (!user) {
    console.warn("⚠️ No user logged in, redirecting to login.");
    return []; // Prevent errors if no user is logged in
  }

  try {
    const allRecipes = await getAllRecipes();

    // Ensure createdBy exists before accessing _id
    const userRecipes = allRecipes.filter(
      (recipe) => recipe.createdBy && recipe.createdBy._id === user._id
    );

    console.log("🔍 User's recipes:", userRecipes);
    return userRecipes;
  } catch (error) {
    console.error("❌ Error fetching user recipes:", error);
    return []; // Return an empty array to handle the error gracefully
  }
};

// ✅ Fetch favorite recipes from localStorage
const getFavRecipes = () => {
  const favRecipes = JSON.parse(localStorage.getItem("fav"));
  if (!favRecipes) {
    console.warn("⚠️ No favorite recipes found in localStorage.");
  }
  return favRecipes || []; // Return an empty array if null
};

// ✅ Fetch a single recipe by ID
const getRecipe = async ({ params }) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/get/${params.id}`);
    let recipe = res.data;
    console.log(recipe);

    if (!recipe) {
      console.error("⚠️ Recipe not found");
      return null; // Return null if the recipe does not exist
    }

    return recipe;
  } catch (error) {
    console.error("❌ Error fetching recipe:", error);
    return null; // Return null to prevent further issues if recipe not found
  }
};

// ✅ Define router
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainNavigation />,
    children: [
      { path: "/", element: <Home />, loader: getAllRecipes },
      { path: "/myRecipe", element: <Home />, loader: getMyRecipes },
      { path: "/favRecipe", element: <Home />, loader: getFavRecipes },
      { path: "/addRecipe", element: <AddFoodRecipe /> },
      { path: "/editRecipe/:id", element: <EditRecipe /> },
      { path: "/recipe/:id", element: <RecipeDetails />, loader: getRecipe },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
