import React from 'react';
import './MainPage.css';

function MainPage() {
  return (
    <div>
      <header>
        <h1>LUC-A</h1>
      </header>
      <div className="main-content">
        <h2>Our Process</h2>
        <img src="/path/to/image1.jpg" alt="Process step 1" />
        <p>Step 1: Explanation of the first step. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ac erat nec metus volutpat accumsan. Sed convallis purus id urna lacinia, in fermentum augue pulvinar.</p>
        <img src="/path/to/image2.jpg" alt="Process step 2" />
        <p>Step 2: Explanation of the second step. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ac erat nec metus volutpat accumsan. Sed convallis purus id urna lacinia, in fermentum augue pulvinar.</p>
        <img src="/path/to/image3.jpg" alt="Process step 3" />
        <p>Step 3: Explanation of the third step. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ac erat nec metus volutpat accumsan. Sed convallis purus id urna lacinia, in fermentum augue pulvinar.</p>
      </div>
      <footer>
        <p>&copy; 2023 LUC-A. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default MainPage;
