<script>
    import Calendar from "../../calendar.svelte";

    
    const assignments = [
      { name: 'Assignment 1', dueDate: new Date(2024, 3, 10) }, // April 10, 2024
      { name: 'Assignment 2', dueDate: new Date(2024, 3, 15) }, // April 15, 2024
      { name: 'Assignment 3', dueDate: new Date(2024, 3, 20) }  // April 20, 2024
      // Add more assignments as needed
    ];
    let name=""
    let dueDate=""
    function handleSubmit(){
        console.log("submit")
    }

</script>
<svelte:head>
    <title>Assignments</title>
</svelte:head>
<h1>Assignments</h1>
<form on:submit|preventDefault={handleSubmit}>
    <label>
        Assignment:
        <input type="text" bind:value={name} />
    </label>
    <br>
    <label>
        Due Date:
        <input type="date" bind:value={dueDate} />
      </label>
    <br>
    <button type="submit">Submit</button>
</form>
<Calendar {assignments}></Calendar>