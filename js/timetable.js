window.timetable = (function(){
    const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const weekdaySlots = ['9:00 AM','10:00 AM','11:00 AM','1:00 PM','2:00 PM','3:00 PM','4:00 PM'];
    const saturdaySlots = ['9:00 AM','10:00 AM','11:00 AM'];
  
    function createGrid(){
      return days.map(day => ({
        day,
        slots: (day==='Saturday'? saturdaySlots: weekdaySlots).map(time=>({ time, courseId:null }))
      }));
    }
  
    function isFree(slots,i,dur){
      if(i+dur>slots.length) return false;
      return slots.slice(i,i+dur).every(s=>!s.courseId);
    }
  
    function assign(course,grid){
      let assigned=0,tries=0; const used=new Set();
      while(assigned<course.sessions && tries<500){
        const pool = days.slice(0,5).filter(d=>!used.has(d));
        const day= pool.length? pool[Math.floor(Math.random()*pool.length)] : days[Math.floor(Math.random()*days.length)];
        const row = grid.find(r=>r.day===day).slots;
        const idx=Math.floor(Math.random()*(row.length-course.duration+1));
        if(isFree(row,idx,course.duration)){
          for(let j=0;j<course.duration;j++) row[idx+j].courseId=course.id;
          assigned++; used.add(day);
        }
        tries++;
      }
    }
  
    function generate(){
      const grid = createGrid();
      (window.courses||[]).forEach(c=>assign(c,grid));
  
      const container = document.getElementById('timetableGrid');
      container.innerHTML = '';
  
      // header
      container.appendChild(Object.assign(document.createElement('div'),{className:'cell header',innerText:''}));
      days.forEach(d=>container.appendChild(Object.assign(document.createElement('div'),{className:'cell header',innerText:d})));
  
      const maxSlots = weekdaySlots.length;
      for(let i=0;i<maxSlots;i++){
        // time label
        const time = weekdaySlots[i];
        container.appendChild(Object.assign(document.createElement('div'),{className:'cell header',innerText:time}));
        days.forEach(d=>{
          const slot = grid.find(r=>r.day===d).slots[i];
          container.appendChild(Object.assign(document.createElement('div'),{className:'cell',innerText:slot?slot.courseId||'Free':''}));
        });
      }
    }
  
    return { generate };
  })();
  