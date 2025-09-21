import { LifePoint, TrajectoryAnalysis } from '../types';

export const analyzeTrajectory = (
  pastPoints: LifePoint[],
  presentPoint: LifePoint,
  futureDesires: LifePoint[]
): TrajectoryAnalysis => {
  // Extract patterns from past to present
  const patterns = extractPatterns(pastPoints, presentPoint);

  // Project future based on current trajectory
  const currentPath = projectCurrentPath(patterns, presentPoint);

  // Extract desired future state
  const desiredPath = extractDesiredPath(futureDesires);

  // Calculate the gap using raw user input
  const gap = calculateGap(currentPath, desiredPath, pastPoints, presentPoint, futureDesires);

  // Determine action needed
  const actionNeeded = determineAction(gap, patterns);

  // Calculate cost of waiting
  const costOfWaiting = calculateCostOfWaiting(presentPoint, futureDesires, patterns);

  return {
    currentPath,
    desiredPath,
    gap,
    actionNeeded,
    patterns,
    costOfWaiting
  };
};

const extractPatterns = (pastPoints: LifePoint[], presentPoint: LifePoint): string[] => {
  const patterns: string[] = [];

  // Look for common themes across all reflections
  const allReflections = [...pastPoints, presentPoint].map(p => p.reflection.toLowerCase());
  const allText = allReflections.join(' ');

  // Career focus - look for career/work mentions
  if (allText.includes('work') || allText.includes('career') || allText.includes('job') || allText.includes('professional')) {
    patterns.push('Career-focused');
  }

  // Time constraints - look for time pressure indicators
  if (allText.includes('busy') || allText.includes('no time') || allText.includes('overwhelmed') ||
      allText.includes('exhausted') || allText.includes('juggling') || allText.includes('always')) {
    patterns.push('Time-constrained');
  }

  // Family oriented - look for family mentions
  if (allText.includes('family') || allText.includes('kids') || allText.includes('children') ||
      allText.includes('spouse') || allText.includes('married') || allText.includes('parent')) {
    patterns.push('Family-oriented');
  }

  // Risk averse - look for safety/stuck indicators
  if (allText.includes('stuck') || allText.includes('safe') || allText.includes('secure') ||
      allText.includes('trapped') || allText.includes('comfortable') || allText.includes('playing it safe')) {
    patterns.push('Risk-averse');
  }

  // Entrepreneurial aspirations - look for business/independence desires
  if (allText.includes('business') || allText.includes('consultancy') || allText.includes('entrepreneur') ||
      allText.includes('own') || allText.includes('freedom') || allText.includes('flexible')) {
    patterns.push('Entrepreneurial');
  }

  // Achievement driven - look for success/ambition indicators
  if (allText.includes('success') || allText.includes('achieve') || allText.includes('goal') ||
      allText.includes('ambition') || allText.includes('grow') || allText.includes('advance')) {
    patterns.push('Achievement-driven');
  }

  // Work-life conflict - specific combination check
  if ((allText.includes('family') || allText.includes('kids')) &&
      (allText.includes('work') || allText.includes('career')) &&
      (allText.includes('balance') || allText.includes('time') || allText.includes('present'))) {
    patterns.push('Work-life conflict');
  }

  return patterns;
};

