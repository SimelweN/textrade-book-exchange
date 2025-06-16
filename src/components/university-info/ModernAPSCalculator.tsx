import React from "react";
import ModernAPSCalculatorFixed from "./ModernAPSCalculatorFixed";

// This is a wrapper to maintain backward compatibility
// The actual working calculator is in ModernAPSCalculatorFixed
const ModernAPSCalculator: React.FC = () => {
  return <ModernAPSCalculatorFixed />;
};

export default ModernAPSCalculator;
