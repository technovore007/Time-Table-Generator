document.addEventListener('DOMContentLoaded', () => {
  const steps = Array.from(document.querySelectorAll('.step-section'));
  const progressSteps = Array.from(document.querySelectorAll('.progress-bar .step'));
  const progressBar = document.querySelector('.progress-bar');

  // Function to update progress and show corresponding step
  function goToStep(n) {
    // Update progress bar
    progressBar.setAttribute('data-step', n);
    
    // Update steps
    progressSteps.forEach((step, i) => {
      step.classList.remove('active', 'done');
      if (i < n-1) {
        step.classList.add('done');
      } else if (i === n-1) {
        step.classList.add('active');
      }
    });
    
    // Hide all sections, then show the active one with animation
    steps.forEach(sec => {
      sec.classList.remove('active');
    });
    
    // Small delay to allow animation to reset
    setTimeout(() => {
      steps[n-1].classList.add('active');
    }, 50);
  }

  // Wire buttons with smooth transitions
  document.getElementById('toPreview').addEventListener('click', () => {
    if (window.form && window.form.validate()) {
      goToStep(2);
    }
  });
  
  document.getElementById('backToEntry').addEventListener('click', () => {
    goToStep(1);
  });
  
  document.getElementById('toGenerate').addEventListener('click', () => {
    goToStep(3);
    
    // Artificial delay to show loading animation
    setTimeout(() => {
      if(window.timetable && typeof window.timetable.generate === 'function') {
        window.timetable.generate();
        goToStep(4);
      } else {
        console.error('timetable.generate() not found');
      }
    }, 1500); // Slightly longer delay for better UX
  });
  
  document.getElementById('printBtn').addEventListener('click', () => {
    window.print();
  });
  
  document.getElementById('restartBtn').addEventListener('click', () => {
    // Add fade out animation before reload
    document.querySelector('.wizard-container').style.opacity = '0';
    document.querySelector('.wizard-container').style.transform = 'translateY(20px)';
    document.querySelector('.wizard-container').style.transition = 'opacity 0.3s, transform 0.3s';
    
    setTimeout(() => {
      location.reload();
    }, 300);
  });

  // Check if there's a preferred color scheme
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Add listener for scheme changes
  prefersDarkScheme.addEventListener('change', (e) => {
    // No need to do anything, CSS handles this via media queries
    console.log(`Theme changed to ${e.matches ? 'dark' : 'light'} mode`);
  });

  // Start at step 1
  goToStep(1);
});