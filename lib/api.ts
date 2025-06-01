// lib/api.ts
export const fetchExercises = async (): Promise<any[]> => {
    const response = await fetch('https://exercisedb.p.rapidapi.com/exercises', {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '921cb28315msh1788e9c1ca4c8f1p19a4f8jsn2c9db9c4bef9',
            'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
        }
    });

    if (!response.ok) {
        throw new Error('Error al obtener los ejercicios');
    }

    return response.json();
};
