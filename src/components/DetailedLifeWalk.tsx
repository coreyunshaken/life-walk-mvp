import React, { useState, useEffect } from 'react';
import { TrajectoryData, WalkReflection } from '../types';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/storage';
import ExampleModal from './ExampleModal';
import './DetailedLifeWalk.css';

interface Props {
  quickCheckData?: TrajectoryData | null;
  onBack: () => void;
}

const DetailedLifeWalk: React.FC<Props> = ({ quickCheckData, onBack }) => {
  const currentAge = quickCheckData?.presentPoint.age || 35;
  const [selectedAge, setSelectedAge] = useState(currentAge);
  const [reflections, setReflections] = useState<WalkReflection[]>([]);
  const [currentReflection, setCurrentReflection] = useState({
    personal: '',
    professional: ''
  });
  const [activeTab, setActiveTab] = useState<'personal' | 'professional'>('personal');
  const [showExample, setShowExample] = useState(false);

  // Generate age points in 5-year increments
  const agePoints: number[] = [];
  for (let age = currentAge; age <= Math.min(currentAge + 40, 90); age += 5) {
    agePoints.push(age);
  }

  useEffect(() => {
    // Load saved reflections
    const saved = loadFromLocalStorage('detailedWalk');
    if (saved) {
      setReflections(saved);
    }
  }, []);

  useEffect(() => {
    // Load reflection for selected age if it exists
    const existing = reflections.find(r => r.age === selectedAge);
    if (existing) {
      setCurrentReflection({
        personal: existing.personal.text || '',
        professional: existing.professional.text || ''
      });
    } else {
      setCurrentReflection({ personal: '', professional: '' });
    }
  }, [selectedAge, reflections]);

  const handleSaveReflection = () => {
    if (!currentReflection.personal && !currentReflection.professional) {
      alert('Please add at least one reflection (personal or professional)');
      return;
    }

    const newReflection: WalkReflection = {
      age: selectedAge,
      personal: {
        text: currentReflection.personal,
        themes: extractThemes(currentReflection.personal)
      },
      professional: {
        text: currentReflection.professional,
        goals: extractGoals(currentReflection.professional)
      },
      timestamp: new Date().toISOString()
    };

    const updatedReflections = [
      ...reflections.filter(r => r.age !== selectedAge),
      newReflection
    ].sort((a, b) => a.age - b.age);

    setReflections(updatedReflections);
    saveToLocalStorage('detailedWalk', updatedReflections);

    // Move to next age
    const nextAge = agePoints.find(age => age > selectedAge);
    if (nextAge) {
      setSelectedAge(nextAge);
    }
  };

  const extractThemes = (text: string): string[] => {
    const themes = [];
    if (text.toLowerCase().includes('family')) themes.push('Family');
    if (text.toLowerCase().includes('health')) themes.push('Health');
    if (text.toLowerCase().includes('travel')) themes.push('Travel');
    if (text.toLowerCase().includes('relation')) themes.push('Relationships');
    if (text.toLowerCase().includes('hobby') || text.toLowerCase().includes('passion')) themes.push('Hobbies');
    return themes;
  };

  const extractGoals = (text: string): string[] => {
    const goals = [];
    if (text.toLowerCase().includes('promotion') || text.toLowerCase().includes('advance')) goals.push('Career Growth');
    if (text.toLowerCase().includes('business') || text.toLowerCase().includes('startup')) goals.push('Entrepreneurship');
    if (text.toLowerCase().includes('retire')) goals.push('Retirement Planning');
    if (text.toLowerCase().includes('learn') || text.toLowerCase().includes('skill')) goals.push('Skill Development');
    if (text.toLowerCase().includes('consult')) goals.push('Consulting');
    return goals;
  };

  const getPrompt = (age: number, type: 'personal' | 'professional') => {
    const yearsDiff = age - currentAge;
    
    if (type === 'personal') {
      if (yearsDiff === 0) return "Right now, what's happening in your personal life?";
      if (yearsDiff <= 10) return `In ${yearsDiff} years, what do you want your personal life to look like?`;
      if (yearsDiff <= 20) return `${yearsDiff} years from now, how do you envision your relationships and personal fulfillment?`;
      return `At ${age}, what legacy do you want to be building personally?`;
    } else {
      if (yearsDiff === 0) return "Currently, where are you professionally?";
      if (yearsDiff <= 10) return `In ${yearsDiff} years, what professional milestones do you want to achieve?`;
      if (yearsDiff <= 20) return `${yearsDiff} years ahead, what impact do you want to make professionally?`;
      return `At ${age}, what professional legacy are you creating?`;
    }
  };

  const completionRate = Math.round((reflections.length / agePoints.length) * 100);

  return (
    <div className="detailed-walk">
      <div className="card fade-in">
        <div className="walk-header">
          <button onClick={onBack} className="back-button">← Back</button>
          <h2>Your Detailed Life Walk</h2>
          <div className="completion-indicator">
            {completionRate}% Complete
          </div>
        </div>

        <div className="age-selector">
          <h3>Select Your Age Point</h3>
          <div className="age-points">
            {agePoints.map(age => (
              <button
                key={age}
                className={`age-point ${selectedAge === age ? 'selected' : ''} ${
                  reflections.find(r => r.age === age) ? 'completed' : ''
                }`}
                onClick={() => setSelectedAge(age)}
              >
                {age}
                {age === currentAge && <span className="current-marker">NOW</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="reflection-area">
          <h3>
            Age {selectedAge} Reflection
            {selectedAge > currentAge && ` (${selectedAge - currentAge} years from now)`}
          </h3>

          <div className="tabs">
            <button
              className={`tab ${activeTab === 'personal' ? 'active' : ''}`}
              onClick={() => setActiveTab('personal')}
            >
              Personal Life
            </button>
            <button
              className={`tab ${activeTab === 'professional' ? 'active' : ''}`}
              onClick={() => setActiveTab('professional')}
            >
              Professional Life
            </button>
          </div>

          <div className="reflection-input">
            <div className="prompt-with-example">
              <p className="prompt">{getPrompt(selectedAge, activeTab)}</p>
              <button 
                onClick={() => setShowExample(true)}
                className="example-button"
                title="See an example reflection for guidance"
              >
                💡 See Example
              </button>
            </div>
            
            <textarea
              value={activeTab === 'personal' ? currentReflection.personal : currentReflection.professional}
              onChange={(e) => setCurrentReflection({
                ...currentReflection,
                [activeTab]: e.target.value
              })}
              placeholder={`Share your ${activeTab} vision for age ${selectedAge}...`}
              rows={6}
            />

            <div className="input-actions">
              <button 
                onClick={handleSaveReflection}
                className="primary"
              >
                Save & Continue
              </button>
              
              {/* Voice recording placeholder */}
              <button 
                className="secondary"
                onClick={() => alert('Voice recording coming in next version!')}
              >
                🎤 Record Instead
              </button>
            </div>
          </div>
        </div>

        {reflections.length > 0 && (
          <div className="reflections-summary">
            <h3>Your Journey So Far</h3>
            <div className="reflection-timeline">
              {reflections.map((reflection, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-age">Age {reflection.age}</div>
                  <div className="timeline-content">
                    {reflection.personal.text && (
                      <div className="timeline-text personal">
                        <strong>Personal:</strong> {reflection.personal.text.substring(0, 100)}...
                      </div>
                    )}
                    {reflection.professional.text && (
                      <div className="timeline-text professional">
                        <strong>Professional:</strong> {reflection.professional.text.substring(0, 100)}...
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <ExampleModal
        isOpen={showExample}
        onClose={() => setShowExample(false)}
        age={selectedAge}
        type={activeTab}
      />
    </div>
  );
};

export default DetailedLifeWalk;