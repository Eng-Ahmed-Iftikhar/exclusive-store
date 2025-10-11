import React from 'react';

import BasicInfoView from '@/views/app/contents/products/BasicInfoView';
import StepLayout from '@/sections/app/contents/products/StepLayout';

const BasicInfoPage: React.FC = () => {
  console.log('BasicInfoPage');
  return (
    <StepLayout
      currentStep={1}
      title="Product Basic Information"
      description="Enter the essential details about your product"
    >
      <BasicInfoView />
    </StepLayout>
  );
};

export default BasicInfoPage;
