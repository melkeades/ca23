import './style.styl'
import Lenis from '@studio-freight/lenis'
import gsap from 'gsap'
import CSSRulePlugin from 'gsap/CSSRulePlugin'
import CustomEase from 'gsap/CustomEase'
import ScrollTrigger from 'gsap/ScrollTrigger'
import $ from 'jquery'
import SplitType from 'split-type'

const devMode = true
const sel = (e) => document.querySelector(e)

if (devMode) {
  sel('.hero_video2').setAttribute('data-video-urls', '')
  const contactVid = sel('.contact_bg_video')
  contactVid.setAttribute('data-video-urls', '')
  cont
}

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
  direction: 'vertical', // vertical, horizontal
  gestureDirection: 'vertical', // vertical, horizontal, both
  smooth: true,
  mouseMultiplier: 1.3,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

gsap.registerPlugin(CSSRulePlugin, CustomEase, ScrollTrigger)

let lenisScroll = 0

//get scroll value
lenis.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
  // console.log({ scroll, limit, velocity, direction, progress })
  lenisScroll = scroll
})
function onReady() {
  new SplitType('#heroTitle', {
    types: 'lines',
    lineClass: 'lineParent',
    // tagName: 'span',
  })

  const heroTitle = new SplitType('#heroTitle > .lineParent', {
    types: 'lines',
  })

  const animationWrapperSuffix = '-animationWrapper'
  const animationWrapper = (className) => {
    return $('.' + className).wrap('<div class=' + className + animationWrapperSuffix + '></div>')
  }
  $(['hero_btn', 'hero_hr', 'hero_awards', 'hero_navbar']).each((i, el) => {
    animationWrapper(el)
  })

  const heroCopy = $('#heroCopy').wrap("<div class='hero_copyW'></div>")

  ScrollTrigger.defaults({ markers: true })
  const heroVideoAfter = CSSRulePlugin.getRule('.hero_video2:after')
  const tlLoad = gsap.timeline({ defaults: { ease: 'power4.out', duration: 2 } })
  const tlScrollHero = gsap.timeline({
    defaults: { ease: 'power1.in', duration: 3 },
    // paused: true,
  })
  // tlScrollHero.pause()
  // set(heroVideoAfter, { transformOrigin: 'bottom' })
  const tlWorkTitle = gsap.timeline({ defaults: { ease: 'none', duration: 3 } })

  tlLoad
    .from('.hero_video2', {
      ease: CustomEase.create('custom', 'M0,0 C0.29,0 0.219,0.018 0.29,0.103 0.359,0.186 0.413,0.798 0.476,0.892 0.551,1.003 0.704,1 1,1'),
      duration: 2.5,
      width: '100%',
      // transformOrigin: 'left top',
      // onComplete: heroVideoOrigin,
    })
    .to(heroVideoAfter, { cssRule: { height: '0%' } }, '>-=1.2')
    .from([heroTitle.lines, heroCopy], { yPercent: 120, stagger: 0.25 }, '<')
    .from(['.hero_logo', '.hero_btn'], { x: 50, opacity: 0, duration: 3 }, '>-=1.8')
    .from(['.hero_menu', '.hero_awards'], { x: -50, opacity: 0, duration: 3 }, '<')
    .from('.hero_hr', { scaleX: 0.8, opacity: 0, duration: 3 }, '<')
    .addLabel('tlLoadEnd')
  // .add(tlScrollHero.tweenFromTo(0, tlScrollHero.duration()))

  if (!elementInViewport('hero')) {
    console.log(tlLoad.progress())
    tlLoad.pause
    // tlLoad.seek('tlLoadEnd')
    tlLoad.progress(1, false)
    console.log(tlLoad.progress())
  }

  ScrollTrigger.create({
    markers: false,
    animation: heroScrollAni(),
    trigger: '.hero',
    start: 'top top',
    end: 'bottom 30%',
    toggleActions: 'play reverse restart reverse',
    scrub: 1,
  })

  function heroScrollAni() {
    const heroSquish = 100 + '%'
    tlScrollHero
      .to('.hero_video2', { ease: 'none', opacity: 0.1, clipPath: 'polygon(' + heroSquish + ' 0%, 100% 0%, 100% 100%, ' + heroSquish + ' 100%' })
      .to(['.hero_navbar-animationWrapper', '#heroTitle>.lineParent', '.hero_copyW', '.hero_cta'], { y: -500, stagger: { amount: 1 }, duration: 2 }, '<')
      .to('.hero_hr-animationWrapper', { scaleX: 0, duration: 2.35 }, '<')
      .to(['.hero_btn-animationWrapper', '.hero_awards-animationWrapper'], { opacity: 0, ease: 'power2.in', duration: 2.4 }, '<')

    return tlScrollHero
  }
  ScrollTrigger.config({
    limitCallbacks: true,
  })
  ScrollTrigger.create({
    markers: false,
    trigger: '.hero',
    start: 'bottom bottom',
    onUpdate: (self) => {
      if (self.direction === -1) {
        scrollUp()
      }
    },
  })

  ScrollTrigger.create({
    markers: false,
    trigger: '.contact_fg',
    start: 'top center',
    animation: gsap.timeline().to('.contact_bg', { '-webkit-mask-size': '200%' }),
    toggleActions: 'play reverse restart reverse',
    scrub: 1,
    onUpdate: (self) => {
      if (self.direction === 1) {
        scrollDown()
      }
    },
  })

  tlWorkTitle
    // .set('.work_title>.section_title-leaf', { backgroundAattachment: 'fixed', paddingTop: '5px' })
    // .to('.work_title', { yPercent: -30, ease: 'linear' })
    .from('.work_title>.work_title_leaf', { yPercent: 30 }, '<')
    .from('.work_title>.work_title_leaf-outline', { yPercent: 50 }, '<')
    .fromTo('.work_title>.section_title-green', { yPercent: 90 }, { yPercent: -30 }, '<')

  ScrollTrigger.create({
    markers: false,
    trigger: '.work_title',
    start: 'top center+=20%',
    end: 'bottom top',
    animation: tlWorkTitle,
    toggleActions: 'play reverse restart reverse',
    scrub: 1,
  })

  function scrollUp() {
    lenis.scrollTo('.hero', {
      duration: (2 * lenisScroll) / 300,
      esing: (x) => {
        x === 0 ? 0 : Math.pow(2, 10 * x - 10) // https://easings.net/en#easeInOutQuart
        // inout exp: x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2
        // out exp: x === 1 ? 1 : 1 - Math.pow(2, -10 * x)
        // in exp: x === 0 ? 0 : Math.pow(2, 10 * x - 10)
      },
    })
  }
  function scrollDown() {
    lenis.scrollTo('.footer', {
      duration: 4,
    })
  }
}

function elementInViewport(myElement) {
  const element = document.getElementById(myElement)
  const bounding = element.getBoundingClientRect()
  const myElementHeight = element.offsetHeight
  const myElementWidth = element.offsetWidth

  if (
    bounding.top >= -myElementHeight &&
    bounding.left >= -myElementWidth &&
    bounding.right <= (window.innerWidth || document.documentElement.clientWidth) + myElementWidth &&
    bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) + myElementHeight
  ) {
    return true
  } else {
    return false
  }
}

if (document.readyState !== 'loading') {
  onReady()
} else {
  document.addEventListener('DOMContentLoaded', function () {
    onReady()
  })
}
