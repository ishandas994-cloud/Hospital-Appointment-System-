import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>
          Welcome to Hospital Management
          System
        </h1>

        <p>
          Book appointments with expert
          doctors easily and quickly.
        </p>

        <div className="hero-buttons">
          <Link to="/register">
            <button>
              Get Started
            </button>
          </Link>

          <Link to="/login">
            <button className="secondary-btn">
              Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;