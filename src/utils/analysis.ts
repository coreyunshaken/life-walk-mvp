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
  
  // Calculate the gap
  const gap = calculateGap(currentPath, desiredPath);
  
  // Determine action needed
  const actionNeeded = determineAction(gap, patterns);
  
  return {
    currentPath,
    desiredPath,
    gap,
    actionNeeded,
    patterns
  };
};

const extractPatterns = (pastPoints: LifePoint[], presentPoint: LifePoint): string[] => {
  const patterns: string[] = [];
  
  // Look for common themes
  const allReflections = [...pastPoints, presentPoint].map(p => p.reflection.toLowerCase());
  
  // Pattern detection
  if (allReflections.filter(r => r.includes('work') || r.includes('career')).length > 2) {
    patterns.push('Career-focused');
  }
  
  if (allReflections.filter(r => r.includes('later') || r.includes('someday') || r.includes('eventually')).length > 1) {
    patterns.push('Procrastination');
  }
  
  if (allReflections.filter(r => r.includes('family') || r.includes('kids') || r.includes('spouse')).length > 2) {
    patterns.push('Family-oriented');
  }
  
  if (allReflections.filter(r => r.includes('dream') || r.includes('goal') || r.includes('want')).length > 2) {
    patterns.push('Aspiration-driven');
  }
  
  if (allReflections.filter(r => r.includes('busy') || r.includes('no time') || r.includes('overwhelmed')).length > 1) {
    patterns.push('Time-constrained');
  }
  
  return patterns;
};

const projectCurrentPath = (patterns: string[], presentPoint: LifePoint): string => {
  const age = presentPoint.age || 40;
  
  if (patterns.includes('Procrastination') && patterns.includes('Time-constrained')) {
    return `Continuing on the same busy path, postponing personal goals indefinitely. By ${age + 20}, likely to have many regrets about unfulfilled dreams.`;
  }
  
  if (patterns.includes('Career-focused') && !patterns.includes('Family-oriented')) {
    return `Career continues to dominate, personal relationships may suffer. Success in professional life but potential emptiness in personal fulfillment.`;
  }
  
  if (patterns.includes('Family-oriented') && patterns.includes('Time-constrained')) {
    return `Family responsibilities continue to take priority. Personal dreams and individual growth may be permanently deferred.`;
  }
  
  if (patterns.includes('Aspiration-driven')) {
    return `Strong dreams exist but without concrete action. The gap between aspirations and reality likely to widen over time.`;
  }
  
  return `Current trajectory suggests more of the same patterns. Without intentional change, the future will closely resemble the present.`;
};

const extractDesiredPath = (futureDesires: LifePoint[]): string => {
  if (futureDesires.length === 0) {
    return 'No clear future vision articulated yet.';
  }
  
  const desires = futureDesires.map(p => p.reflection).join(' ');
  
  return `Desired future includes: ${desires.substring(0, 200)}...`;
};

const calculateGap = (currentPath: string, desiredPath: string): string => {
  // Simple gap analysis based on divergence
  const currentKeywords = currentPath.toLowerCase().split(' ');
  const desiredKeywords = desiredPath.toLowerCase().split(' ');
  
  const hasSignificantGap = 
    (desiredKeywords.includes('travel') && !currentKeywords.includes('travel')) ||
    (desiredKeywords.includes('freedom') && currentKeywords.includes('busy')) ||
    (desiredKeywords.includes('creative') && currentKeywords.includes('career')) ||
    (desiredKeywords.includes('peace') && currentKeywords.includes('stress'));
  
  if (hasSignificantGap) {
    return 'SIGNIFICANT GAP: Your current trajectory and desired future are heading in opposite directions. Immediate action required.';
  }
  
  return 'MODERATE GAP: Your desired future requires intentional changes to your current path. Small adjustments now can lead to big differences.';
};

const determineAction = (gap: string, patterns: string[]): string => {
  if (gap.includes('SIGNIFICANT')) {
    return 'You need to make major changes NOW. Start with one concrete action this week that moves you toward your desired future.';
  }
  
  if (patterns.includes('Procrastination')) {
    return 'Stop waiting for "the right time." Choose one small step toward your dreams and take it today.';
  }
  
  if (patterns.includes('Time-constrained')) {
    return 'Time is not found, it\'s made. What can you stop doing to make room for what matters?';
  }
  
  return 'Begin with small, consistent actions. Daily progress toward your vision will compound over time.';
};