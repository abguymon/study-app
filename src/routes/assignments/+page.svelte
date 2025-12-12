<script>
    import Calendar from "../../calendar.svelte";
    import { assignments } from "$lib/stores/assignments";
    import { user } from "$lib/stores/auth";

    let name="";
    let dueDate="";
    let description = "";

    // Modal state
    let showModal = false;
    let selectedAssignment = null;
    let editName = "";
    let editDate = "";
    let editDescription = "";

    function handleSubmit(){
        if (!name || !dueDate) return;

        // Create date in local time
        const [year, month, day] = dueDate.split('-').map(Number);
        const dateObj = new Date(year, month - 1, day);

        assignments.add({
            name,
            dueDate: dateObj,
            description
        });

        name = "";
        dueDate = "";
        description = "";
    }

    function handleEventClick(event) {
        const { id, title, start, description } = event.detail;
        selectedAssignment = { id, title, start, description };

        editName = title;
        // Format date to YYYY-MM-DD for input
        // start is a Date object from FullCalendar
        const dateObj = new Date(start);
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        editDate = `${year}-${month}-${day}`;

        editDescription = description || "";
        showModal = true;
    }

    function closeModal() {
        showModal = false;
        selectedAssignment = null;
    }

    function handleUpdate() {
        if (!selectedAssignment || !editName || !editDate) return;

        const [year, month, day] = editDate.split('-').map(Number);
        const dateObj = new Date(year, month - 1, day);

        assignments.update(selectedAssignment.id, {
            name: editName,
            dueDate: dateObj,
            description: editDescription
        });

        closeModal();
    }

    function handleDelete() {
        if (!selectedAssignment) return;
        if (confirm("Are you sure you want to delete this assignment?")) {
            assignments.remove(selectedAssignment.id);
            closeModal();
        }
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
    <label>
        Description:
        <textarea bind:value={description}></textarea>
    </label>
    <br>
    <button type="submit">Submit</button>
</form>

<!-- Pass $assignments which is the array from the store -->
<Calendar assignments={$assignments} on:eventClick={handleEventClick}></Calendar>

{#if showModal}
    <div class="modal-backdrop" on:click={closeModal}>
        <div class="modal" on:click|stopPropagation>
            <h2>Edit Assignment</h2>
            <label>
                Assignment:
                <input type="text" bind:value={editName} />
            </label>
            <br>
            <label>
                Due Date:
                <input type="date" bind:value={editDate} />
            </label>
            <br>
            <label>
                Description:
                <textarea bind:value={editDescription}></textarea>
            </label>
            <div class="modal-actions">
                <button on:click={handleUpdate}>Update</button>
                <button on:click={handleDelete} class="delete-btn">Delete</button>
                <button on:click={closeModal}>Close</button>
            </div>
        </div>
    </div>
{/if}

<style>
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }
    .modal {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        min-width: 300px;
    }
    .modal-actions {
        margin-top: 1rem;
        display: flex;
        gap: 0.5rem;
    }
    .delete-btn {
        background-color: #ff4444;
        color: white;
    }
</style>
