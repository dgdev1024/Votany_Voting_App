///
/// \file   random.js
/// \brief  Random number functions.
///

export function randomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomColor () {
    const r = randomInt(0, 255);
    const g = randomInt(0, 255);
    const b = randomInt(0, 255);

    return `rgb(${r}, ${g}, ${b})`;
}