import React from 'react'
import '../css/TodoList.css';

function TodoList(props) {
    return (
        <section className='Container'>
            <ul>
                {props.children}
            </ul>
        </section>
    )
}

export { TodoList }