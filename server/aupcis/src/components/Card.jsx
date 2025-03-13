import React from "react";
import "./Card.css";

export const Card = ({ cardTitle, addbtn, cardBody }) => {
  return (
    <>
        <div className=" container wrapper">
          <div className="card">
            <div className="card-header">
              <h1>{cardTitle}</h1>
              <div className="addbtn ms-auto">{addbtn}</div>
            </div>
            <div className="card-body">{cardBody}</div>
          </div>
      </div>
    </>
  );
};

export default Card;
