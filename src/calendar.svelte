<!-- Calendar.svelte -->
<script>
    import { onMount, onDestroy, createEventDispatcher } from 'svelte';
    import { Calendar } from '@fullcalendar/core';
    import dayGridPlugin from '@fullcalendar/daygrid';
  
    export let assignments = [];

    const dispatch = createEventDispatcher();
  
    let calendar;
    let calendarEl;

    onMount(() => {
        initCalendar();
    });

    // We can use a reactive statement to update events
    $: if (calendar && assignments) {
        calendar.removeAllEvents();
        calendar.addEventSource(assignments.map(({ id, name, dueDate, description }) => ({
            id: id,
            title: name,
            start: dueDate,
            allDay: true,
            extendedProps: {
                description
            }
        })));
    }

    function initCalendar() {
        if (!calendarEl) return;

        calendar = new Calendar(calendarEl, {
            plugins: [dayGridPlugin],
            initialView: 'dayGridMonth',
            events: assignments.map(({ id, name, dueDate, description }) => ({
                id: id,
                title: name,
                start: dueDate,
                allDay: true,
                extendedProps: {
                    description
                }
            })),
            eventClick: (info) => {
                dispatch('eventClick', {
                    id: info.event.id,
                    title: info.event.title,
                    start: info.event.start,
                    description: info.event.extendedProps.description,
                    originalEvent: info.event
                });
            }
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
