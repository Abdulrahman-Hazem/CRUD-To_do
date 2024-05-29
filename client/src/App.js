import { useState, useRef, useEffect } from "react";

const API_BASE = "http://localhost:3001"; // backend URI

function App() {
  const [todos, setTodos] = useState([]);
  const [popupActive, setPopupActive] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState(null);
  const [deleteConfirmationActive, setDeleteConfirmationActive] = useState(false);
  const [newTodo, setNewTodo] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    GetTodos();
  }, []);

  const GetTodos = () => {
    fetch(API_BASE + "/todos") // sends an API request to "/todo" in backend
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => console.error("Error: ", err));
  };

  const completeTodo = async (id) => {
    const data = await fetch(API_BASE + "/todo/complete/" + id).then((res) =>
      res.json()
    );

    setTodos((todos) =>
      todos.map((todo) => {
        if (todo._id === data._id) {
          todo.complete = data.complete;
        }
        return todo;
      })
    );
  };

  const deleteTodo =  (id) => {
    const data =  fetch(API_BASE + "/todo/delete/" + id, {
      method: "DELETE",
    }).then((res) => res.json());

    setTodos((todos) => todos.filter((todo) => todo._id !== data._id));
  };

  const confirmDelete = (todoId) => {
    setTodoToDelete(todoId); // Store the ID of the todo to delete
    setDeleteConfirmationActive(true); // Activate the delete confirmation popup
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(API_BASE + "/todo/delete/" + todoToDelete, {
        method: "DELETE",
      });

      if (response.ok) {
        // Delete was successful, update todos state
        setTodos((todos) => todos.filter((todo) => todo._id !== todoToDelete));
      } else {
        // Handle error scenario
        console.error("Failed to delete todo");
      }
    } catch (error) {
      console.error("Error occurred while deleting todo:", error);
    } finally {
      setDeleteConfirmationActive(false); // Close the confirmation popup after deletion (whether successful or not)
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmationActive(false); // Close the confirmation popup without deleting
  };

  const addTodo = async () => {
    const data = await fetch(API_BASE + "/todo/new/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: newTodo
      })
    }).then(res => res.json());
    
    window.location.reload();

    setTodos([...todos, data]);
    setPopupActive(false);
    setNewTodo("");
  };

  const handleKeyDown = (e) => {
    // Check if the pressed key is Enter (key code 13)
    if (e.key === 'Enter') {
      // Trigger the addTodo function when Enter is pressed
      addTodo();
    }
  };

  useEffect(() => {
    // Focus on the input when the popup becomes active
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [popupActive]);

  return (
    <div className="App">
      <h1>Welcome Abdulrahman</h1>
      <h4>Your Tasks</h4>
      <div className="todos">
        {todos.map((todo) => (
          <div
            className={
              "todo " + (todo.complete ? "is-complete" : "not-complete")
            } onClick={() => completeTodo(todo._id)}
            key={todo._id}
          >
            <div className="checkbox"></div>
            <div className="text">{todo.text}</div>
            <div className="delete-todo" onClick={() => confirmDelete(todo._id)}>x</div>
          </div>
        ))}
      </div>
      <div className="addPopup" onClick={() => setPopupActive(true)}>+</div>
      {popupActive ? (
        <div className="popup">
          <div className="closePopup" onClick={() => setPopupActive(false)}>x</div>
          <div className="content">
            <h3>Add Task</h3>
            <input
              type="text"
              className="add-todo-input"
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={handleKeyDown}
              value={newTodo}
              ref={inputRef}
            />
            <div className="button" onClick={addTodo}>Create Task</div>
          </div>
        </div>
      ) : (
        ""
      )}
      {deleteConfirmationActive && (
        <div className="popup">
          <div className="closePopup" onClick={() => setDeleteConfirmationActive(false)}>x</div>
          <div className="content">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this task?</p>
            <div className="button" onClick={handleDeleteConfirm}>Yes</div>
            <div className="button" onClick={handleDeleteCancel}>No</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
