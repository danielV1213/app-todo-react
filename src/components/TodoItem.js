import React from 'react'
import '../css/TodoItem.css'
import { BsCheckLg } from 'react-icons/bs'
import { AiFillDelete } from 'react-icons/ai'

function TodoItem(props) {

    return (
        <li className={`TodoItem ${props.completed && 'TodoItem--complete'}`}>
            <span className={`Icon Icon-check ${props.completed && 'Icon-check--active'}`} onClick={props.onComplete}><BsCheckLg /></span>
            <p className={`TodoItem-p ${props.completed && 'TodoItem-p--complete'}`}>{props.text}</p>
            <span className='Icon Icon-delete' onClick={props.onDelete}><AiFillDelete /></span>
        </li>
    )
}

export { TodoItem }