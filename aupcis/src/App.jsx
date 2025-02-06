import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'


export default function App() {

 

  return (
    <>
    <nav class="navbar">
      {/* For the name of the prooduct */}
      <div class="navContent">
        <div class="co.name">
          <h2>PatientFirst</h2>
        </div>

        {/*For buttons*/}
        <div class="navbtn">
          <ul class="btnList">
            <li><a href="">Home</a></li>
            <li><a href="">About</a></li>
            <li><a href="">Solutions</a></li>
            <li><a href="">Login/Signup</a></li>
          </ul>
        </div>
      </div>
    </nav>

   {/*For Hero Section*/}
    <div class="hero">
      <div class="content" id="textContent">
        <div class="main-hero">
          <div class="heroContent">
            <h1>This is the hero Content</h1>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minima
              quam, eveniet voluptates iure quae error hic tempora architecto,
              animi ex eos commodi illo vitae laudantium adipisci consequatur
              rerum vel aut.
            </p>
          </div>

          <div class="content" id="btnContent">
            <button type="button">Get Started</button>
            <button type="button">Learn More</button>
          </div>
         
        </div>
      </div>
    </div>
    {/*For Solution Section*/}
    <div class="solution">
      <div class="solutionContent">
        <div class="solutionCards">
          <div class="cards">Solution 1</div>
          <div class="cards">Solution 2</div>
          <div class="cards">Solution 3</div>
        </div>
      </div>
    </div>
    </>
  )
}


