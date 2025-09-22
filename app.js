// Commutr - Interactive Prototype JavaScript

// Global state
let currentScreen = 'loading-screen';
let selectedCommute = null;
let selectedMood = null;
let selectedTopics = [];
let selectedContent = null;
let currentLessonSection = 0;
let lessonTimer = null;
let isPaused = false;

// Lesson content data
const lessonSections = [
  {
    title: "Key Insight #1: The Leadership Paradox",
    content: "While AI automates routine tasks, it amplifies the need for uniquely human leadership skills. Executives must balance technological adoption with human-centered decision making.",
    takeaway: "Focus on developing emotional intelligence and strategic thinking as AI handles operational complexity."
  },
  {
    title: "Key Insight #2: Strategic Implementation",
    content: "Successful AI transformation requires a phased approach. Start with pilot programs in non-critical areas to build confidence and learn before scaling to core business functions.",
    takeaway: "Begin with low-risk, high-impact AI implementations to demonstrate value and build organizational buy-in."
  },
  {
    title: "Key Insight #3: Team Adaptation",
    content: "The most successful AI implementations involve extensive change management. Teams need clear communication about how AI will augment, not replace, their roles.",
    takeaway: "Invest heavily in communication and training to ensure smooth team transitions during AI adoption."
  }
];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
  // Simulate loading
  setTimeout(() => {
    showScreen('welcome-screen');
  }, 2000);
});

// Screen navigation
function showScreen(screenId) {
  // Hide current screen
  const currentScreenEl = document.querySelector('.screen.active');
  if (currentScreenEl) {
    currentScreenEl.classList.remove('active');
  }
  
  // Show new screen
  setTimeout(() => {
    const newScreen = document.getElementById(screenId);
    newScreen.classList.add('active');
    currentScreen = screenId;
  }, 150);
}

// Start commute flow
function startCommute() {
  showScreen('commute-screen');
}

// Commute selection
function selectCommute(duration, type) {
  // Remove previous selections
  document.querySelectorAll('.commute-card').forEach(card => {
    card.classList.remove('selected');
  });
  
  // Select current card
  event.target.closest('.commute-card').classList.add('selected');
  
  selectedCommute = { duration, type };
  
  // Auto-advance after selection
  setTimeout(() => {
    showScreen('mood-screen');
  }, 800);
}

// Mood selection
function selectMood(mood) {
  // Remove previous selections
  document.querySelectorAll('.mood-card').forEach(card => {
    card.classList.remove('selected');
  });
  
  // Select current card
  event.target.closest('.mood-card').classList.add('selected');
  
  selectedMood = mood;
  updateMoodContinueButton();
}

// Topic selection
function toggleTopic(topicElement) {
  topicElement.classList.toggle('selected');
  
  const topicText = topicElement.textContent;
  if (selectedTopics.includes(topicText)) {
    selectedTopics = selectedTopics.filter(topic => topic !== topicText);
  } else {
    selectedTopics.push(topicText);
  }
  
  updateMoodContinueButton();
}

// Update mood continue button state
function updateMoodContinueButton() {
  const continueBtn = document.getElementById('mood-continue-btn');
  if (selectedMood && selectedTopics.length > 0) {
    continueBtn.disabled = false;
  } else {
    continueBtn.disabled = true;
  }
}

// Content selection
function selectContent(contentElement) {
  // Remove previous selections
  document.querySelectorAll('.content-card').forEach(card => {
    card.classList.remove('selected');
  });
  
  // Select current card
  contentElement.classList.add('selected');
  
  selectedContent = {
    title: contentElement.querySelector('h3').textContent,
    type: contentElement.querySelector('.content-type').textContent,
    duration: contentElement.querySelector('.duration').textContent
  };
  
  // Enable continue button
  document.getElementById('content-continue-btn').disabled = false;
}

// Start learning
function startLearning() {
  showScreen('learning-screen');
  initializeLearning();
}

// Initialize learning interface
function initializeLearning() {
  currentLessonSection = 0;
  updateLessonContent();
  startLessonTimer();
}

// Update lesson content
function updateLessonContent() {
  const section = lessonSections[currentLessonSection];
  
  document.getElementById('lesson-title').textContent = selectedContent.title;
  document.querySelector('#lesson-section h3').textContent = section.title;
  document.querySelector('#lesson-section p').textContent = section.content;
  document.querySelector('.insight-highlight').innerHTML = `💡 <strong>Takeaway:</strong> ${section.takeaway}`;
  
  // Update navigation buttons
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  
  prevBtn.disabled = currentLessonSection === 0;
  nextBtn.textContent = currentLessonSection === lessonSections.length - 1 ? 'Complete' : 'Continue';
  
  // Update progress
  const progress = ((currentLessonSection + 1) / lessonSections.length) * 100;
  document.getElementById('lesson-progress-fill').style.width = progress + '%';
}

// Lesson navigation
function nextSection() {
  if (currentLessonSection < lessonSections.length - 1) {
    currentLessonSection++;
    updateLessonContent();
  } else {
    // Complete lesson
    completeLearning();
  }
}

