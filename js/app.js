document.addEventListener('DOMContentLoaded', () => {
  const steps = Array.from(document.querySelectorAll('.step-section'));
  const progress = Array.from(document.querySelectorAll('.progress-bar .step'));

  function goToStep(n) {
    steps.forEach((sec,i)=> sec.classList.toggle('active', i === n-1));
    progress.forEach((st,i)=> st.classList.toggle('active', i === n-1));
  }

  // wire buttons
  document.getElementById('toPreview').addEventListener('click', () => {
    if (window.form && window.form.validate()) goToStep(2);
  });
  document.getElementById('backToEntry').addEventListener('click', () => goToStep(1));
  document.getElementById('toGenerate').addEventListener('click', () => {
    goToStep(3);
    setTimeout(()=>{
      if(window.timetable && typeof window.timetable.generate === 'function') {
        window.timetable.generate();
        goToStep(4);
      } else {
        console.error('timetable.generate() not found');
      }
    }, 100);
  });
  document.getElementById('printBtn').addEventListener('click', () => window.print());
  document.getElementById('restartBtn').addEventListener('click', () => location.reload());

  // start at step 1
  goToStep(1);
});