const projectCurrentPath = (patterns: string[], presentPoint: LifePoint): string => {
  const age = presentPoint.age || 40;
  const currentText = presentPoint.reflection.toLowerCase();

  // Extract key context from user's current situation
  const isManager = currentText.includes('manager') || currentText.includes('leadership');
  const isMarketing = currentText.includes('marketing');
  const hasKids = currentText.includes('kids') || currentText.includes('children');
  const isStuck = currentText.includes('stuck') || currentText.includes('trapped');
  const isExhausted = currentText.includes('exhausted') || currentText.includes('overwhelmed');

  // Create personalized prediction based on specific patterns and context
  if (patterns.includes('Entrepreneurial') && patterns.includes('Risk-averse')) {
    const roleContext = isManager ? 'senior management roles' : 'similar positions';
    const industryContext = isMarketing ? 'marketing' : 'your field';
    return `Your ${industryContext} career will advance to ${roleContext}, but the entrepreneurial dreams you had at 20 will fade. By ${age + 10}, you'll likely be successful in corporate terms but still an employee, not the business owner you envisioned. The "someday I'll start my own business" becomes "I should have done it years ago."`;
  }

  if (patterns.includes('Family-oriented') && patterns.includes('Work-life conflict')) {
    const familyContext = hasKids ? 'Your children will grow up remembering you as always busy with work.' : 'Family time will continue to be sacrificed for career demands.';
    return `${familyContext} By ${age + 10}, you'll have achieved professional success but may feel like you missed the important moments. The work-life balance you seek will remain elusive as responsibilities only increase with seniority.`;
  }

  if (patterns.includes('Time-constrained') && patterns.includes('Achievement-driven')) {
    return `You'll continue climbing the ladder but feeling increasingly stretched thin. By ${age + 10}, you'll have impressive titles and income, but the time scarcity that exhausts you now will only intensify. Success will come at the cost of personal fulfillment and energy.`;
  }

  if (patterns.includes('Risk-averse') && patterns.includes('Career-focused')) {
    const stuckContext = isStuck ? 'The feeling of being stuck will deepen over time.' : 'Career advancement will follow predictable patterns.';
    return `${stuckContext} You'll stay in secure but increasingly unfulfilling roles. By ${age + 10}, you'll be financially comfortable but wondering "what if" about the paths not taken. The comfort zone becomes a prison.`;
  }

  // Default personalized response
  const exhaustionContext = isExhausted ? 'The exhaustion you feel now will compound' : 'Current patterns will intensify';
  return `${exhaustionContext} as responsibilities grow. By ${age + 10}, you'll likely be in a similar situation but with higher stakes and fewer options for change. Without deliberate action, your future will be an amplified version of today's challenges.`;
};

const extractDesiredPath = (futureDesires: LifePoint[]): string => {
  if (futureDesires.length === 0) {
    return 'No clear future vision articulated yet.';
  }
  
  const desires = futureDesires.map(p => p.reflection).join(' ');
  
  return `Desired future includes: ${desires.substring(0, 200)}...`;
};

const calculateGap = (
  currentPath: string,
  desiredPath: string,
  pastPoints: LifePoint[],
  presentPoint: LifePoint,
  futureDesires: LifePoint[]
): string => {
  // Use raw user input for better keyword detection
  const currentText = presentPoint.reflection.toLowerCase();
  const futureText = futureDesires.map(p => p.reflection).join(' ').toLowerCase();

  const hasSignificantGap =
    // Original conditions
    (futureText.includes('travel') && !currentText.includes('travel')) ||
    (futureText.includes('freedom') && currentText.includes('busy')) ||
    (futureText.includes('creative') && currentText.includes('career')) ||
    (futureText.includes('peace') && currentText.includes('stress')) ||

    // Entrepreneurship vs Employment
    ((futureText.includes('business') || futureText.includes('consultancy') || futureText.includes('entrepreneur') || futureText.includes('own')) &&
     (currentText.includes('manager') || currentText.includes('employee') || currentText.includes('company') || currentText.includes('corporate'))) ||

    // Autonomy vs Constraint
    ((futureText.includes('flexible') || futureText.includes('choose') || futureText.includes('freedom') || futureText.includes('control')) &&
     (currentText.includes('stuck') || currentText.includes('trapped') || currentText.includes('overwhelmed') || currentText.includes('exhausted'))) ||

    // Time freedom vs Time scarcity
    ((futureText.includes('time') || futureText.includes('family') || futureText.includes('present')) &&
     (currentText.includes('no time') || currentText.includes('busy') || currentText.includes('juggling') || currentText.includes('always')));

  // Add time pressure based on age and life stage
  const age = presentPoint.age || 35;
  const hasKids = currentText.includes('kids') || currentText.includes('children') || currentText.includes('family');
  const isEntrepreneurial = futureText.includes('business') || futureText.includes('consultancy') || futureText.includes('entrepreneur');

  let timePressure = '';

  if (hasSignificantGap) {
    // Age-specific urgency messaging
    if (age >= 30 && age <= 40 && hasKids && isEntrepreneurial) {
      timePressure = ` At ${age} with young children, you have a narrow window before family expenses peak and risk tolerance drops. The 35-45 decade is critical for entrepreneurial moves.`;
    } else if (age >= 30 && age <= 40 && isEntrepreneurial) {
      timePressure = ` At ${age}, you're in the optimal age range for starting a business - old enough to have skills and credibility, young enough to take risks and recover from setbacks.`;
    } else if (age >= 40 && age <= 50) {
      timePressure = ` At ${age}, the window for major career pivots is narrowing. Every year of delay makes the transition exponentially harder.`;
    } else if (age >= 25 && age <= 35) {
      timePressure = ` You're ${age} - this is your power decade for building the foundation of your desired future. Don't let it slip away.`;
    }

    return `SIGNIFICANT GAP: Your current trajectory and desired future are heading in opposite directions. Immediate action required.${timePressure}`;
  }

  return 'MODERATE GAP: Your desired future requires intentional changes to your current path. Small adjustments now can lead to big differences.';
};

