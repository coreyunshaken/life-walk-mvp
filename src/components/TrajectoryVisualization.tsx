import React from 'react';
import { TrajectoryData } from '../types';
import './TrajectoryVisualization.css';

interface Props {
  data: TrajectoryData;
}

const TrajectoryVisualization: React.FC<Props> = ({ data }) => {
  const { pastPoints, presentPoint, futureDesires, analysis } = data;
  
  const isSignificantGap = analysis?.gap.includes('SIGNIFICANT');

  // Extract key themes for simplified display
  const pastTheme = pastPoints[0]?.reflection.substring(0, 60) + "...";
  const presentTheme = presentPoint.reflection.substring(0, 60) + "...";
  const futureTheme = futureDesires[0]?.reflection.substring(0, 60) + "...";

  return (
    <div className="trajectory-viz card fade-in">
      <h2>Your Life Trajectory</h2>
      
      {/* Simplified Path Comparison */}
      <div className="path-comparison">
        <div className="path-section current-path">
          <div className="path-header">
            <h3>📍 Where You're Headed</h3>
            <span className="path-type">Current Trajectory</span>
          </div>
          <div className="path-content">
            <div className="timeline-simple">
              <div className="time-point past">
                <div className="point-dot"></div>
                <div className="point-info">
                  <span className="age">Age {pastPoints[0]?.age}</span>
                  <p className="reflection">{pastTheme}</p>
                </div>
              </div>
              
              <div className="time-point present">
                <div className="point-dot current"></div>
                <div className="point-info">
                  <span className="age">NOW (Age {presentPoint.age})</span>
                  <p className="reflection">{presentTheme}</p>
                </div>
              </div>
              
              <div className="time-point future-projected">
                <div className="point-dot projected"></div>
                <div className="point-info">
                  <span className="age">Age {presentPoint.age + 10}</span>
                  <p className="reflection">More of the same patterns...</p>
                </div>
              </div>
            </div>
            
            <div className="path-prediction">
              <p>{analysis?.currentPath}</p>
            </div>
          </div>
        </div>

        <div className="gap-divider">
          <div className={`gap-indicator ${isSignificantGap ? 'significant' : 'moderate'}`}>
            <div className="gap-icon">⚠️</div>
            <div className="gap-label">THE GAP</div>
            <div className="gap-arrows">
              <div className="arrow-up">↑</div>
              <div className="arrow-down">↓</div>
            </div>
          </div>
        </div>

        <div className="path-section desired-path">
          <div className="path-header">
            <h3>⭐ Where You Want To Be</h3>
            <span className="path-type">Desired Future</span>
          </div>
          <div className="path-content">
            <div className="timeline-simple">
              <div className="time-point present-start">
                <div className="point-dot current"></div>
                <div className="point-info">
                  <span className="age">NOW (Age {presentPoint.age})</span>
                  <p className="reflection">Starting to change...</p>
                </div>
              </div>
              
              <div className="time-point future-desired">
                <div className="point-dot desired"></div>
                <div className="point-info">
                  <span className="age">Age {futureDesires[0]?.age}</span>
                  <p className="reflection">{futureTheme}</p>
                </div>
              </div>
              
              <div className="time-point future-ideal">
                <div className="point-dot ideal"></div>
                <div className="point-info">
                  <span className="age">Age 80</span>
                  <p className="reflection">Living with purpose and fulfillment</p>
                </div>
              </div>
            </div>
            
            <div className="path-prediction desired">
              <p>{analysis?.desiredPath}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Clear Gap Message */}
      {analysis && (
        <div className="analysis-results">
          <div className={`alert ${isSignificantGap ? 'alert-urgent' : 'alert-warning'}`}>
            <h3>🚨 Reality Check</h3>
            <div className="gap-breakdown">
              <div className="gap-statement">{analysis.gap}</div>
              
              <div className="comparison-grid">
                <div className="comparison-item current">
                  <h4>Your Current Pattern:</h4>
                  <p>{analysis.currentPath.substring(0, 150)}...</p>
                </div>
                <div className="comparison-item desired">
                  <h4>Your Stated Goals:</h4>
                  <p>{analysis.desiredPath.substring(0, 150)}...</p>
                </div>
              </div>
            </div>
          </div>

          {analysis.patterns.length > 0 && (
            <div className="patterns-section">
              <h4>Patterns We Detected:</h4>
              <div className="pattern-tags">
                {analysis.patterns.map((pattern, index) => (
                  <span key={index} className="pattern-tag">{pattern}</span>
                ))}
              </div>
            </div>
          )}

          <div className="action-box">
            <h3>🎯 The Choice Is Yours</h3>
            <p className="action-statement">{analysis.actionNeeded}</p>
            
            <div className="commitment-prompt">
              <p>Without deliberate action, your future will be an extension of your past.</p>
              <p className="emphasis">What will you choose?</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrajectoryVisualization;