// Import hooks
import React, { useContext } from 'react'
// Import components
import { TodoContext } from './TodoContext'
import { TodoCounter } from './components/TodoCounter'
import { TodoSearch } from './components/TodoSearch'
import { TodoList } from './components/TodoList'
import { TodoItem } from './components/TodoItem'
import { CreateTodoButton } from './components/CreateTodoButton'
import { Modal } from './components/Modal'
import { TodoForm } from './components/TodoForm'
import { TodosError } from './components/TodosError'
import { TodosLoading } from './components/TodosLoading'
import { EmptyTodos } from './components/EmptyTodos'
// Import UI
import './css/AppUI.css'

function AppUI() {
    const {
        error,
        loading,
        searchedTodos,
        completeTodo,
        deleteTodo,
        openModal,
        setOpenModal,
    } = useContext(TodoContext)

    return (
        // El React.Fragment es un componente invisible que permite realizar todos los cálculos internos sin afectar la UI de nuestra APP.
        <React.Fragment>
            <TodoCounter />
            <TodoSearch />
            <TodoList>
                {error && <TodosError error={error} />}
                {loading && <TodosLoading />}
                {(!loading && !searchedTodos.length) && <EmptyTodos />}

                {searchedTodos.map(todo => (
                    <TodoItem
                        key={todo.text}
                        text={todo.text}
                        completed={todo.completed}
                        onComplete={() => completeTodo(todo.text)}
                        onDelete={() => deleteTodo(todo.text)}
                    />
                ))}
            </TodoList>

            {!!openModal && (
                <Modal>
                    <TodoForm />
                </Modal>
            )}

            <CreateTodoButton
                setOpenModal={setOpenModal}
                openModal={openModal}
            />
        </React.Fragment>
    )
}

export { AppUI }