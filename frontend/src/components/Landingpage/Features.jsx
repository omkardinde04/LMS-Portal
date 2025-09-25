import React from 'react';
import '../Landingpage/css/Features.css';
import Image1 from './assets/Image1.png'
import Image2 from './assets/Image2.png'
import FeatureCard from './FeatureCard';

const Features = () => {
  return (
    <>
        <h1 className='feature-text-block'>Key Feature</h1>
        <div className="feature-card">
          <FeatureCard name="Feature1" logo={Image1} desc="hello"/>
          <FeatureCard name="Feature2" logo={Image2} desc="hello2"/>
        </div>
    </>
  );
};

export default Features;