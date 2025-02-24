import { useState } from "react";
import foodRecipe from "../assets/foodrecipe3img.jpeg"; // Image for the intro section
import Navbar from "../components/Navbar"; // Navbar component
import Footer from "../components/Footer"; // Footer component
import RecipeItems from "../components/RecipeItems"; // Component for displaying recipe items
import { useNavigate } from "react-router-dom"; // Use navigate hook for routing
import Modal from "../components/Modal"; // Modal for login/signup
import InputForm from "../components/InputForm"; // Form inside the modal

const Home = () => {
  const navigate = useNavigate(); // Initialize navigation hook
  const [isOpen, setIsOpen] = useState(false); // Modal open state

  // Function to handle the click on the "Share your recipe" button
  const addRecipe = () => {
    let token = localStorage.getItem("token"); // Get token from localStorage
    if (token) {
      navigate("/addRecipe"); // Navigate to the add recipe page if logged in
    } else {
      setIsOpen(true); // Open the modal to prompt user to log in or sign up
    }
  };

  return (
    <>
      <section className="home">
        {/* Left section with text content */}
        <div className="left">
          <h1>Food Recipe</h1>
          <h5>
            It is a long established fact that a reader will be distracted by
            the readable content of a page when looking at its layout. The point
            of using Lorem Ipsum is that it has a more-or-less normal
            distribution of letters, as opposed to using Content here, content
            here, making it look like readable English.
          </h5>
          <button onClick={addRecipe} aria-label="Share your recipe">
            Share your recipe
          </button>
        </div>

        {/* Right section with food image */}
        <div className="right">
          <img
            src={foodRecipe}
            width="320px"
            height="300px"
            alt="Food Recipe Image"
            aria-hidden="true"
          />
        </div>
      </section>

      {/* Background wave */}
      <div className="bg">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#d4f6e8"
            fillOpacity="1"
            d="M0,32L40,32C80,32,160,32,240,58.7C320,85,400,139,480,149.3C560,160,640,128,720,101.3C800,75,880,53,960,80C1040,107,1120,181,1200,213.3C1280,245,1360,235,1400,229.3L1440,224L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
          ></path>
        </svg>
      </div>

      {/* Modal for login/signup */}
      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <InputForm setIsOpen={setIsOpen} />
        </Modal>
      )}

      {/* Recipe Items */}
      <div className="recipe">
        <RecipeItems />
      </div>

      {/* Footer component */}
      <Footer />
    </>
  );
};

export default Home;
