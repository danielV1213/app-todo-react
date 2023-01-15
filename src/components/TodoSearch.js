import React, { useContext, useState } from 'react'
import '../css/TodoSearch.css';
import { TodoContext } from '../TodoContext';


function TodoSearch() {

    const { searchValue, setSearchValue } = useContext(TodoContext)

    const onSearchValueChange = (e) => {
        setSearchValue(e.target.value)
    }

    return (
        <div className='Container'>
            <input className='TodoSearch' placeholder='Buscar TODO' onChange={onSearchValueChange} value={searchValue} />
        </div>
    )
}

export { TodoSearch }