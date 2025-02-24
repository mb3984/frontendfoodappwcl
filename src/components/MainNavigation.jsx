import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";

const MainNavigation = () => {
  return (
    <div className="layout-container">
      <Navbar />
      <main className="content">
        <Outlet />
      </main>
      <Footer />

      {/* CSS for Layout */}
      <style>
        {`
          .layout-container {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
          }

          .content {
            flex: 1; /* Pushes the footer to the bottom */
            padding: 20px;
          }
        `}
      </style>
    </div>
  );
};

export default MainNavigation;
