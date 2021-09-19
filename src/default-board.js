import { uuid } from './utils'

export default {
  name: 'workshop',
  columns: [
    {
      name: 'todo',
      tasks: [
        {
          description: 'asdasd',
          name: 'first task',
          id: uuid(),
          userAssigned: null
        },
        {
          description: 'qweqwe',
          name: 'second task',
          id: uuid(),
          userAssigned: null
        },
        {
          description: 'gfgfg',
          name: 'and thrid',
          id: uuid(),
          userAssigned: null
        }
      ]
    },
    {
      name: 'in-progress',
      tasks: [
        {
          description: 'tttt',
          name: 'first task',
          id: uuid(),
          userAssigned: null
        }
      ]
    },
    {
      name: 'done',
      tasks: [
        {
          description: 'kjhg',
          name: 'first task',
          id: uuid(),
          userAssigned: null
        }
      ]
    }
  ]
}
