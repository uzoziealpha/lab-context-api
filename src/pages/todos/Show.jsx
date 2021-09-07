import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import './App.css';
import TodosContext, { api } from '@/contexts/Todos'
import Loading from '@/components/Loading'

function Show() {
  const [todo, setTodos] = React.useState([]);
  const [todo, setTodo] = React.useState("");
  const [todoEditing, setTodoEditing] = React.useState(null);
  const [editingText, setEditingText] = React.useState("");

  function handleSubmit(e) {
    e.preventDefault();

    const newTodo = {
      id: new Date().getTime(),
      text: todo,
      completed: false,
    }

    setTodos([...todos].concat(newTodo))
    setTodo("");
  }

  function deleteTodo(id) {
    const updatedTodos = [...todos].filter((todo) => todo.id !== id);

    setTodos(updatedTodos);
  }

  function toggleComplete(id) {
    const updatedTodos = [...todos].map((todo) => {
       if (todo.id === id) {
         todo.completed = !todo.completed
       }
       return todo;
    })

    setTodos(updatedTodos)

  }

  function submitEdits(id) {
    const updatedTodos = [ ...todos].map((todo) => {
      if (todo.id === id) {
        todo.text = editingText;
      }
      return todo
    })
    setTodos(updatedTodos)
    setTodoEditing(null)
    setEditingText("")
  }
    
  
  return (
    <div className="Show">
      <form onSubmit={handleSubmit}>
       <input type="text" onChange={(e) => setTodo(e.target.value)} value={todo}/>
       <button type="submit">New</button>
      </form>
      {todos.map((todo) => <div key={todo.id}>

        {todoid === todoEditing ? 
        (<input 
        type="text" 
        onChange={(e) => setEditingText(e.target.value)} 
        value={editingText}
        />) 
          : 
          (<div>{todo.text}</div>)}
        
        

        <button onClick={() => deleteTodo(todo.id)}>Delete</button>
        <input type="checkbox" 
        onChange={() => toggleComplete(todo.id)}
        checked={todo.completed} />

        
        {todoid === todoEditing ? (<button onClick={() => editTodo(todo.id)}
        >Submit Edits</button>) : (<button onClick={() => setTodoEditing(todo.id)}
        >Edit</button>)}

      

        </div>)}
    </div>
  );
}






class PagesTodosShow extends React.Component {
  componentDidMount() {
    const { id } = this.props.match.params
    const { getTodo } = api(this.context.dispatch)
    getTodo(id)
  }

  componentWillUnmount() {
    const { resetTodo } = api(this.context.dispatch)
    resetTodo()
  }

  renderShow() {
    const { show } = this.context.todos

    if (show === undefined) return <Loading />
    if (show === null) return <h2>Not Found</h2>
    return (
      <>
        <h2 className="my-3">{ show.id } | { show.title }</h2>
        <div className="list-group">
          {
            show.TodoItems.map((item) => (
              <div
                key={item.id}
                className={`list-group-item list-group-item-action ${item.checked ? 'text-decoration-through' : ''}`}
              >
                {item.name}
              </div>
            ))
          }
        </div>
      </>
    )
  }

  render() {
    return (
      <div id="pages-todos-show" className="container">
        <header className="text-center border-bottom">
          <h1>Todo Show Page</h1>
          <div>
            <Link to="/">Home Page</Link>
            <span> | </span>
            <Link to="/todos">Todos Page</Link>
          </div>
        </header>
        <main className="text-center mt-3">
          { this.renderShow() }
        </main>
      </div>
    )
  }
}

PagesTodosShow.contextType = TodosContext
PagesTodosShow.propTypes = {
  match: PropTypes.shape().isRequired
}

export default PagesTodosShow
