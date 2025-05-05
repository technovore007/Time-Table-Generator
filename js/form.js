document.addEventListener('DOMContentLoaded', () => {
  // form module
  window.form = (function(){
    const container = document.getElementById('courseContainer');
    const previewTbody = document.querySelector('#previewTable tbody');

    if(!container) {
      console.error('form.js: #courseContainer not found');
      return { validate: () => false };
    }

    function addRow(){
      const row = document.createElement('div');
      row.className = 'course-row';
      row.innerHTML = `
        <input class="code" type="text" placeholder="Course Code" />
        <input class="dur"  type="number" placeholder="Duration" min="1" />
        <input class="sess" type="number" placeholder="Sessions/Wk" min="1" />
        <button class="remove-row">✕</button>
      `;
      row.querySelector('.remove-row').onclick = () => row.remove();
      container.appendChild(row);
    }

    document.getElementById('addCourseBtn').addEventListener('click', addRow);

    // add initial row
    addRow();

    function validate(){
      const codes = Array.from(container.querySelectorAll('.code')).map(i=>i.value.trim().toUpperCase());
      const durs  = Array.from(container.querySelectorAll('.dur')).map(i=>i.value);
      const sess  = Array.from(container.querySelectorAll('.sess')).map(i=>i.value);

      if(codes.some(c=>!c) || durs.some(d=>!d) || sess.some(s=>!s)){
        alert('All fields are required.');
        return false;
      }
      if(new Set(codes).size !== codes.length){
        alert('Duplicate course codes not allowed.');
        return false;
      }

      // build preview table
      previewTbody.innerHTML = '';
      codes.forEach((c,i)=>{
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${c}</td><td>${durs[i]}</td><td>${sess[i]}</td>
          <td><button class="remove-row">✕</button></td>
        `;
        tr.querySelector('.remove-row').onclick = () => {
          tr.remove();
          container.querySelectorAll('.course-row')[i].remove();
        };
        previewTbody.appendChild(tr);
      });

      // store for timetable
      window.courses = codes.map((c,i)=>({
        id: c,
        duration: parseInt(durs[i],10),
        sessions: parseInt(sess[i],10)
      }));
      return true;
    }

    return { validate };
  })();
});
