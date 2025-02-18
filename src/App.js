// React web application for Baby Planning Sequence Tracker

import React, { useState, useEffect } from 'react';
import './styles.css'; // You'll need to create this file with the CSS styles

const App = () => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [completedSteps, setCompletedSteps] = useState({});
  
  // Define all phases and steps
  const phases = [
    {
      title: "Preconception Planning",
      steps: [
        { id: "p1s1", title: "Health checkup for both partners", description: "Schedule comprehensive health checkups including genetic screening" },
        { id: "p1s2", title: "Start taking folic acid supplements", description: "Begin taking 400 mcg of folic acid daily" },
        { id: "p1s3", title: "Review and update vaccinations", description: "Ensure all recommended vaccines are up-to-date" },
        { id: "p1s4", title: "Lifestyle modifications", description: "Quit smoking/alcohol, improve diet, start exercise routine" },
        { id: "p1s5", title: "Financial planning", description: "Calculate expenses and start a baby fund" }
      ]
    },
    {
      title: "Pregnancy Confirmation & First Trimester",
      steps: [
        { id: "p2s1", title: "Confirm pregnancy", description: "Take home pregnancy test and schedule doctor visit" },
        { id: "p2s2", title: "Find an obstetrician/gynecologist", description: "Research and select a healthcare provider" },
        { id: "p2s3", title: "First prenatal visit", description: "Initial check-up, blood tests, and ultrasound" },
        { id: "p2s4", title: "Register for government schemes", description: "Apply for Pradhan Mantri Matru Vandana Yojana if eligible" },
        { id: "p2s5", title: "Plan for maternity leave", description: "Learn about maternity benefits and inform employer" }
      ]
    },
    {
      title: "Second Trimester",
      steps: [
        { id: "p3s1", title: "Anomaly scan", description: "Schedule and complete detailed ultrasound scan" },
        { id: "p3s2", title: "Prepare baby budget", description: "Finalize financial planning for baby expenses" },
        { id: "p3s3", title: "Research childcare options", description: "Explore options for family support, daycare, or nanny" },
        { id: "p3s4", title: "Take childbirth classes", description: "Register for prenatal and parenting classes" },
        { id: "p3s5", title: "Research delivery options", description: "Decide between hospital, nursing home, or home birth" }
      ]
    },
    {
      title: "Third Trimester",
      steps: [
        { id: "p4s1", title: "Hospital registration", description: "Complete pre-registration at your chosen hospital" },
        { id: "p4s2", title: "Prepare hospital bag", description: "Pack essentials for mother and newborn" },
        { id: "p4s3", title: "Create a birth plan", description: "Document your preferences for labor and delivery" },
        { id: "p4s4", title: "Arrange transportation", description: "Plan how to get to the hospital when labor begins" },
        { id: "p4s5", title: "Install infant car seat", description: "Purchase and properly install a car seat if using private vehicle" }
      ]
    },
    {
      title: "Birth & Registration",
      steps: [
        { id: "p5s1", title: "Delivery", description: "Welcome your new baby!" },
        { id: "p5s2", title: "Birth registration", description: "Register birth at municipality within 21 days" },
        { id: "p5s3", title: "Apply for birth certificate", description: "Complete application at local municipal office" },
        { id: "p5s4", title: "Schedule first pediatrician visit", description: "Book first check-up within first week" },
        { id: "p5s5", title: "Apply for Aadhaar card", description: "Start the process for baby's Aadhaar enrollment" }
      ]
    },
    {
      title: "Postpartum Care & Baby's First Months",
      steps: [
        { id: "p6s1", title: "Schedule mother's postpartum checkup", description: "Book 6-week follow-up appointment" },
        { id: "p6s2", title: "Start vaccination schedule", description: "Follow Indian Academy of Pediatrics recommendations" },
        { id: "p6s3", title: "Join parent support group", description: "Connect with local or online communities" },
        { id: "p6s4", title: "Schedule regular pediatric check-ups", description: "Book appointments for growth monitoring" },
        { id: "p6s5", title: "Add baby to health insurance", description: "Update policy to include the newborn" }
      ]
    }
  ];

  // Load saved progress
  useEffect(() => {
    const loadProgress = () => {
      try {
        const savedProgress = localStorage.getItem('babyPlanningProgress');
        if (savedProgress) {
          const progress = JSON.parse(savedProgress);
          setCurrentPhase(progress.currentPhase);
          setCompletedSteps(progress.completedSteps);
        }
      } catch (error) {
        console.error("Error loading progress:", error);
      }
    };
    loadProgress();
  }, []);

  // Save progress whenever it changes
  useEffect(() => {
    const saveProgress = () => {
      try {
        const progress = {
          currentPhase: currentPhase,
          completedSteps: completedSteps
        };
        localStorage.setItem('babyPlanningProgress', JSON.stringify(progress));
      } catch (error) {
        console.error("Error saving progress:", error);
      }
    };
    saveProgress();
  }, [currentPhase, completedSteps]);

  // Handle step completion
  const toggleStepCompletion = (stepId) => {
    const newCompletedSteps = { ...completedSteps };
    
    if (newCompletedSteps[stepId]) {
      delete newCompletedSteps[stepId];
    } else {
      newCompletedSteps[stepId] = true;
    }
    
    setCompletedSteps(newCompletedSteps);
    
    // Check if all steps in current phase are completed
    const currentPhaseSteps = phases[currentPhase].steps.map(step => step.id);
    const isPhaseComplete = currentPhaseSteps.every(id => newCompletedSteps[id]);
    
    if (isPhaseComplete && currentPhase < phases.length - 1) {
      if (window.confirm(`Congratulations on completing ${phases[currentPhase].title}! Ready to move to ${phases[currentPhase + 1].title}?`)) {
        setCurrentPhase(currentPhase + 1);
      }
    }
  };

  // Find next incomplete step
  const getNextStep = () => {
    for (let i = currentPhase; i < phases.length; i++) {
      const phaseSteps = phases[i].steps;
      for (let step of phaseSteps) {
        if (!completedSteps[step.id]) {
          return { phase: i, step: step };
        }
      }
    }
    return null; // All steps completed
  };

  // Render each phase with its steps
  const renderPhase = (phase, index) => {
    const isCurrentPhase = index === currentPhase;
    const isPastPhase = index < currentPhase;
    
    return (
      <div 
        key={index} 
        className={`phase-container ${isCurrentPhase ? 'current-phase' : ''} ${isPastPhase ? 'completed-phase' : ''}`}
      >
        <h2 className="phase-title">{phase.title}</h2>
        {(isCurrentPhase || isPastPhase) && renderSteps(phase.steps)}
        {!isCurrentPhase && !isPastPhase && (
          <p className="locked-text">Complete previous phases first</p>
        )}
      </div>
    );
  };

  // Render steps for the current phase
  const renderSteps = (steps) => {
    return steps.map((step) => (
      <div 
        key={step.id}
        className={`step-container ${completedSteps[step.id] ? 'completed-step' : ''}`}
        onClick={() => toggleStepCompletion(step.id)}
      >
        <div className="step-checkbox">
          {completedSteps[step.id] && <span className="checkmark">✓</span>}
        </div>
        <div className="step-text-container">
          <h3 className="step-title">{step.title}</h3>
          <p className="step-description">{step.description}</p>
        </div>
      </div>
    ));
  };

  // Get next step suggestion
  const nextStep = getNextStep();

  return (
    <div className="container">
      <div className="scroll-view">
        <h1 className="app-title">Baby Planning Journey</h1>
        
        {nextStep && (
          <div className="next-step-container">
            <h3 className="next-step-title">Suggested Next Step:</h3>
            <h2 className="next-step-text">{nextStep.step.title}</h2>
            <p className="next-step-phase">in {phases[nextStep.phase].title}</p>
            <p className="next-step-description">{nextStep.step.description}</p>
          </div>
        )}

        {phases.map(renderPhase)}
      </div>
    </div>
  );
};

export default App;
