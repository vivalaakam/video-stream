import Video from './video'
import './style.scss'

function createElement(tag, className) {
    const element = document.createElement(tag)
    element.classList.add(className)

    return element
}

document.addEventListener("DOMContentLoaded", function (event) {
    window.video = new Video()
})