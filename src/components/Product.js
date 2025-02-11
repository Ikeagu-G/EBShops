import React, { useState } from "react";

const Product = ({ name, price, image }) => {
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState("pieces");

  return (
    <div className="product">
      <img src={image} alt={name} />
      <h3>{name} - ${price}</h3>
      <label>
        Quantity:
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </label>
      <label>
        Unit:
        <select value={unit} onChange={(e) => setUnit(e.target.value)}>
          <option value="pieces">Pieces</option>
          <option value="liters">Liters</option>
          <option value="grams">Grams</option>
        </select>
      </label>
      <button onClick={()=> addToCart({name, price, quantity, unit})}>
        Add to Cart</button>
    </div>
  );
};

export default Product;