import React, { createContext, useState } from 'react'
import { useLocalStorage } from './useLocalStorage'

// Creación de contexto para compartir el estado de las distintas "generaciones" de componentes
const TodoContext = createContext()

function TodoProvider(props) {
    // Comentarios de teoría
    /*
    "props" nos permite obtener todas las propiedades que se le pasen al componente desde el index o el otro documento desde donde se esté llamando
    Propiedades para obtener propiedades
    props.nombreProp -> nos permite obtener la propiedad particular que requerimos.
    props.children -> nos permite obtener los elementos hijos que se estén renderizando dentro del componente desde el otro documento.
    */

    // Uso del localStorage para el almacenamiento y la persistencia de los todoItems creados por el usuario.
    // Recordar: JSON.stringify() permite pasar a texto cualquier tipo de dato o estructura para que pueda ser almacenado
    // sin problema en el localStorage
    // Recordar: JSON.parse() permite convertir a su tipo original cualquier tipo de dato o estructura que ya ha sido
    // previamente "stringifyado"

    const {
        item: todos,
        saveItem: saveTodos,
        loading,
        error
    } = useLocalStorage('TODOS_V1', [])
    const [searchValue, setSearchValue] = useState('')
    const [openModal, setOpenModal] = useState(false)

    const completedTodos = todos.filter(todo => !!todo.completed).length
    const totalTodos = todos.length

    let searchedTodos = []

    // Este condicional permite que, dependiendo del input que el usuario digite, se filtre el arreglo de todo's.
    // Una vez se encuentran similitudes entre algún (o algunos) elemento(s) del arreglo, se muestran estos en la UI.
    // Si no se está realizando ninguna búsqueda, ...
    // ... se seguirán renderizando todos los elementos que estén actualmente en el array.

    if (!searchValue.length >= 1) {
        searchedTodos = todos
    } else {
        searchedTodos = todos.filter(todo => {
            const todoText = todo.text.toLowerCase()
            const searchText = searchValue.toLowerCase()
            return todoText.includes(searchText)
        })
    }

    // FUNCIONES DE CRUD

    const completeTodo = (text) => {
        const todoIndex = todos.findIndex(todo => todo.text === text)

        const newTodos = [...todos]
        // Forma corta de cambiar el estado 'completed' del TODO
        todos[todoIndex].completed = true

        // Actualizar array de TODOs
        saveTodos(newTodos)

        // Forma larga
        // todos[todoIndex] = {

        //   text: todos[todoIndex.text],

        //   completed: true,
        // };
    }

    const addTodo = (text) => {
        const newTodos = [...todos]
        newTodos.push({
            completed: false,
            text,
        })
        saveTodos(newTodos)
    }

    // Función para eliminar TODOs

    const deleteTodo = (text) => {
        const todoIndex = todos.findIndex(todo => todo.text === text)
        const newTodos = [...todos]
        newTodos.splice(todoIndex, 1) // Con el método splice() se especifica desde dónde se quiere dividir el array (primer param)
        // y en cuantas cantidades (segundo param), para así (en este caso), eliminar el elemento específico del array.
        saveTodos(newTodos)
    }


    // Manejo de efectos:
    // El useEffect se ejecuta justo antes de que todos los componentes estén listos para renderizar.
    // Cuando se quiere ejecutar justo después de que los componentes se renderizaron, se usa un useLayoutEffect

    // console.log('Render (antes del use effect)')

    // useEffect(() => {
    //   console.log('use effect')
    // }, [totalTodos])

    // Cuando se envía un array vacío al final del useEffect, este solo se ejecuta la primera vez que la app renderiza, 
    // de lo contrario, se ejecutará cada vez que la app renderice.
    // Si dentro del array se envía alguna variable específica, el useEffect se ejecutará cada vez que esta variable cambie

    // console.log('Render (luego del use effect)')


    return (
        <TodoContext.Provider value={{
            loading,
            error,
            totalTodos,
            completedTodos,
            searchValue,
            setSearchValue,
            searchedTodos,
            addTodo,
            completeTodo,
            deleteTodo,
            openModal,
            setOpenModal
        }}>
            {props.children}
        </TodoContext.Provider>
    )
}

export { TodoContext, TodoProvider }