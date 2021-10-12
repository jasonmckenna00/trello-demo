<template>


    <div
        class="task"
        
        draggable
        @dragstart="pickUpTask($event, taskIndex, columnIndex)"
        @click="goToTask(task)"
        @drop.stop="moveTaskOrColumn($event, column.tasks, columnIndex, taskIndex)"
        >
        <span class="w-full flex-no-shrink font-bold">
            {{ task.name }}
        </span>
        <p
        v-if="task.description"
        class="w-full flex-no-shrink mt-1 text-sm"
        >
        {{ task.description }}
        </p>
    </div>
</template>

<script>
export default {
    props:{
        task:{
            type: Object,
            required: true
        },
        taskIndex:{
            type: Number,
            required:true
        },
        column:{
            type:Object,
            required: true
        },
        columnIndex:{
            type: Number,
            required:true
        },
        board:{
            type: Object,
            required: true
        }
    },
    methods:{
        moveTask (e, toColumnTasks, toTaskIndex) {
            const fromColumnIndex = e.dataTransfer.getData('from-column-index')
            const fromColumnTasks = this.board.columns[fromColumnIndex].tasks
            const fromTaskIndex = e.dataTransfer.getData('from-task-index')
            this.$store.commit('MOVE_TASK', { fromColumnTasks, toColumnTasks, fromTaskIndex, toTaskIndex })
        },
        pickUpTask (event, fromTaskIndex, fromColumnIndex) { // loads in task + column info on drag
            event.dataTransfer.effectAllowed = 'move'
            event.dataTransfer.dropEffect = 'move'
            event.dataTransfer.setData('from-task-index', fromTaskIndex) // dont want to stringify object on transfer bc itll become new object in state
            event.dataTransfer.setData('from-column-index', fromColumnIndex)
            event.dataTransfer.setData('type', 'task')
        },
        goToTask (task) {
            this.$router.push({ name: 'task', params: { id: task.id } })
        },
        moveTaskOrColumn (event, toColumnTasks, toColumnIndex, toTaskIndex) {
            const type = event.dataTransfer.getData('type')
            if (type === 'task') {
                this.moveTask(event, toColumnTasks, toTaskIndex !== undefined ? toTaskIndex : toColumnTasks.length)
            } else {
                this.moveColumn(event, toColumnIndex)
            }
        },
        moveColumn (event, toColumnIndex) {
            const fromColumnIndex = event.dataTransfer.getData('from-column-index')
            this.$store.commit('MOVE_COLUMN', { fromColumnIndex, toColumnIndex })
        },
    }

}
</script>

<style scoped>

</style>
