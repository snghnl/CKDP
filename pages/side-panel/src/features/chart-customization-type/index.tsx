import React, { useState } from 'react';
import Tabs from './components/Tabs';
import ChartPreview from './ChartPreview';
import type { ChartType } from '@shared/utils/shared-types';

const ChartCustomizationType: React.FC = () => {
  const [selectedType, setSelectedType] = useState<ChartType>('bar');

  return (
    <div className="p-4">
      <Tabs selected={selectedType} onSelect={setSelectedType} />
      <div className="mt-4">
        <ChartPreview selectedType={selectedType} />
      </div>
    </div>
  );
};

export default ChartCustomizationType;