const determineAction = (gap: string, patterns: string[]): string => {
  // Create specific action based on patterns, always leading to Full Life Walk
  let immediateAction = '';

  if (patterns.includes('Entrepreneurial') && patterns.includes('Risk-averse')) {
    immediateAction = 'Before you sleep tonight: Write down 3 people who successfully made the transition you want. Tomorrow: Reach out to one of them.';
  } else if (patterns.includes('Family-oriented') && patterns.includes('Work-life conflict')) {
    immediateAction = 'Tonight at dinner: Ask your family what they need most from you. Tomorrow: Block 2 hours of "untouchable" family time in your calendar.';
  } else if (patterns.includes('Time-constrained')) {
    immediateAction = 'Right now: List 3 things you do that don\'t align with your stated goals. This week: Eliminate or delegate one of them.';
  } else if (gap.includes('SIGNIFICANT')) {
    immediateAction = 'Today: Choose one small action that your future self will thank you for. Tomorrow: Do it again. Build momentum.';
  } else {
    immediateAction = 'Start with one micro-commitment today that moves you toward your vision. Progress compounds.';
  }

  // Always append the bridge to Full Life Walk
  return `${immediateAction} Then use the Full Life Walk below to map out your complete transformation plan - year by year, with specific milestones and commitments.`;
};

const calculateCostOfWaiting = (
  presentPoint: LifePoint,
  futureDesires: LifePoint[],
  patterns: string[]
): string[] => {
  const costs: string[] = [];
  const age = presentPoint.age || 35;
  const currentText = presentPoint.reflection.toLowerCase();
  const futureText = futureDesires.map(p => p.reflection).join(' ').toLowerCase();

  // Entrepreneurial cost of waiting
  if (patterns.includes('Entrepreneurial') && patterns.includes('Risk-averse')) {
    costs.push(`Every year you delay starting your business = 2 years harder to transition`);

    if (age < 40) {
      costs.push(`Starting a business after 40 has 40% lower success rate than starting now`);
    }

    if (futureText.includes('consultancy') || futureText.includes('freelance')) {
      const potentialYears = Math.max(0, 65 - age - 5); // Years of potential business ownership
      costs.push(`Waiting 5 years could cost you ${potentialYears} years of business ownership`);
    }
  }

  // Family time cost
  if (patterns.includes('Family-oriented') && patterns.includes('Work-life conflict')) {
    if (currentText.includes('kids') || currentText.includes('children')) {
      costs.push(`Your children grow 5 years older while you delay - these moments don't come back`);
      costs.push(`Missing your kids' childhood for a job you plan to leave anyway`);
    }
  }

  // Financial cost of waiting
  if (patterns.includes('Achievement-driven') && futureText.includes('financial')) {
    costs.push(`5-year delay = potential loss of $200K+ in compound business growth`);
  }

  // Energy and health cost
  if (age >= 35 && age <= 45) {
    costs.push(`Your energy and risk tolerance decrease 20% every 5 years after 35`);
  }

  // Regret accumulation
  if (patterns.includes('Risk-averse')) {
    costs.push(`The regret of not trying compounds faster than the risk of failing`);
  }

  // If no specific costs identified, add general cost
  if (costs.length === 0) {
    costs.push(`Every year of delay makes change exponentially harder`);
    costs.push(`The best time was 5 years ago. The second best time is now`);
  }

  return costs;
};