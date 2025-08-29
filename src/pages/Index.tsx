import { useState } from "react";
import ClassSelection from "@/components/ClassSelection";
import StockMarket from "@/components/StockMarket";

const Index = () => {
  const [selectedClass, setSelectedClass] = useState<'9A' | '9B' | null>(null);

  const handleSelectClass = (classId: '9A' | '9B') => {
    setSelectedClass(classId);
  };

  const handleBack = () => {
    setSelectedClass(null);
  };

  if (selectedClass) {
    return <StockMarket classId={selectedClass} onBack={handleBack} />;
  }

  return <ClassSelection onSelectClass={handleSelectClass} />;
};

export default Index;
