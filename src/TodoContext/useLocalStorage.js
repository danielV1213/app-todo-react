import React, { useEffect, useState } from "react";

// Creación de un custom react hook para el localStorage
// Este hook funciona con cualquier tipo de dato que se quiera setear en el localStorage
// la diferencia es que, a la hora de usarlo, tendremos que pasarle dos valores (nombre -> key, tipo de dato -> value)
// Es decir: const [estilo, setEstilo] = useLocalStorage('ESTILO_V1', {})

function useLocalStorage(itemName, initialValue) {
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(true)
    const [item, setItem] = useState(initialValue)

    // Aquí estamos usando el useEffect para simular que se está trayendo info de una API
    // Lo que se hace es que, con el setTimeout, no se ejecuta el código del custom hook, hasta dentro de 1000ms (1s)
    useEffect(() => {
        setTimeout(() => {
            try {
                const localStorageItem = localStorage.getItem(itemName)
                let parsedItem

                if (!localStorageItem) {
                    localStorage.setItem(itemName, JSON.stringify(initialValue)) // En caso de que no existan todo's previamente, se setea por defecto un array vacío.
                    parsedItem = initialValue
                } else {
                    parsedItem = JSON.parse(localStorageItem) // En caso de que existan, se transforman en arreglo de nuevo.
                }

                setItem(parsedItem)
                setLoading(false)
            } catch (error) {
                setError(error)
            }
        }, 2000)
    })

    // Función para marcar los TODOs como completados

    const saveItem = (newItem) => {
        try {
            const stringifiedItem = JSON.stringify(newItem)
            localStorage.setItem(itemName, stringifiedItem)
            setItem(newItem)
        } catch (error) {
            setError(error)
        }
    }

    return {
        item,
        saveItem,
        loading,
        error,
    }
}

export { useLocalStorage }