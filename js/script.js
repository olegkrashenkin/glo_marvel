'use strict'

const select = document.querySelector('select')
const container = document.querySelector('.container')

const response = fetch('../db/dbHeroes.json').then(res => res.json())

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

const makeMovieList = () => {
    let movieList = new Set()

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

            movieList.forEach(movie => {
                const newEl = document.createElement('option')

                newEl.value = movie
                newEl.textContent = movie
                select.append(newEl)
            })
        })
}

const createCard = (movie) => {
    container.innerHTML = ''
    container.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    })

    response
        .then(data => {
            data.forEach(dataEl => {
                if (dataEl.movies &&
                    (dataEl.movies.includes(movie) || dataEl.movies.includes(`${movie} `))) {
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
                    newEl.style.backgroundImage = `url(../${dataEl.photo})`
                    container.append(newEl)
                }
            });
        })
}

makeMovieList()

select.addEventListener('change', () => {
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

    if (select.options[select.selectedIndex].value) {
        setTimeout(createCard, duration, select.options[select.selectedIndex].value)

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
