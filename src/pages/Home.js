import React from 'react';
import { Link } from 'react-router-dom';
import Product from '../components/Product';

const Home = ({ addToCart }) => {
  return (
    <div>
      <h2>Welcome to Ebshops</h2>

      {/* Insecticides Section */}
      <section id="insecticides">
        <h3>Insecticides</h3>
        <p>Protect your home with our range of effective insecticides.</p>
        <Product 
          name="Insecticide A" 
          price={10} 
          image="/images/insecticide-a.jpg" 
          addToCart={addToCart} 
        />
        <Product 
          name="Insecticide B" 
          price={15} 
          image="/images/insecticide-b.jpg" 
          addToCart={addToCart} 
        />
        <Link to="/insecticides">View All Insecticides</Link>
      </section>

      {/* Perfumes Section */}
      <section id="perfumes">
        <h3>Perfumes</h3>
        <p>Discover luxurious fragrances for every occasion.</p>
        <Product 
          name="Luxury Perfume" 
          price={50} 
          image="/images/perfume.jpg" 
          addToCart={addToCart} 
        />
        <Link to="/perfumes">View All Perfumes</Link>
      </section>

      {/* Merchandise Section */}
      <section id="merchandise">
        <h3>General Merchandise</h3>
        <p>Shop everyday essentials at competitive prices.</p>
        <Product 
          name="Merchandise A" 
          price={20} 
          image="/images/merchandise-a.jpg" 
          addToCart={addToCart} 
        />
        <Link to="/merchandise">View All Merchandise</Link>
      </section>
    </div>
  );
};

export default Home;
