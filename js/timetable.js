window.timetable = (function() {
  // Core data remains the same to maintain compatibility with existing algorithm
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const weekdaySlots = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];
  const saturdaySlots = ['9:00 AM', '10:00 AM', '11:00 AM'];

  // Helper function to generate colors for courses
  function getCourseColor(courseId, index) {
    const colors = [
      { bg: '#e8f0fe', text: '#1a73e8' }, // Blue
      { bg: '#e6f4ea', text: '#137333' }, // Green
      { bg: '#fce8e6', text: '#c5221f' }, // Red
      { bg: '#fef7e0', text: '#b06000' }, // Yellow
      { bg: '#f3e8fd', text: '#8430ce' }, // Purple
      { bg: '#e8eaed', text: '#3c4043' }, // Grey
      { bg: '#e0f7fa', text: '#00838f' }, // Cyan
      { bg: '#ffebee', text: '#c2185b' }  // Pink
    ];
    
    // Generate consistent color based on course ID
    let colorIndex = 0;
    for (let i = 0; i < courseId.length; i++) {
      colorIndex += courseId.charCodeAt(i);
    }
    
    return colors[colorIndex % colors.length];
  }

  // Create the timetable grid structure (unchanged logic)
  function createGrid() {
    return days.map(day => ({
      day,
      slots: (day === 'Saturday' ? saturdaySlots : weekdaySlots).map(time => ({ time, courseId: null }))
    }));
  }

  // Check if slots are free (unchanged logic)
  function isFree(slots, i, dur) {
    if (i + dur > slots.length) return false;
    return slots.slice(i, i + dur).every(s => !s.courseId);
  }

  // Assign courses to the grid (unchanged logic)
  function assign(course, grid) {
    let assigned = 0, tries = 0;
    const used = new Set();
    
    while (assigned < course.sessions && tries < 500) {
      const pool = days.slice(0, 5).filter(d => !used.has(d));
      const day = pool.length ? 
        pool[Math.floor(Math.random() * pool.length)] : 
        days[Math.floor(Math.random() * days.length)];
        
      const row = grid.find(r => r.day === day).slots;
      const idx = Math.floor(Math.random() * (row.length - course.duration + 1));
      
      if (isFree(row, idx, course.duration)) {
        for (let j = 0; j < course.duration; j++) {
          row[idx + j].courseId = course.id;
        }
        assigned++;
        used.add(day);
      }
      tries++;
    }
  }

  // Enhanced rendering of the generated timetable
  function generate() {
    // Generate the timetable using existing algorithm
    const grid = createGrid();
    (window.courses || []).forEach(c => assign(c, grid));

    // Get the container for display
    const container = document.getElementById('timetableGrid');
    container.innerHTML = '';

    // Collect all unique course IDs for consistent coloring
    const allCourses = new Set();
    grid.forEach(day => {
      day.slots.forEach(slot => {
        if (slot.courseId) allCourses.add(slot.courseId);
      });
    });
    const courseIds = Array.from(allCourses);

    // Generate colors for each course
    const courseColors = {};
    courseIds.forEach((courseId, index) => {
      courseColors[courseId] = getCourseColor(courseId, index);
    });

    // Create empty cell in top-left corner
    container.appendChild(Object.assign(document.createElement('div'), {
      className: 'cell header',
      innerHTML: '<i class="fas fa-calendar-alt"></i>'
    }));

    // Create day headers
    days.forEach(day => {
      const dayHeader = document.createElement('div');
      dayHeader.className = 'cell day-header';
      dayHeader.textContent = day;
      container.appendChild(dayHeader);
    });

    // Find max number of slots for any day
    const maxSlots = weekdaySlots.length;

    // Create time slots and fill in timetable
    for (let i = 0; i < maxSlots; i++) {
      // Time column header
      const time = weekdaySlots[i];
      const timeCell = document.createElement('div');
      timeCell.className = 'cell time-slot';
      timeCell.textContent = time;
      container.appendChild(timeCell);

      // Generate cells for each day
      days.forEach(day => {
        const dayGrid = grid.find(r => r.day === day);
        // Check if this time slot exists for this day
        if (i >= dayGrid.slots.length) {
          // Create an empty disabled cell
          const emptyCell = document.createElement('div');
          emptyCell.className = 'cell';
          emptyCell.style.backgroundColor = 'rgba(0,0,0,0.05)';
          container.appendChild(emptyCell);
          return;
        }

        const slot = dayGrid.slots[i];
        const cell = document.createElement('div');
        
        if (slot.courseId) {
          // Course slot
          const color = courseColors[slot.courseId];
          cell.className = 'cell course-slot';
          cell.textContent = slot.courseId;
          cell.style.backgroundColor = color.bg;
          cell.style.color = color.text;
          cell.style.fontWeight = '500';
          
          // Add tooltip with course info
          cell.title = `${slot.courseId} - ${slot.time}`;
          
          // Add animation with delay based on position
          cell.style.opacity = '0';
          cell.style.transform = 'scale(0.95)';
          
          setTimeout(() => {
            cell.style.opacity = '1';
            cell.style.transform = 'scale(1)';
            cell.style.transition = 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)';
          }, 50 * (i + days.indexOf(day)));
        } else {
          // Free slot
          cell.className = 'cell free-slot';
          cell.textContent = 'Free';
        }
        
        container.appendChild(cell);
      });
    }
  }

  return { generate };
})();