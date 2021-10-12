<template>
    <div>
        <div
            class="column"

            draggable
            @dragstart.self="pickUpColumn($event, columnIndex)"
            @drop="moveTaskOrColumn($event, column.tasks, columnIndex)"
            @dragover.prevent
            @dragenter.prevent
        >
            <div class="column-header">
                <div class="font-bold">
                    {{ column.name }}
                </div>
                <div class="remove-button" @click="removeColumn(columnIndex)">X
                    <span class="remove-button-text">Remove</span>
                </div>
            </div>
            <BoardTask
                v-for="(task, $taskIndex) of column.tasks"
                :key=$taskIndex
                :task="task"
                :taskIndex="$taskIndex"
                :column="column"
                :columnIndex="columnIndex"
                :board="board"

            />
            <input type="text" class="block p-2 w-full bg-transparent"
                placeholder="+ Enter new Task"
                @keyup.enter="createTask($event,column.tasks)"
            />
            
        </div>

    </div>
</template>

<script>
import BoardTask from '@/components/BoardTask'
export default {
  components: { BoardTask },
  props: {
    board: {
      type: Object,
      required: true
    },
    column: {
      type: Object,
      required: true
    },
    columnIndex: {
      type: Number,
      required: true
    }
  },
  methods: {
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
    moveTask (e, toColumnTasks, toTaskIndex) {
      const fromColumnIndex = e.dataTransfer.getData('from-column-index')
      const fromColumnTasks = this.board.columns[fromColumnIndex].tasks
      const fromTaskIndex = e.dataTransfer.getData('from-task-index')
      this.$store.commit('MOVE_TASK', { fromColumnTasks, toColumnTasks, fromTaskIndex, toTaskIndex })
    },

    pickUpColumn (event, fromColumnIndex) {
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.dropEffect = 'move'
      event.dataTransfer.setData('from-column-index', fromColumnIndex)
      event.dataTransfer.setData('type', 'column')
    },

    createTask (event, tasks) {
      this.$store.commit('CREATE_TASK', {
        tasks,
        name: event.target.value
      })
      event.target.value = ''
    },
    removeColumn (columnIndex) {
      this.$store.commit('REMOVE_COLUMN', { columnIndex })
    }
  }
}
</script>

<style scoped>

.column {
  @apply bg-grey-light p-2 mr-4 text-left shadow rounded;
  min-width: 350px;
}

.column-header{
    display: flex;
    margin: 2px;
    justify-content:space-between;
}

.remove-button-text{
  visibility: hidden;
  width: 120px;
  background-color: lightslategray;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  position: absolute;
  z-index: 1;
}

.remove-button:hover .remove-button-text {
    visibility: visible;
}
</style>
