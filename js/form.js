document.addEventListener('DOMContentLoaded', () => {
  // Form module with improved UX
  window.form = (function() {
    const container = document.getElementById('courseContainer');
    const previewTbody = document.querySelector('#previewTable tbody');

    if (!container) {
      console.error('form.js: #courseContainer not found');
      return { validate: () => false };
    }

    // Add new course row with animation
    function addRow() {
      const row = document.createElement('div');
      row.className = 'course-row';
      row.style.opacity = '0';
      row.style.transform = 'translateX(-20px)';
      
      row.innerHTML = `
        <div class="input-field">
          <input class="code" type="text" placeholder=" " required />
          <label>Course Code</label>
        </div>
        <div class="input-field">
          <input class="dur" type="number" placeholder=" " min="1" max="5" required />
          <label>Duration (hrs)</label>
        </div>
        <div class="input-field">
          <input class="sess" type="number" placeholder=" " min="1" max="6" required />
          <label>Sessions/Week</label>
        </div>
        <button class="remove-row" aria-label="Remove course">
          <i class="fas fa-times"></i>
        </button>
      `;
      
      container.appendChild(row);
      
      // Animate row appearance
      setTimeout(() => {
        row.style.opacity = '1';
        row.style.transform = 'translateX(0)';
        row.style.transition = 'opacity 0.3s, transform 0.3s';
      }, 10);
      
      // Add event listener to remove button
      row.querySelector('.remove-row').addEventListener('click', () => {
        // Animate removal
        row.style.opacity = '0';
        row.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
          row.remove();
        }, 300);
      });
      
      // Add event listeners for floating labels
      const inputs = row.querySelectorAll('input');
      inputs.forEach(input => {
        // Auto-focus on the first input of a new row
        if (input.classList.contains('code') && container.children.length === 1) {
          setTimeout(() => input.focus(), 300);
        }
        
        // Handle Enter key to add a new row or move to next step
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            if (input.classList.contains('sess')) {
              // If it's the last input in the row, either add a new row or move to next step
              if (row === container.lastElementChild) {
                addRow();
              } else {
                document.getElementById('toPreview').click();
              }
            } else {
              // Move to next input in the row
              input.parentElement.nextElementSibling.querySelector('input').focus();
            }
            e.preventDefault();
          }
        });
      });
    }

    // Attach "Add Course" button
    document.getElementById('addCourseBtn').addEventListener('click', addRow);

    // Add initial row
    addRow();

    // Validate form and update preview
    function validate() {
      const inputs = {
        codes: Array.from(container.querySelectorAll('.code')).map(i => i.value.trim().toUpperCase()),
        durations: Array.from(container.querySelectorAll('.dur')).map(i => i.value),
        sessions: Array.from(container.querySelectorAll('.sess')).map(i => i.value)
      };

      // Check for empty fields
      if (inputs.codes.some(c => !c) || inputs.durations.some(d => !d) || inputs.sessions.some(s => !s)) {
        // Create toast notification
        showNotification('All fields are required', 'error');
        return false;
      }

      // Check for duplicate course codes
      if (new Set(inputs.codes).size !== inputs.codes.length) {
        showNotification('Duplicate course codes are not allowed', 'error');
        return false;
      }

      // Build preview table with animation
      previewTbody.innerHTML = '';
      inputs.codes.forEach((code, i) => {
        const tr = document.createElement('tr');
        tr.style.opacity = '0';
        tr.style.transform = 'translateY(10px)';
        
        tr.innerHTML = `
          <td>${code}</td>
          <td>${inputs.durations[i]}</td>
          <td>${inputs.sessions[i]}</td>
          <td>
            <button class="remove-btn" aria-label="Remove course">
              <i class="fas fa-trash-alt"></i>
            </button>
          </td>
        `;
        
        previewTbody.appendChild(tr);
        
        // Animate row appearance with staggered delay
        setTimeout(() => {
          tr.style.opacity = '1';
          tr.style.transform = 'translateY(0)';
          tr.style.transition = 'opacity 0.3s, transform 0.3s';
        }, 50 * i);
        
        // Add remove button functionality
        tr.querySelector('.remove-btn').addEventListener('click', () => {
          // Fade out animation
          tr.style.opacity = '0';
          tr.style.transform = 'translateY(10px)';
          
          setTimeout(() => {
            tr.remove();
            container.querySelectorAll('.course-row')[i].remove();
          }, 300);
        });
      });

      // Store data for timetable generation
      window.courses = inputs.codes.map((code, i) => ({
        id: code,
        duration: parseInt(inputs.durations[i], 10),
        sessions: parseInt(inputs.sessions[i], 10)
      }));
      
      return true;
    }

    // Helper function for notifications
    function showNotification(message, type = 'info') {
      // Remove any existing notifications
      const existingNotifications = document.querySelectorAll('.notification');
      existingNotifications.forEach(note => {
        note.remove();
      });
      
      // Create new notification
      const notification = document.createElement('div');
      notification.className = `notification ${type}`;
      notification.innerHTML = `
        <div class="notification-content">
          <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
          <span>${message}</span>
        </div>
      `;
      
      document.body.appendChild(notification);
      
      // Animate in
      setTimeout(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
      }, 10);
      
      // Auto dismiss after 3 seconds
      setTimeout(() => {
        notification.style.transform = 'translateY(-20px)';
        notification.style.opacity = '0';
        
        setTimeout(() => {
          notification.remove();
        }, 300);
      }, 3000);
    }

    return { validate };
  })();
});