import React from 'react';
import './ExampleModal.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  age: number;
  type: 'personal' | 'professional' | 'integrated';
}

const ExampleModal: React.FC<Props> = ({ isOpen, onClose, age, type }) => {
  if (!isOpen) return null;

  const getExampleContent = (age: number, type: 'personal' | 'professional' | 'integrated') => {
    const examples = {
      25: {
        personal: "Just graduated college, working at a startup, living with roommates. Focused on learning and gaining experience. Dating casually, lots of social activities. Full of energy but also anxious about the future - everyone else seems to have it figured out.",
        professional: "Entry-level marketing coordinator at a tech startup. Learning everything from social media to event planning. Long hours but exciting to be part of building something. Salary is low but getting great experience and mentorship from my manager.",
        integrated: "Fresh out of college, I'm working as a marketing coordinator at a tech startup while living with roommates in the city. My typical Tuesday involves social media planning in the morning, event coordination calls, and going out with friends after work. I'm dating casually and building my professional network constantly. I have unlimited energy and ambition, dreaming of maybe starting my own company someday, but also feeling overwhelmed by how much everyone else seems to have figured out. I'm learning everything from social media to event planning, working long hours but excited to be part of building something. My salary is low but I'm getting incredible experience and mentorship. I feel like I have unlimited potential ahead of me."
      },
      35: {
        personal: "Right now I'm juggling motherhood with career ambitions. I love my kids deeply but feel overwhelmed trying to be present for them while also advancing professionally. My marriage is strong but we're both exhausted. We bought our dream home but barely have time to enjoy it. I miss having personal time for hobbies and friendships.",
        professional: "I'm a marketing manager leading a team of 5 people. I've been promoted twice in 3 years and have good performance reviews. However, I feel like I'm hitting a ceiling in corporate structure. I want more creative control and the ability to choose my projects. I dream of starting my own consultancy but it feels risky with kids and mortgage.",
        integrated: "Right now at 35, I'm at a crossroads where my current corporate trajectory and my entrepreneurial dreams are heading in opposite directions. I'm juggling motherhood with career ambitions - leading a team of 5 at my marketing job while dreaming of my own consultancy. My typical Tuesday involves back-to-back meetings, school pickups, and checking emails after the kids go to bed. My family experiences my career as constant stress and divided attention. I love my children deeply but feel overwhelmed trying to be present for them while climbing the corporate ladder. My marriage is strong but we're both exhausted from the grind. We bought our dream home but barely have time to enjoy it. I miss having personal time for hobbies and friendships. Professionally, I feel like I'm hitting a ceiling in corporate structure - I want creative control and the ability to choose my projects, but starting my own business feels impossibly risky with kids and mortgage."
      },
      40: {
        personal: "In 5 years, I want my kids (ages 10 and 8) to see me as someone who pursued her dreams. I want family dinners without work stress, weekend trips without checking emails, and time for myself to exercise and read. I want to model work-life integration for my children, not the frantic juggling I'm doing now.",
        professional: "I want to have my marketing consultancy established with 3-5 regular clients. I should be earning 150% of my current salary but with flexible hours. I want to specialize in helping small businesses grow their brand. I'll have a home office and maybe one virtual assistant. No more corporate politics or pointless meetings.",
        integrated: "Five years from now at 40, I'm either 5 years into building my marketing consultancy or 5 years deeper in corporate life. In my ideal vision, I've built a thriving consultancy with 4-5 regular clients, earning 150% of my corporate salary with flexible hours. My typical Tuesday now involves working from my home office, picking up my kids (ages 10 and 8) without stress, and having family dinners where I'm truly present. My children see me as someone who pursued her dreams rather than someone who talked about 'someday.' I specialize in helping small businesses grow their brand, with one virtual assistant handling admin work. My family experiences my career as energizing rather than draining - I model work-life integration instead of frantic juggling. I have time for exercise, reading, and maintaining friendships. No more corporate politics, pointless meetings, or checking emails after bedtime. My marriage is stronger because I'm fulfilled professionally and present personally."
      },
      45: {
        personal: "Leading my own marketing consultancy. Kids are older and more independent. I want to travel more with family - taking those trips we always talked about. I want to have financial freedom and the flexibility to choose my projects. I want to be present for my teenagers in a way I couldn't when they were young because I was so career-focused.",
        professional: "My consultancy should be thriving with a waiting list of clients. I want to be known as an expert in my field, maybe speaking at conferences or writing a book about marketing for small businesses. I'll have multiple revenue streams and the freedom to take on passion projects. Considering selling courses online.",
        integrated: "At 45, a decade from today's choice point, I'm celebrating 10 years of business ownership rather than explaining why I never started. My teenagers (15 and 13) tell their friends about their mom who had the courage to build something meaningful. My consultancy is thriving with a waiting list of clients, and I'm known as an expert who speaks at conferences and is writing a book about marketing for small businesses. I have multiple revenue streams including online courses, giving me freedom to take on passion projects. My typical day involves client strategy calls in the morning, being present for my teenagers' after-school activities, and traveling internationally with my husband - we've finally visited Italy and Japan. I'm physically fit and mentally sharp because I prioritized my health throughout the business-building years. My children's friends see me as the 'cool mom' who pursued her dreams and made it work. My marriage is stronger than ever because we built this dream together rather than just surviving corporate stress."
      },
      50: {
        personal: "My children are launching their own careers. I want to be someone they're proud of - someone who took risks and built something meaningful. I want to mentor other women making career transitions. I want to be financially secure enough to help my kids with college without stress. More travel and new hobbies.",
        professional: "I want to have built something bigger than just me. Maybe I'll have a small team of consultants working with me, or I'll have created a course that helps hundreds of businesses. I want passive income streams and the option to work only on projects I'm passionate about. Considering writing that book.",
        integrated: "At 50, I'm watching my children (20 and 18) launch their careers, and they're proud to tell people about their mom who took risks and built something meaningful. I've proven that dreams can be pursued, not just talked about. My consultancy has evolved into something bigger than just me - I have a small team of consultants and online courses that help hundreds of businesses. I'm mentoring other women making corporate-to-entrepreneur transitions through formal programs. My book 'The Marketing Mom's Guide to Business Freedom' is helping women across the country. I have multiple passive income streams that let me choose only passion projects. I'm financially secure enough to help my kids with college without stress, and I'm exploring new creative hobbies like pottery and painting. My marriage continues to thrive as we enter this new phase of life with grown children. I travel extensively, both for speaking engagements and pure pleasure."
      }
    };

    return examples[age as keyof typeof examples]?.[type] || "Example not available for this age.";
  };

  const exampleText = getExampleContent(age, type);

  return (
    <div className="example-modal-overlay" onClick={onClose}>
      <div className="example-modal" onClick={(e) => e.stopPropagation()}>
        <div className="example-modal-header">
          <h3>Example: Sarah's {type === 'integrated' ? 'integrated life vision' : `${type} reflection`} at age {age}</h3>
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