import React from "react";

const Card = ({ title, value, imageSrc }) => {
    return (
        <div className="card">
            <div className="card-image-container">
                <img src={imageSrc} alt={title} className="card-image" />
            </div>
            <div className="card-content">
                <h3>{title}</h3>
                <p>{value}</p>
            </div>
        </div>
    );
};

export default Card;