function previousSection() {
  if (currentLessonSection > 0) {
    currentLessonSection--;
    updateLessonContent();
  }
}

// Lesson timer
function startLessonTimer() {
  let timeRemaining = 8 * 60; // 8 minutes in seconds
  
  lessonTimer = setInterval(() => {
    if (!isPaused) {
      timeRemaining--;
      
      const minutes = Math.floor(timeRemaining / 60);
      const seconds = timeRemaining % 60;
      document.getElementById('time-remaining').textContent = 
        `${minutes}:${seconds.toString().padStart(2, '0')} remaining`;
      
      if (timeRemaining <= 0) {
        clearInterval(lessonTimer);
        completeLearning();
      }
    }
  }, 1000);
}

// Pause/resume functionality
function togglePause() {
  isPaused = !isPaused;
  const pauseBtn = document.getElementById('pause-btn');
  pauseBtn.textContent = isPaused ? '▶️' : '⏸️';
}

// Minimize learning (placeholder)
function minimizeLearning() {
  alert('Minimize feature would allow background learning while using other apps.');
}

// Complete learning
function completeLearning() {
  if (lessonTimer) {
    clearInterval(lessonTimer);
  }
  showScreen('completion-screen');
}

// Completion actions
function shareInsights() {
  // Simulate sharing functionality
  const insights = lessonSections.map(section => `• ${section.takeaway}`).join('\n');
  const shareText = `Just completed a micro-learning session on "${selectedContent.title}" with @Commutr!\n\nKey takeaways:\n${insights}\n\n#MicroLearning #ProfessionalDevelopment`;
  
  if (navigator.share) {
    navigator.share({
      title: 'My Commutr Learning Insights',
      text: shareText
    });
  } else {
    // Fallback - copy to clipboard
    navigator.clipboard.writeText(shareText).then(() => {
      alert('Insights copied to clipboard! Share them on your favorite platform.');
    });
  }
}

function planNextCommute() {
  // Reset state for next session
  selectedCommute = null;
  selectedMood = null;
  selectedTopics = [];
  selectedContent = null;
  currentLessonSection = 0;
  
  // Clear selections
  document.querySelectorAll('.selected').forEach(el => {
    el.classList.remove('selected');
  });
  
  // Reset buttons
  document.getElementById('mood-continue-btn').disabled = true;
  document.getElementById('content-continue-btn').disabled = true;
  
  showScreen('welcome-screen');
}

// Search functionality (placeholder)
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        const searchTerm = e.target.value.trim();
        if (searchTerm) {
          // Simulate adding custom topic
          const topicCloud = document.querySelector('.topic-cloud');
          const newTopic = document.createElement('span');
          newTopic.className = 'topic-tag selected';
          newTopic.textContent = searchTerm;
          newTopic.onclick = () => toggleTopic(newTopic);
          topicCloud.appendChild(newTopic);
          
          selectedTopics.push(searchTerm);
          updateMoodContinueButton();
          
          e.target.value = '';
        }
      }
    });
  }
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
  if (currentScreen === 'learning-screen') {
    switch(e.key) {
      case 'ArrowLeft':
        if (!document.getElementById('prev-btn').disabled) {
          previousSection();
        }
        break;
      case 'ArrowRight':
      case ' ':
        e.preventDefault();
        nextSection();
        break;
      case 'p':
      case 'P':
        togglePause();
        break;
    }
  }
});

// Simulate realistic loading states
function simulateAIProcessing() {
  const messages = [
    "Analyzing your preferences...",
    "Curating personalized content...",
    "Optimizing for your commute duration...",
    "Preparing your learning journey..."
  ];
  
  let messageIndex = 0;
  const loadingText = document.querySelector('.loading-container p');
  
  const messageInterval = setInterval(() => {
    if (messageIndex < messages.length) {
      loadingText.textContent = messages[messageIndex];
      messageIndex++;
    } else {
      clearInterval(messageInterval);
    }
  }, 500);
}

// Add some interactive feedback
document.addEventListener('DOMContentLoaded', function() {
  // Add click feedback to all interactive elements
  document.addEventListener('click', function(e) {
    if (e.target.matches('button, .card, .btn-primary, .btn-secondary')) {
      e.target.style.transform = 'scale(0.98)';
      setTimeout(() => {
        e.target.style.transform = '';
      }, 150);
    }
  });
  
  // Initialize loading simulation
  simulateAIProcessing();
});

// Performance optimization - preload next screen content
function preloadScreen(screenId) {
  const screen = document.getElementById(screenId);
  if (screen && !screen.dataset.loaded) {
    // Mark as loaded to avoid duplicate processing
    screen.dataset.loaded = 'true';
  }
}

// Add smooth transitions and micro-interactions
document.addEventListener('DOMContentLoaded', function() {
  // Preload critical screens
  setTimeout(() => {
    preloadScreen('welcome-screen');
    preloadScreen('commute-screen');
  }, 1000);
});
