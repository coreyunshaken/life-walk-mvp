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
  const [currentReflection, setCurrentReflection] = useState('');
  const [showExample, setShowExample] = useState(false);
  const [showCommitment, setShowCommitment] = useState(false);
  const [commitmentText, setCommitmentText] = useState('');

  // Extract Quick Check insights
  const gap = quickCheckData?.analysis?.gap || '';
  const patterns = quickCheckData?.analysis?.patterns || [];
  const costOfWaiting = quickCheckData?.analysis?.costOfWaiting || [];
  const isSignificantGap = gap.includes('SIGNIFICANT');
  const isEntrepreneurial = patterns.includes('Entrepreneurial');
  const hasFamily = patterns.includes('Family-oriented');

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
      // Combine personal and professional into integrated reflection
      const integrated = existing.personal.text || existing.professional.text || '';
      setCurrentReflection(integrated);
    } else {
      setCurrentReflection('');
    }
  }, [selectedAge, reflections]);

  const getIntegratedPrompt = (age: number): string => {
    const yearsDiff = age - currentAge;

    // Gap-aware prompts
    if (isSignificantGap && yearsDiff === 0) {
      return `Right now at ${age}, you're at a crossroads. Your current trajectory and desired future are heading in opposite directions. Describe where you are today and what needs to change immediately.`;
    }

    // Path divergence prompts
    if (isEntrepreneurial) {
      if (yearsDiff === 5) {
        return `Five years from now at ${age}, you're either 5 years into building your business or 5 years deeper in corporate life. Describe your ideal Tuesday - where are you working, who are you accountable to, and how does your family experience your career?`;
      }
      if (yearsDiff === 10) {
        return `At ${age}, a decade from today's choice point: Are you celebrating 10 years of business ownership or explaining why you never started? What story do ${hasFamily ? 'your teenagers' : 'people'} tell about your courage?`;
      }
      if (yearsDiff === 15) {
        return `At ${age}, you're ${hasFamily ? 'watching your kids launch their careers' : 'mid-career'}. What example have you set? Are you proof that dreams can be pursued, or a cautionary tale of playing it safe?`;
      }
      if (yearsDiff === 20) {
        return `Twenty years later at ${age}: You're either harvesting from the business you planted at ${currentAge}, or wondering why you never took the leap. What's your reality?`;
      }
      if (yearsDiff === 30) {
        return `At ${age}, approaching retirement: Are you transitioning YOUR business on your terms, or being retired from a job? What legacy are you creating versus what pension are you collecting?`;
      }
      if (yearsDiff === 40) {
        return `At ${age}, your grandchild asks: "What was your biggest life decision?" Do you tell them about the business you built starting at ${currentAge}, or explain why security felt safer than dreams?`;
      }
    }

    // General path-aware prompts
    if (yearsDiff === 5) {
      return `At ${age}, five years into your journey: What does your typical day look like? Where do you work, who depends on you, and what brings you energy versus exhaustion?`;
    }
    if (yearsDiff === 10) {
      return `A decade from now at ${age}: What have you built, what have you sacrificed, and what do you wish you'd started sooner?`;
    }
    if (yearsDiff === 20) {
      return `At ${age}, twenty years down this path: What fills you with pride and what triggers regret? How do others describe your journey?`;
    }
    if (yearsDiff >= 30) {
      return `At ${age}, reflecting on decades of choices: What would you tell your ${currentAge}-year-old self? What matters most and what never mattered at all?`;
    }

    return `At ${age}, describe your integrated life - where work, family, purpose, and joy intersect. What does a meaningful day look like?`;
  };

  const getCostReminder = (age: number): string | null => {
    const yearsDiff = age - currentAge;
    if (!isSignificantGap || costOfWaiting.length === 0) return null;

    if (yearsDiff === 5) {
      return `⚠️ Remember: ${costOfWaiting[0]}`;
    }
    if (yearsDiff === 10 && costOfWaiting.length > 1) {
      return `⚠️ Cost check: ${costOfWaiting[1]}`;
    }
    if (yearsDiff === 20 && costOfWaiting.length > 2) {
      return `⚠️ Twenty years later: ${costOfWaiting[2]}`;
    }
    return null;
  };

  const getPathIndicator = (age: number): string => {
    const completed = reflections.find(r => r.age === age);
    if (!completed) return '';

    const text = completed.personal.text || completed.professional.text || '';
    if (text.toLowerCase().includes('business') || text.toLowerCase().includes('consultancy') || text.toLowerCase().includes('own')) {
      return '🚀'; // Entrepreneurial path
    }
    if (text.toLowerCase().includes('corporate') || text.toLowerCase().includes('manager') || text.toLowerCase().includes('promotion')) {
      return '🏢'; // Corporate path
    }
    return '✓';
  };

  const handleSaveReflection = () => {
    if (!currentReflection.trim()) {
      alert('Please add your reflection for this age before continuing');
      return;
    }

    const newReflection: WalkReflection = {
      age: selectedAge,
      personal: {
        text: currentReflection,
        themes: extractThemes(currentReflection)
      },
      professional: {
        text: '', // Keeping structure for backward compatibility
        goals: extractGoals(currentReflection)
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
      setCurrentReflection(''); // Clear for next age
    } else {
      // All ages complete - show commitment screen
      setShowCommitment(true);
    }
  };

  const extractThemes = (text: string): string[] => {
    const themes = [];
    const lowerText = text.toLowerCase();
    if (lowerText.includes('family') || lowerText.includes('kids')) themes.push('Family');
    if (lowerText.includes('health') || lowerText.includes('fitness')) themes.push('Health');
    if (lowerText.includes('travel')) themes.push('Travel');
    if (lowerText.includes('relation') || lowerText.includes('marriage')) themes.push('Relationships');
    if (lowerText.includes('business') || lowerText.includes('entrepreneur')) themes.push('Business');
    if (lowerText.includes('freedom') || lowerText.includes('flexibility')) themes.push('Freedom');
    return themes;
  };

  const extractGoals = (text: string): string[] => {
    const goals = [];
    const lowerText = text.toLowerCase();
    if (lowerText.includes('business') || lowerText.includes('startup')) goals.push('Entrepreneurship');
    if (lowerText.includes('consult')) goals.push('Consulting');
    if (lowerText.includes('retire')) goals.push('Retirement Planning');
    if (lowerText.includes('financial')) goals.push('Financial Freedom');
    if (lowerText.includes('travel')) goals.push('Travel');
    if (lowerText.includes('mentor') || lowerText.includes('teach')) goals.push('Mentorship');
    return goals;
  };

  const handleCommitment = () => {
    if (!commitmentText.trim()) {
      alert('Please make a specific commitment before completing');
      return;
    }

    // Save commitment
    const commitment = {
      text: commitmentText,
      date: new Date().toISOString(),
      targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 1 week from now
    };
    saveToLocalStorage('lifeWalkCommitment', commitment);

    // Return to results with success message
    alert('Commitment saved! You\'ll be reminded to review your progress.');
    onBack();
  };

  const completionRate = Math.round((reflections.length / agePoints.length) * 100);

  // Commitment Screen
  if (showCommitment) {
    return (
      <div className="detailed-walk commitment-screen">
        <div className="card fade-in">
          <h2>🎯 Your Transformation Commitment</h2>

          <div className="journey-summary">
            <h3>Your Journey Vision:</h3>
            <div className="vision-path">
              {reflections.map(r => (
                <div key={r.age} className="vision-point">
                  <span className="age-marker">Age {r.age}:</span>
                  <span className="vision-text">{(r.personal.text || '').substring(0, 100)}...</span>
                </div>
              ))}
            </div>
          </div>

          {isSignificantGap && (
            <div className="urgency-reminder">
              <h3>⚠️ Remember Your Gap:</h3>
              <p>{gap}</p>
              {costOfWaiting.length > 0 && (
                <p className="cost-highlight">{costOfWaiting[0]}</p>
              )}
            </div>
          )}

          <div className="commitment-section">
            <h3>Based on this Life Walk, what will you do THIS WEEK?</h3>
            <p className="commitment-prompt">
              Be specific. Your {agePoints[agePoints.length - 1]}-year-old self is counting on what you do in the next 7 days.
            </p>

            <textarea
              value={commitmentText}
              onChange={(e) => setCommitmentText(e.target.value)}
              placeholder="This week I will... (be specific: who will you contact, what will you research, what will you decide?)"
              rows={4}
            />

            <div className="commitment-actions">
              <button onClick={handleCommitment} className="primary large">
                Make This Commitment
              </button>
              <button onClick={() => setShowCommitment(false)} className="secondary">
                Back to Reflections
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

        {/* Path Visualization */}
        {isSignificantGap && (
          <div className="path-reminder">
            <p className="gap-alert">
              ⚠️ You have a SIGNIFICANT GAP between your current trajectory and desired future.
              Each age you map is a choice point - which path will you choose?
            </p>
          </div>
        )}

        <div className="age-selector">
          <h3>Map Your Journey</h3>
          <div className="age-points">
            {agePoints.map(age => {
              const pathIcon = getPathIndicator(age);
              const isCompleted = reflections.find(r => r.age === age);
              return (
                <button
                  key={age}
                  className={`age-point ${selectedAge === age ? 'selected' : ''} ${isCompleted ? 'completed' : ''}`}
                  onClick={() => setSelectedAge(age)}
                >
                  <div className="age-label">
                    {age}
                    {age === currentAge && <span className="current-marker">NOW</span>}
                  </div>
                  {pathIcon && <span className="path-icon">{pathIcon}</span>}
                </button>
              );
            })}
          </div>
        </div>

        <div className="reflection-area">
          <h3>
            Age {selectedAge} Vision
            {selectedAge > currentAge && ` (${selectedAge - currentAge} years from now)`}
          </h3>

          {/* Cost Reminder */}
          {getCostReminder(selectedAge) && (
            <div className="cost-reminder">
              {getCostReminder(selectedAge)}
            </div>
          )}

          {/* Integrated Prompt */}
          <div className="integrated-prompt">
            <p className="prompt">{getIntegratedPrompt(selectedAge)}</p>
            <button
              onClick={() => setShowExample(true)}
              className="example-button"
              title="See an example reflection for guidance"
            >
              💡 See Example
            </button>
          </div>

          <textarea
            value={currentReflection}
            onChange={(e) => setCurrentReflection(e.target.value)}
            placeholder={`Describe your integrated life vision at age ${selectedAge}...`}
            rows={8}
            className="integrated-textarea"
          />

          <div className="input-actions">
            <button
              onClick={handleSaveReflection}
              className="primary"
            >
              Save & Continue
            </button>
            {selectedAge > currentAge && (
              <button
                onClick={() => {
                  const prevAge = agePoints[agePoints.indexOf(selectedAge) - 1];
                  if (prevAge) setSelectedAge(prevAge);
                }}
                className="secondary"
              >
                Previous Age
              </button>
            )}
          </div>
        </div>

        {/* Journey Sidebar */}
        {reflections.length > 0 && (
          <div className="journey-sidebar">
            <h4>Your Journey So Far</h4>
            {reflections.map(r => (
              <div key={r.age} className="journey-entry">
                <div className="journey-age">Age {r.age}</div>
                <div className="journey-text">
                  {(r.personal.text || '').substring(0, 100)}...
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showExample && (
        <ExampleModal
          age={selectedAge}
          type="integrated"
          onClose={() => setShowExample(false)}
        />
      )}
    </div>
  );
};

export default DetailedLifeWalk;