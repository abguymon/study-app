<!-- Calendar.svelte -->
<script>
    import { onMount } from 'svelte';
    import { Calendar } from '@fullcalendar/core';
    import dayGridPlugin from '@fullcalendar/daygrid';
  
    export let assignments = [];
  
    onMount(() => {
      const calendarEl = document.getElementById('calendar');
  
      const calendar = new Calendar(calendarEl, {
        plugins: [dayGridPlugin],
        initialView: 'dayGridMonth',
        events: assignments.map(({ name, dueDate }) => ({
          title: name,
          start: dueDate,
          allDay: true
        }))
      });
  
      calendar.render();
    });
  </script>
  
  <div id="calendar"></div>
  