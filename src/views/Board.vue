<template>
  <div class="board">
    <div class="flex flex-row items-start">
      <div class="column"
        v-for="(column, $columnIndex) of board.columns"
        :key="$columnIndex"
        draggable
        @dragstart.self="pickUpColumn($event, $columnIndex)"
        @drop="moveTaskOrColumn($event, column.tasks, $columnIndex)"
        @dragover.prevent
        @dragenter.prevent
        >

        <div class="flex items-center mb-2 font-bold">
          {{ column.name }}
        </div>
        <div class="list-reset">
          <div
            class="task"
            v-for="(task, $taskIndex) of column.tasks"
            :key="$taskIndex"
            draggable
            @dragstart="pickUpTask($event, $taskIndex, $columnIndex)"
            @click="goToTask(task)"
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

          <input type="text" class="block p-2 w-full bg-transparent"
            placeholder="+ Enter new Task"
            @keyup.enter="createTask($event,column.tasks)"
           />
        </div>
      </div>
    </div>

    <div class="task-bg" v-if="isTaskOpen" @click.self="close">
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['board']),
    isTaskOpen () {
      return this.$route.name === 'task'
    }
  },
  methods: {
    goToTask (task) {
      this.$router.push({ name: 'task', params: { id: task.id } })
    },
    close () {
      this.$router.push({ name: 'board' })
    },
    createTask (event, tasks) {
      this.$store.commit('CREATE_TASK', {
        tasks,
        name: event.target.value
      })
      event.target.value = ''
    },
    pickUpTask (event, taskIndex, fromColumnIndex) { // loads in task + column info on drag
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.dropEffect = 'move'
      event.dataTransfer.setData('task-index', taskIndex) // dont want to stringify object on transfer bc itll become new object in state
      event.dataTransfer.setData('from-column-index', fromColumnIndex)
      event.dataTransfer.setData('type', 'task')
    },
    moveTask (e, toColumnTasks) {
      const fromColumnIndex = e.dataTransfer.getData('from-column-index')
      const fromColumnTasks = this.board.columns[fromColumnIndex].tasks
      const taskIndex = e.dataTransfer.getData('task-index')
      this.$store.commit('MOVE_TASK', { fromColumnTasks, toColumnTasks, taskIndex })
    },
    pickUpColumn (event, fromColumnIndex) {
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.dropEffect = 'move'
      event.dataTransfer.setData('from-column-index', fromColumnIndex)
      event.dataTransfer.setData('type', 'column')
    },
    moveColumn (event, toColumnIndex) {
      const fromColumnIndex = event.dataTransfer.getData('from-column-index')
      this.$store.commit('MOVE_COLUMN', { fromColumnIndex, toColumnIndex })
    },
    moveTaskOrColumn (event, toColumnTasks, toColumnIndex) {
      const type = event.dataTransfer.getData('type')
      if (type === 'task') {
        this.moveTask(event, toColumnTasks)
      } else {
        this.moveColumn(event, toColumnIndex)
      }
    }
  }
}
</script>

<style lang="css">
.task {
  @apply flex items-center flex-wrap shadow mb-2 py-2 px-2 rounded bg-white text-grey-darkest no-underline;
}

.column {
  @apply bg-grey-light p-2 mr-4 text-left shadow rounded;
  min-width: 350px;
}

.board {
  @apply p-4 bg-teal-dark h-full overflow-auto;
}

.task-bg {
  @apply pin absolute;
  background: rgba(0, 0, 0, 0.5);
}
</style>
