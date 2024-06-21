import { createPlugin } from 'startupjs/registry'
import express from 'express'
import addTodo from './server/api/addTodo.js'
import deleteTodo from './server/api/deleteTodo.js'
import getTodos from './server/api/getTodos.js'
import { initTodos, validate } from './server/api/todos.js'
import Todos from './app/todos.tsx'
const plugins = createPlugins()

const defaultTodos = [
  { id: 1, title: 'Todo 1', value: 'todo 1 text', date: Date.now() },
  { id: 2, title: 'Todo 2', value: 'todo 2 text', date: Date.now() },
  { id: 3, title: 'Todo 3', value: 'todo 3 text', date: Date.now() }
]

export default {
  plugins: {
    [plugins.todoPlugin]: {
      server: {
        defaultTodos,
        validationRules: {
          title: {
            required: true,
            minLength: 3
          },
          maxTasks: 10
        }
      },
      client: { }
    }
  }
}
const myMiddleware = (req, res, next) => {
  console.log('Middleware executed!')
  next()
}

function createPlugins () {
  return {
    todoPlugin: createPlugin({
      name: 'todoPlugin',
      client: () => ({
        renderRoot ({ children }) {
          return <>
            <Todos />
          </>
        }
      }),
      server: ({ defaultTodos, validationRules }) => ({
        logs: (expressApp) => {
          expressApp.use('/api', (req, res, next) => {
            console.log(`Запрос к ${req.originalUrl} от ${req.ip}`)
            next()
          })
        },
        beforeSession: (expressApp) => {
          initTodos(defaultTodos)
          // expressApp.use('/api', (req, res, next) => {
          // next()
          // })
        },
        middleware: (expressApp) => {
          expressApp.use(express.json())
          expressApp.use('/api/add', (req, res, next) => {
            const validationResult = validate(req.body.todo, validationRules)
            if (!validationResult.isValid) return res.status(400).json(validationResult.errors)
            // if (!req.headers.authorization) {
            // return res.status(401).json({ error: 'Unauthorized' })
            // }
            req.body.todo.date = Date.now()
            next()
          })
        },
        api: expressApp => {
          expressApp.get('/api/get', myMiddleware, getTodos)
          expressApp.post('/api/add', addTodo)
          expressApp.delete('/api/delete/:id', deleteTodo)
        }
      })
    })
  }
}
