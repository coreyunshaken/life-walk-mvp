import React, { useState } from 'react';
import { LifePoint, TrajectoryData, QuickCheckStep } from '../types';
import { analyzeTrajectory } from '../utils/analysis';
import './QuickTrajectoryCheck.css';

interface Props {
  onComplete: (data: TrajectoryData) => void;
  existingData?: TrajectoryData | null;
}

const QuickTrajectoryCheck: React.FC<Props> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentAge, setCurrentAge] = useState<number>(35);
  const [responses, setResponses] = useState<LifePoint[]>([]);
  const [currentResponse, setCurrentResponse] = useState('');

  const steps: QuickCheckStep[] = [
    {
      title: "Your Current Age",
      question: "First, how old are you now?",
      placeholder: "Enter your age"
    },
    {
      title: "Twenty Years Old",
      question: "At 20, what did you dream your life would become?",
      age: 20,
      placeholder: "I wanted to travel the world, start my own business, make a difference..."
    },
    {
      title: "Ten Years Ago",
      question: `Ten years ago (age ${currentAge - 10}), what was your focus?`,
      age: currentAge - 10,
      placeholder: "I was focused on my career, just got married, trying to establish myself..."
    },
    {
      title: "Today",
      question: `Today at ${currentAge}, where are you honestly?`,
      age: currentAge,
      placeholder: "I'm successful at work but exhausted, family is good but I have no time for myself..."
    },
    {
      title: "Ten Years From Now",
      question: `At ${currentAge + 10}, what do you want your life to look like?`,
      age: currentAge + 10,
      placeholder: "I want more freedom, time with family, pursuing passions, making an impact..."
    },
    {
      title: "Your Ideal Future",
      question: "At 80, looking back, what would make you proud of how you lived?",
      age: 80,
      placeholder: "That I took risks, loved deeply, made a difference, lived authentically..."
    }
  ];

  const handleNext = () => {
    if (currentStep === 0) {
      // Age input step
      const age = parseInt(currentResponse);
      if (isNaN(age) || age < 18 || age > 100) {
        alert('Please enter a valid age between 18 and 100');
        return;
      }
      setCurrentAge(age);
      setCurrentResponse('');
      setCurrentStep(1);
    } else {
      // Reflection steps
      if (currentResponse.trim().length < 10) {
        alert('Please share a bit more detail (at least 10 characters)');
        return;
      }

      const step = steps[currentStep];
      const newPoint: LifePoint = {
        age: step.age || currentAge,
        reflection: currentResponse,
        type: currentStep <= 3 ? (currentStep === 3 ? 'present' : 'past') : 'future'
      };

      const updatedResponses = [...responses, newPoint];
      setResponses(updatedResponses);
      setCurrentResponse('');

      if (currentStep === steps.length - 1) {
        // Complete the check
        completeCheck(updatedResponses);
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const completeCheck = (allResponses: LifePoint[]) => {
    const pastPoints = allResponses.filter(p => p.type === 'past');
    const presentPoint = allResponses.find(p => p.type === 'present')!;
    const futureDesires = allResponses.filter(p => p.type === 'future');

    const analysis = analyzeTrajectory(pastPoints, presentPoint, futureDesires);

    const trajectoryData: TrajectoryData = {
      pastPoints,
      presentPoint,
      futureDesires,
      analysis,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onComplete(trajectoryData);
  };

  const progress = ((currentStep) / steps.length) * 100;
  const currentStepData = steps[currentStep];

  return (
    <div className="quick-check card fade-in">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <h2>{currentStepData.title}</h2>
      <p className="question">{currentStepData.question}</p>

      {currentStep === 0 ? (
        <input
          type="number"
          value={currentResponse}
          onChange={(e) => setCurrentResponse(e.target.value)}
          placeholder={currentStepData.placeholder}
          min="18"
          max="100"
          autoFocus
        />
      ) : (
        <textarea
          value={currentResponse}
          onChange={(e) => setCurrentResponse(e.target.value)}
          placeholder={currentStepData.placeholder}
          autoFocus
        />
      )}

      <div className="button-group">
        {currentStep > 0 && (
          <button 
            onClick={() => {
              setCurrentStep(currentStep - 1);
              setCurrentResponse(responses[currentStep - 1]?.reflection || '');
              setResponses(responses.slice(0, -1));
            }}
            className="secondary"
          >
            Back
          </button>
        )}
        <button 
          onClick={handleNext}
          disabled={!currentResponse.trim()}
          className="primary"
        >
          {currentStep === steps.length - 1 ? 'See Your Trajectory' : 'Next'}
        </button>
      </div>

      <div className="step-indicator">
        Step {currentStep + 1} of {steps.length}
      </div>
    </div>
  );
};

export default QuickTrajectoryCheck;