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
                            <div>
                                <p>Hero name: ${dataEl.name || '-'}</p>
                                <p>Citizenship: ${dataEl.citizenship || '-'}</p>
                                <p>Real name: ${dataEl.realName || '-'}</p>
                                <p>Species: ${dataEl.species || '-'}</p>
                                <p>Gender: ${dataEl.gender || '-'}</p>
                                <p>Date of Birth: ${dataEl.birthDay || '-'}</p>
                                <p>Date of death: ${dataEl.deathDay || '-'}</p>
                                <p>Status: ${dataEl.status || '-'}</p>
                                <p>Actor name: ${dataEl.actors || '-'}</p>
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
