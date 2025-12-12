<script>
    import Calendar from "../../calendar.svelte";
    import { assignments } from "$lib/stores/assignments";
    import { user } from "$lib/stores/auth";

    let name="";
    let dueDate="";

    function handleSubmit(){
        if (!name || !dueDate) return;

        assignments.add({
            name,
            dueDate: new Date(dueDate)
        });

        name = "";
        dueDate = "";
    }

</script>
<svelte:head>
    <title>Assignments</title>
</svelte:head>
<h1>Assignments</h1>

{#if !$user}
    <p><i>You are not logged in. Assignments will be saved to your browser.</i></p>
{/if}

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

<!-- Pass $assignments which is the array from the store -->
<Calendar assignments={$assignments}></Calendar>
