import React, { useContext, useState } from 'react'
import { TodoContext } from '../TodoContext'
import '../css/TodoForm.css'

function TodoForm() {
    const [newTodoValue, setNewTodoValue] = useState('')
    const {
        addTodo,
        setOpenModal
    } = useContext(TodoContext)

    const onChange = (e) => {
        setNewTodoValue(e.target.value)
    }

    const onCancel = () => {
        setOpenModal(false)
    }

    const onSubmit = (e) => {
        e.preventDefault()
        addTodo(newTodoValue)
        setOpenModal(false)
    }


    return (
        <form onSubmit={onSubmit}>
            <label>Escribe un nuevo TODO</label>
            <textarea
                value={newTodoValue}
                onChange={onChange}
                placeholder='Añade un nuevo TODO'
            />
            <div className='TodoForm-buttonContainer'>
                <button
                    type='button'
                    className='TodoForm-button TodoForm-button--cancel'
                    onClick={onCancel}
                >Cancelar
                </button>
                <button
                    type='submit'
                    className='TodoForm-button TodoForm-button--add'
                >Añadir
                </button>
            </div>
        </form>
    )
}

export { TodoForm }