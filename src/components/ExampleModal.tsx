import React from 'react';
import './ExampleModal.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  age: number;
  type: 'personal' | 'professional';
}

const ExampleModal: React.FC<Props> = ({ isOpen, onClose, age, type }) => {
  if (!isOpen) return null;

  const getExampleContent = (age: number, type: 'personal' | 'professional') => {
    const examples = {
      25: {
        personal: "Just graduated college, working at a startup, living with roommates. Focused on learning and gaining experience. Dating casually, lots of social activities. Full of energy but also anxious about the future - everyone else seems to have it figured out.",
        professional: "Entry-level marketing coordinator at a tech startup. Learning everything from social media to event planning. Long hours but exciting to be part of building something. Salary is low but getting great experience and mentorship from my manager."
      },
      35: {
        personal: "Right now I'm juggling motherhood with career ambitions. I love my kids deeply but feel overwhelmed trying to be present for them while also advancing professionally. My marriage is strong but we're both exhausted. We bought our dream home but barely have time to enjoy it. I miss having personal time for hobbies and friendships.",
        professional: "I'm a marketing manager leading a team of 5 people. I've been promoted twice in 3 years and have good performance reviews. However, I feel like I'm hitting a ceiling in corporate structure. I want more creative control and the ability to choose my projects. I dream of starting my own consultancy but it feels risky with kids and mortgage."
      },
      40: {
        personal: "In 5 years, I want my kids (ages 10 and 8) to see me as someone who pursued her dreams. I want family dinners without work stress, weekend trips without checking emails, and time for myself to exercise and read. I want to model work-life integration for my children, not the frantic juggling I'm doing now.",
        professional: "I want to have my marketing consultancy established with 3-5 regular clients. I should be earning 150% of my current salary but with flexible hours. I want to specialize in helping small businesses grow their brand. I'll have a home office and maybe one virtual assistant. No more corporate politics or pointless meetings."
      },
      45: {
        personal: "Leading my own marketing consultancy. Kids are older and more independent. I want to travel more with family - taking those trips we always talked about. I want to have financial freedom and the flexibility to choose my projects. I want to be present for my teenagers in a way I couldn't when they were young because I was so career-focused.",
        professional: "My consultancy should be thriving with a waiting list of clients. I want to be known as an expert in my field, maybe speaking at conferences or writing a book about marketing for small businesses. I'll have multiple revenue streams and the freedom to take on passion projects. Considering selling courses online."
      },
      50: {
        personal: "My children are launching their own careers. I want to be someone they're proud of - someone who took risks and built something meaningful. I want to mentor other women making career transitions. I want to be financially secure enough to help my kids with college without stress. More travel and new hobbies.",
        professional: "I want to have built something bigger than just me. Maybe I'll have a small team of consultants working with me, or I'll have created a course that helps hundreds of businesses. I want passive income streams and the option to work only on projects I'm passionate about. Considering writing that book."
      }
    };

    return examples[age as keyof typeof examples]?.[type] || "Example not available for this age.";
  };

  const exampleText = getExampleContent(age, type);

  return (
    <div className="example-modal-overlay" onClick={onClose}>
      <div className="example-modal" onClick={(e) => e.stopPropagation()}>
        <div className="example-modal-header">
          <h3>Example: Sarah's {type} reflection at age {age}</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="example-modal-content">
          <div className="example-text">
            "{exampleText}"
          </div>
          
          <div className="example-note">
            <p><strong>Notice:</strong> Sarah shares specific details, internal conflicts, and honest emotions. This level of vulnerability helps create the meaningful gap analysis that makes Life Walk impactful.</p>
          </div>
        </div>
        
        <div className="example-modal-footer">
          <button onClick={onClose} className="primary">
            Got it, let me write mine
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExampleModal;