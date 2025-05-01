
export function convertirUpperCamelCase(str) {
    // Dividir la cadena en palabras separadas por espacios
    let words = str.trim().split(' ');

    // Capitalizar la primera letra de cada palabra
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
    }

    // Unir las palabras nuevamente con un espacio entre ellas
    return words.join(' ');
}