import React, { useReducer, createContext } from 'react'
import PropTypes from 'prop-types'
import produce from 'immer'
import axios from 'axios'

const actions = {
  setTodos: (payload) => ({ type: 'setTodos', payload }),
  unsetTodos: () => ({ type: 'unsetTodos' }),
  setTodo: (payload) => ({ type: 'setTodo', payload }),
  unsetTodo: () => ({ type: 'unsetTodo' })
}

const api = (dispatch) => ({
  getTodos: () => {
    axios({
      method: 'GET',
      url: 'https://fswdi-api-todos.herokuapp.com/api/todos'
    }).then((resp) => {
      dispatch(actions.setTodos(resp.data))
    })
  },
  resetTodos: () => {
    dispatch(actions.unsetTodos())
  },
  createTodo: (values) => new Promise((resolve, reject) => axios({
    method: 'POST',
    url: 'https://fswdi-api-todos.herokuapp.com/api/todos',
    data: values
  }).then((resp) => {
    resolve(resp)
  }).catch((err) => {
    reject(err)
  })),
  getTodo: (TodoId) => {
    axios({
      method: 'GET',
      url: `https://fswdi-api-todos.herokuapp.com/api/todos/${TodoId}`
    }).then((resp) => {
      dispatch(actions.setTodo(resp.data))
    }).catch(() => {
      dispatch(actions.setTodo({ todo: null }))
    })
  },
  resetTodo: () => {
    dispatch(actions.unsetTodo())
  }
})

const initialState = {
  meta: null,
  index: undefined,
  show: undefined
}
const reducer = (state, action) => {
  switch (action.type) {
    case 'setTodos': {
      return produce(state, (draft) => {
        draft.meta = action.payload.meta
        draft.index = action.payload.todos
      })
    }
    case 'unsetTodos': {
      return produce(state, (draft) => {
        draft.meta = null
        draft.index = undefined
      })
    }
    case 'setTodo': {
      return produce(state, (draft) => {
        draft.show = action.payload
      })
    }
    case 'unsetTodo': {
      return produce(state, (draft) => {
        draft.show = undefined
      })
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

const TodosContext = createContext()
const TodosProvider = ({ children }) => {
  const [todos, dispatch] = useReducer(reducer, initialState)
  return <TodosContext.Provider value={{ todos, dispatch }}>{children}</TodosContext.Provider>
}
TodosProvider.propTypes = {
  children: PropTypes.element.isRequired
}

export { TodosProvider, api }
export default TodosContext
