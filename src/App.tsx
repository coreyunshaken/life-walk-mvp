import React, { useState, useEffect } from 'react';
import QuickTrajectoryCheck from './components/QuickTrajectoryCheck';
import DetailedLifeWalk from './components/DetailedLifeWalk';
import TrajectoryVisualization from './components/TrajectoryVisualization';
import { TrajectoryData, Phase } from './types';
import { saveToLocalStorage, loadFromLocalStorage } from './utils/storage';
import './App.css';

function App() {
  const [phase, setPhase] = useState<Phase>('welcome');
  const [trajectoryData, setTrajectoryData] = useState<TrajectoryData | null>(null);
  const [hasCompletedQuickCheck, setHasCompletedQuickCheck] = useState(false);

  useEffect(() => {
    // Load any saved data on mount
    const savedData = loadFromLocalStorage('trajectoryData');
    if (savedData) {
      setTrajectoryData(savedData);
      setHasCompletedQuickCheck(true);
    }
  }, []);

  const handleQuickCheckComplete = (data: TrajectoryData) => {
    setTrajectoryData(data);
    saveToLocalStorage('trajectoryData', data);
    setHasCompletedQuickCheck(true);
    setPhase('results');
  };

  const handleStartDetailedWalk = () => {
    setPhase('detailed');
  };

  const handleReset = () => {
    if (confirm('This will clear all your data. Are you sure?')) {
      localStorage.clear();
      setTrajectoryData(null);
      setHasCompletedQuickCheck(false);
      setPhase('welcome');
    }
  };

  const loadSampleData = () => {
    const sampleQuickCheckData = {
      pastPoints: [
        {
          age: 25,
          reflection: "Just graduated college, working at a startup, living with roommates. Focused on learning and gaining experience. Dating casually, lots of social activities.",
          type: 'past' as const
        }
      ],
      presentPoint: {
        age: 35,
        reflection: "Marketing manager at mid-size company. Married with 2 young kids. Bought our first house. Always busy but feeling stuck professionally. Want more family time but need to advance career.",
        type: 'present' as const
      },
      futureDesires: [
        {
          age: 45,
          reflection: "Leading my own marketing consultancy. Kids are older and more independent. Travel more with family. Have financial freedom and flexibility to choose my projects.",
          type: 'future' as const
        }
      ],
      analysis: {
        currentPath: "Based on your current pattern, you'll likely continue climbing the corporate ladder but remain in employee roles. You'll gain experience and steady income, but may sacrifice family time and entrepreneurial dreams. By 45, you'll probably be a senior marketing director, financially comfortable but potentially feeling trapped in corporate structure.",
        desiredPath: "You want to break free from corporate constraints and build your own business. Your vision includes entrepreneurial success, work-life integration, financial independence, and the ability to prioritize family while building something meaningful.",
        gap: "SIGNIFICANT GAP DETECTED: Your current corporate trajectory conflicts directly with your entrepreneurial aspirations. Without deliberate action, you'll remain in employee mindset while your business dreams fade.",
        patterns: ["Corporate Comfort Zone", "Family vs Career Tension", "Entrepreneurial Ambition", "Time Scarcity"],
        actionNeeded: "You need to start building entrepreneurial skills NOW. Begin freelance consulting on weekends, build a professional network, save 6-months expenses, and create a transition plan. Every month you wait makes the gap bigger."
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const sampleDetailedWalk = [
      {
        age: 35,
        personal: {
          text: "Right now I'm juggling motherhood with career ambitions. I love my kids deeply but feel overwhelmed trying to be present for them while also advancing professionally. My marriage is strong but we're both exhausted. We bought our dream home but barely have time to enjoy it. I miss having personal time for hobbies and friendships.",
          themes: ["Family", "Relationships", "Health"]
        },
        professional: {
          text: "I'm a marketing manager leading a team of 5 people. I've been promoted twice in 3 years and have good performance reviews. However, I feel like I'm hitting a ceiling in corporate structure. I want more creative control and the ability to choose my projects. I dream of starting my own consultancy but it feels risky with kids and mortgage.",
          goals: ["Career Growth", "Entrepreneurship"]
        },
        timestamp: "2024-09-01T10:00:00Z"
      },
      {
        age: 40,
        personal: {
          text: "In 5 years, I want my kids (ages 10 and 8) to see me as someone who pursued her dreams. I want family dinners without work stress, weekend trips without checking emails, and time for myself to exercise and read. I want to model work-life integration for my children, not the frantic juggling I'm doing now.",
          themes: ["Family", "Health", "Relationships"]
        },
        professional: {
          text: "I want to have my marketing consultancy established with 3-5 regular clients. I should be earning 150% of my current salary but with flexible hours. I want to specialize in helping small businesses grow their brand. I'll have a home office and maybe one virtual assistant. No more corporate politics or pointless meetings.",
          goals: ["Entrepreneurship", "Skill Development"]
        },
        timestamp: "2024-09-01T10:05:00Z"
      },
      {
        age: 45,
        personal: {
          text: "My teenagers are becoming independent young adults. I want to be their trusted advisor, not the stressed mom they remember from their childhood. I want to travel internationally with my husband - we've talked about visiting Italy and Japan. I want to be physically fit and mentally sharp, taking care of my health proactively.",
          themes: ["Family", "Travel", "Health"]
        },
        professional: {
          text: "My consultancy should be thriving with a waiting list of clients. I want to be known as an expert in my field, maybe speaking at conferences or writing a book about marketing for small businesses. I'll have multiple revenue streams and the freedom to take on passion projects. Considering selling courses online.",
          goals: ["Entrepreneurship", "Skill Development", "Consulting"]
        },
        timestamp: "2024-09-01T10:10:00Z"
      },
      {
        age: 50,
        personal: {
          text: "My children are launching their own careers. I want to be someone they're proud of - someone who took risks and built something meaningful. I want to mentor other women making career transitions. I want to be financially secure enough to help my kids with college without stress. More travel and new hobbies.",
          themes: ["Family", "Travel"]
        },
        professional: {
          text: "I want to have built something bigger than just me. Maybe I'll have a small team of consultants working with me, or I'll have created a course that helps hundreds of businesses. I want passive income streams and the option to work only on projects I'm passionate about. Considering writing that book.",
          goals: ["Entrepreneurship", "Consulting"]
        },
        timestamp: "2024-09-01T10:15:00Z"
      },
      {
        age: 55,
        personal: {
          text: "I want to be the cool aunt/grandparent figure who has time for family and friends. I want to have maintained my health and vitality. I want to pursue creative hobbies I never had time for - maybe pottery or painting. I want a rich social life and deep friendships. Travel extensively.",
          themes: ["Family", "Health", "Travel", "Hobbies"]
        },
        professional: {
          text: "I want to be in a position to choose. Maybe I'll still be consulting on select projects, or maybe I'll transition to teaching/mentoring. I want my business to be sellable if I choose, or running smoothly enough that I can step back. Financial freedom to work by choice, not necessity.",
          goals: ["Retirement Planning", "Consulting"]
        },
        timestamp: "2024-09-01T10:20:00Z"
      },
      {
        age: 60,
        personal: {
          text: "I want to be enjoying grandchildren if my kids choose to have families. I want to be healthy and active enough to keep up with them. I want to have deep, meaningful friendships and be known as someone who lived authentically. I want to feel proud of the risks I took and the life I built.",
          themes: ["Family", "Health", "Relationships"]
        },
        professional: {
          text: "I want to be mentoring the next generation of female entrepreneurs. Maybe through formal programs or writing/speaking. I want to feel like I made a difference in other people's careers. Financial security should allow me to be selective about my time and energy.",
          goals: ["Retirement Planning", "Consulting"]
        },
        timestamp: "2024-09-01T10:25:00Z"
      },
      {
        age: 65,
        personal: {
          text: "I want to be in my prime grandparent years, creating magical memories with grandchildren. I want to be the grandmother who takes them on adventures and teaches them about courage and following dreams. I want to have maintained strong friendships and be actively involved in my community. Regular travel with my husband to places we've always dreamed of visiting.",
          themes: ["Family", "Travel", "Relationships"]
        },
        professional: {
          text: "I want to be officially 'retired' from daily business operations but still passionate about occasional speaking engagements or mentoring select entrepreneurs. Maybe I've written that book and it's helping women transition careers. I want to feel complete pride in what I built and the lives I've impacted through my work.",
          goals: ["Retirement Planning", "Consulting"]
        },
        timestamp: "2024-09-01T10:30:00Z"
      },
      {
        age: 70,
        personal: {
          text: "I want to be a vibrant, wise elder who friends and family seek out for advice. I want to be deeply connected to nature - maybe we have a garden or cottage by the sea. I want to have mastered those creative hobbies I started and be sharing them with others. Strong health, active lifestyle, and peaceful contentment with the life I've lived.",
          themes: ["Family", "Health", "Hobbies", "Relationships"]
        },
        professional: {
          text: "My professional legacy should be complete. Maybe there's a scholarship fund or foundation in my name helping women entrepreneurs. I want to be known for having made a real difference in how women approach career transitions. Completely free from financial worry, able to focus entirely on what brings me joy.",
          goals: ["Retirement Planning"]
        },
        timestamp: "2024-09-01T10:35:00Z"
      },
      {
        age: 75,
        personal: {
          text: "I want to be surrounded by love - children, grandchildren, great-grandchildren if blessed with them, dear friends who've journeyed with me. I want to be someone younger women look up to as an example of authentic living. I want to have maintained my mental sharpness and still be learning new things. At peace with my choices and grateful for every risk I took.",
          themes: ["Family", "Health", "Relationships"]
        },
        professional: {
          text: "My work life should be a beautiful memory - something I'm deeply proud of but no longer actively involved in. I want younger entrepreneurs to still reference lessons I taught or principles I shared. Complete fulfillment knowing I lived my professional life with purpose and helped others do the same.",
          goals: ["Retirement Planning"]
        },
        timestamp: "2024-09-01T10:40:00Z"
      }
    ];

    localStorage.setItem('trajectoryData', JSON.stringify(sampleQuickCheckData));
    localStorage.setItem('detailedWalk', JSON.stringify(sampleDetailedWalk));
    setTrajectoryData(sampleQuickCheckData);
    setHasCompletedQuickCheck(true);
    setPhase('results');
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Life Walk</h1>
        <p className="tagline">See where you're headed. Change your path.</p>
      </header>

      <main className="app-main">
        {phase === 'welcome' && (
          <div className="card fade-in">
            <h2>Welcome to Your Life Walk</h2>
            <p className="intro-text">
              Most people drift through life, assuming their future will somehow be different 
              from their past. But without conscious change, we tend to repeat our patterns.
            </p>
            <p className="intro-text">
              Take 10 minutes to see where your current path is really leading you.
            </p>
            
            <div className="button-group">
              <button onClick={() => setPhase('quickCheck')} className="primary">
                Start Your Life Check
              </button>
              {hasCompletedQuickCheck && (
                <button onClick={() => setPhase('results')} className="secondary">
                  View Previous Results
                </button>
              )}
            </div>
            
          </div>
        )}

        {phase === 'quickCheck' && (
          <QuickTrajectoryCheck 
            onComplete={handleQuickCheckComplete}
            existingData={trajectoryData}
          />
        )}

        {phase === 'results' && trajectoryData && (
          <>
            <TrajectoryVisualization data={trajectoryData} />
            <div className="card fade-in">
              <h2>Ready to Go Deeper?</h2>
              <p>
                Now that you see the gap, let's map out your path to change it. 
                The full Life Walk experience helps you envision and plan each step of your journey.
              </p>
              <div className="button-group">
                <button onClick={handleStartDetailedWalk} className="primary">
                  Start Full Life Walk
                </button>
                <button onClick={() => setPhase('quickCheck')} className="secondary">
                  Retake Quick Check
                </button>
                <button onClick={handleReset} className="secondary">
                  Start Over
                </button>
              </div>
            </div>
          </>
        )}

        {phase === 'detailed' && (
          <DetailedLifeWalk 
            quickCheckData={trajectoryData}
            onBack={() => setPhase('results')}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>© 2024 Life Walk - Your journey to intentional living</p>
      </footer>
    </div>
  );
}

export default App;