<!-- Calendar.svelte -->
<script>
    import { onMount, onDestroy } from 'svelte';
    import { Calendar } from '@fullcalendar/core';
    import dayGridPlugin from '@fullcalendar/daygrid';
  
    export let assignments = [];
  
    let calendar;
    let calendarEl;

    onMount(() => {
        initCalendar();
    });

    // We can use a reactive statement to update events
    $: if (calendar && assignments) {
        calendar.removeAllEvents();
        calendar.addEventSource(assignments.map(({ name, dueDate }) => ({
            title: name,
            start: dueDate,
            allDay: true
        })));
    }

    function initCalendar() {
        if (!calendarEl) return;

        calendar = new Calendar(calendarEl, {
            plugins: [dayGridPlugin],
            initialView: 'dayGridMonth',
            events: assignments.map(({ name, dueDate }) => ({
                title: name,
                start: dueDate,
                allDay: true
            }))
        });
        calendar.render();
    }

    onDestroy(() => {
        if (calendar) {
            calendar.destroy();
        }
    });
</script>
  
<div bind:this={calendarEl} id="calendar"></div>
