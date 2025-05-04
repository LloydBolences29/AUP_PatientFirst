import React from "react";
import { useState } from "react";
import "./AccordionComponents.css"

const AccordionComponents = ({ items }) => {

  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  return (
    <div className="accordion-container">
      {items.map((item, index) => (
        <div className="accordion-item" key={index}>
          <button className="accordion-header" onClick={() => toggleAccordion(index)}>
            <span>{item.title}</span>
            <span className={`arrow ${openIndex === index ? "rotate" : ""}`}>&#9660;</span>
          </button>
          <div className="accordion-body" style={{ maxHeight: openIndex === index ? "100vh" : "0", padding: openIndex === index ? "10px" : "0" }}>
            {item.content}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AccordionComponents;

// Usage Example
// import CustomAccordion from "./CustomAccordion";
// <CustomAccordion items={[{ title: "Section 1", content: "Content 1" }, { title: "Section 2", content: "Content 2" }]} />
