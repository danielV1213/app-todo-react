import React from 'react'
import '../css/CreateTodoButton.css';
import { MdAdd } from 'react-icons/md';

function CreateTodoButton(props) {

    const onClickButton = () => {
        !props.openModal ? props.setOpenModal(true) : props.setOpenModal(false)
        // Otra manera de hacer esto es usando el prevState del useState()
        // props.setOpenModal(prevState => !prevState)
    }

    return (
        <button className="CreateTodoButton" onClick={onClickButton}><MdAdd /></button>
    )
}

export { CreateTodoButton }