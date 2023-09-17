// ----------------------------------------------------------
// INFO:
// This JS file is loaded across ALL webpages.
//
// -----------------------------------------------------------


import { Moving_Points } from "/scripts/moving-points.js"
// import { onPageLoad } from "/headless-cms-scripts/client-side-router.js"



function init_moving_points() {    
    if(window.location.pathname !== "/") return
    new Moving_Points(document.querySelector("#hero-canvas"), 30)
}


window.addEventListener("load", () => {
    init_moving_points()
})


// // WHEN THE HOMEPAGE LOADS
// onPageLoad('/', () => {

//     init_moving_points()

//     document.querySelector(".hero").style.height = `calc(100vh - ${window.getComputedStyle(document.querySelector("header")).height})`

//     setTimeout(() => {
//         document.querySelector("#scroll-down-icon").style.opacity = "1"
//     }, 1500)

// })
