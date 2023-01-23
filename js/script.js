'use strict'

const select = document.querySelector('select')
const container = document.querySelector('.container')
const header = document.querySelector('.wrap')
const scrollBtn = document.querySelector('.up')

let isMale = true
let isFemale = true
let movieSelect

const response = fetch('db/dbHeroes.json').then(res => res.json())

const animate = ({ timing, draw, duration }) => {
    let start = performance.now();

    requestAnimationFrame(function animate(time) {
        let timeFraction = (time - start) / duration;
        if (timeFraction > 1) timeFraction = 1;

        let progress = timing(timeFraction);

        draw(progress);

        if (timeFraction < 1) {
            requestAnimationFrame(animate);
        }
    });
}

const scrollTop = () => {
    container.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    })
}

const makeMovieList = () => {
    let movieList = new Set()

    const makeOption = (val) => {
        const newEl = document.createElement('option')

        newEl.value = val
        newEl.textContent = val
        select.append(newEl)
    }

    response
        .then(data => {
            data.forEach(dataEl => {
                if (dataEl.movies) {
                    dataEl.movies.forEach(el => movieList.add(el.trim()))
                }
            });
        })

        .finally(() => {
            movieList = [...movieList].sort()

            makeOption('Show all Heroes')

            movieList.forEach(movie => {
                makeOption(movie)
            })
        })
}

const createCard = (movie, isMale, isFemale) => {
    container.innerHTML = ''

    scrollTop()

    const card = (dataEl) => {
        const newEl = document.createElement('div')
        newEl.classList.add('card')
        newEl.innerHTML =
            `<div class="card-info">
                <h1>
                    ${dataEl.name}
                </h1>
                <div class="info-text">
                    <div class="left">
                        <p>Hero name:</p>
                        <p>Citizenship:</p>
                        <p>Real name:</p>
                        <p>Species:</p>
                        <p>Gender:</p>
                        <p>Date of Birth:</p>
                        <p>Date of death:</p>
                        <p>Status:</p>
                        <p>Actor name:</p>
                    </div>
                    <div class="right">
                        <p>${dataEl.name || '-'}</p>
                        <p>${dataEl.citizenship || '-'}</p>
                        <p>${dataEl.realName || '-'}</p>
                        <p>${dataEl.species || '-'}</p>
                        <p>${dataEl.gender || '-'}</p>
                        <p>${dataEl.birthDay || '-'}</p>
                        <p>${dataEl.deathDay || '-'}</p>
                        <p>${dataEl.status || '-'}</p>
                        <p>${dataEl.actors || '-'}</p>
                    </div>
                </div>
            </div>`
        newEl.style.backgroundImage = `url(dbimage${dataEl.photo})`
        container.append(newEl)
    }

    const whatGender = (dataEl, isMale, isFemale) => {
        if (isMale && dataEl.gender === 'male') {
            card(dataEl)
        }
        if (isFemale && (dataEl.gender === 'Female' || dataEl.gender === 'female')) {
            card(dataEl)
        }
    }

    if (movie === 'Show all Heroes') {
        response
            .then(data => {
                data.forEach(dataEl => {
                    whatGender(dataEl, isMale, isFemale)
                });
            })
    } else {
        response
            .then(data => {
                data.forEach(dataEl => {
                    if (dataEl.movies &&
                        (dataEl.movies.includes(movie) || dataEl.movies.includes(`${movie} `))) {
                        whatGender(dataEl, isMale, isFemale)
                    }
                });
            })
    }
}

const changeCards = () => {
    const duration = 300

    animate({
        duration: duration,
        timing(timeFraction) {
            return timeFraction;
        },
        draw(progress) {
            container.style.opacity = (1 - progress) + '';
        }
    });

    if (movieSelect && (isMale || isFemale)) {
        setTimeout(createCard, duration, movieSelect, isMale, isFemale)

        setTimeout(() => {
            animate({
                duration: duration,
                timing(timeFraction) {
                    return timeFraction;
                },
                draw(progress) {
                    container.style.opacity = progress + '';
                }
            })
        }, duration)
    } else {
        setTimeout(() => {
            container.innerHTML = '<h1 class="title">Marvel</h1>'
        }, duration)

        setTimeout(() => {
            animate({
                duration: duration,
                timing(timeFraction) {
                    return timeFraction;
                },
                draw(progress) {
                    container.style.opacity = progress + '';
                }
            })
        }, duration)
    }
}

makeMovieList()

select.addEventListener('change', () => {
    movieSelect = select.options[select.selectedIndex].value
    changeCards()
})

container.addEventListener('mouseenter', (e) => {
    if (e.target.matches('.card')) {
        let tmp = e.target.querySelector('.card-info')

        animate({
            duration: 150,
            timing(timeFraction) {
                return timeFraction;
            },
            draw(progress) {
                tmp.style.bottom = (1 - progress) * -90 + '%';
            }
        });
    }
}, true)

container.addEventListener('mouseleave', (e) => {
    if (e.target.matches('.card')) {
        let tmp = e.target.querySelector('.card-info')

        animate({
            duration: 150,
            timing(timeFraction) {
                return timeFraction;
            },
            draw(progress) {
                tmp.style.bottom = progress * -90 + '%';
            }
        });
    }
}, true)

header.addEventListener('click', (e) => {
    if (e.target.matches('#male') || e.target.matches('#female')) {
        const maleVal = document.getElementById('male')
        const femaleVal = document.getElementById('female')

        isMale = maleVal.checked
        isFemale = femaleVal.checked

        changeCards()
    } else if (e.target.matches('a')) {
        e.preventDefault()
        scrollTop()
    }
})

document.addEventListener('scroll', () => {
    const top = document.documentElement.scrollTop

    if (top > 500) {
        scrollBtn.style.opacity = (top / 10000) * 5 + ''
        scrollBtn.style.visibility = 'visible'
    } else {
        scrollBtn.style.visibility = 'hidden'
    }
})
