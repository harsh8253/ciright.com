import { useEffect, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.clearScrollMemory('manual')

// elements whose scroll destination isn't their layout position (posters inside the pinned reel)
const scrollDestinations = new Map()

const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const finePointer = () => window.matchMedia('(pointer: fine)').matches

function revealFamily(room) {
  const media = room.querySelector('.family-media')
  const t = gsap
    .timeline({ paused: true })
    .fromTo(
      room.querySelectorAll('.lead-word > span'),
      { yPercent: 110 },
      { yPercent: 0, duration: 1, ease: 'expo.out', stagger: 0.04 },
    )
    .fromTo(
      room.querySelectorAll('.suite-lead, .suite-body, .suite-aside .pill'),
      { autoAlpha: 0, y: 18 },
      { autoAlpha: 1, y: 0, duration: 0.8, ease: 'expo.out', stagger: 0.08 },
      0.3,
    )
  ScrollTrigger.create({ trigger: room, start: 'top 72%', once: true, onEnter: () => t.play() })

  const list = room.querySelector('.product-list')
  const rows = gsap
    .timeline({ paused: true })
    .fromTo(
      list.querySelectorAll('.product-rule'),
      { scaleX: 0 },
      { scaleX: 1, duration: 0.9, ease: 'expo.inOut', stagger: 0.05 },
    )
    .fromTo(
      list.querySelectorAll('.product-name-inner'),
      { yPercent: 110 },
      { yPercent: 0, duration: 0.8, ease: 'expo.out', stagger: 0.05 },
      0.2,
    )
    .fromTo(
      list.querySelectorAll('.product-text'),
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.6, ease: 'power2.out', stagger: 0.05 },
      0.3,
    )
  ScrollTrigger.create({ trigger: list, start: 'top 85%', once: true, onEnter: () => rows.play() })

  if (media) {
    const r = getComputedStyle(media).borderTopLeftRadius
    gsap
      .timeline({ scrollTrigger: { trigger: media, start: 'top bottom', end: 'top 30%', scrub: 0.6 } })
      .fromTo(
        media,
        { clipPath: 'inset(0% 30% 0% 30% round 999px)' },
        { clipPath: `inset(0% 0% 0% 0% round ${r})`, ease: 'power2.out' },
        0,
      )
      .fromTo(media.querySelector('img'), { scale: 1.25 }, { scale: 1, ease: 'none' }, 0)
  }
}

function stageReel(reel, scrollTo) {
  const track = reel.querySelector('.reel-track')
  const pin = reel.querySelector('.reel-pin')
  const strip = reel.querySelector('.reel-strip')
  const posters = gsap.utils.toArray('.poster', strip)
  const brandCount = posters.filter((p) => !p.matches('.is-next')).length
  const count = reel.querySelector('.count-reel')
  const fill = reel.querySelector('.reel-progress-fill')
  const figure = reel.querySelector('[data-count]')
  let focusX = 0
  let distance = 0
  let active = 0
  let counted = false
  let countUp

  reel.classList.add('is-staged')

  const measure = () => {
    const first = posters[0]
    const last = posters[posters.length - 1]
    focusX = first.offsetLeft + first.offsetWidth / 2
    distance = last.offsetLeft + last.offsetWidth / 2 - focusX
    track.style.height = `${pin.offsetHeight + distance}px`
  }
  measure()
  ScrollTrigger.addEventListener('refreshInit', measure)

  const light = (x) => {
    const step = posters[1].offsetLeft - posters[0].offsetLeft
    let best = 0
    let bestD = Infinity
    posters.forEach((p, i) => {
      const d = Math.abs(p.offsetLeft + p.offsetWidth / 2 + x - focusX) / step
      const t = Math.min(1, Math.max(0, (d - 0.2) / 0.45))
      p.style.setProperty('--lit', (1 - t * t * (3 - 2 * t)).toFixed(3))
      if (d < bestD) {
        bestD = d
        best = i
      }
    })
    const idx = Math.min(best, brandCount - 1)
    if (idx !== active) {
      active = idx
      gsap.to(count, { yPercent: (-100 * idx) / brandCount, duration: 0.7, ease: 'expo.out', overwrite: true })
    }
    if (figure && !counted && posters[best].contains(figure)) {
      counted = true
      const target = Number(figure.dataset.count)
      const n = { v: 0 }
      countUp = gsap.to(n, {
        v: target,
        duration: 1.8,
        ease: 'expo.out',
        onUpdate: () => (figure.textContent = n.v.toFixed(2)),
      })
    }
  }

  const st = ScrollTrigger.create({
    trigger: track,
    start: () => `top ${parseFloat(getComputedStyle(pin).top) || 0}px`,
    end: () => `+=${distance}`,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      const x = -distance * self.progress
      gsap.set(strip, { x })
      fill.style.transform = `scaleX(${self.progress})`
      light(x)
    },
  })
  light(0)
  posters.forEach((p) =>
    scrollDestinations.set(p, () => st.start + Math.max(0, p.offsetLeft + p.offsetWidth / 2 - focusX)),
  )
  const onFocus = (e) => {
    const dest = scrollDestinations.get(e.target.closest('.poster'))
    if (dest) scrollTo(dest())
  }
  strip.addEventListener('focusin', onFocus)

  return () => {
    strip.removeEventListener('focusin', onFocus)
    ScrollTrigger.removeEventListener('refreshInit', measure)
    countUp?.kill()
    gsap.killTweensOf(count)
    posters.forEach((p) => {
      scrollDestinations.delete(p)
      p.style.removeProperty('--lit')
    })
    reel.classList.remove('is-staged')
    track.style.height = ''
    fill.style.transform = ''
    gsap.set([strip, count], { clearProps: 'all' })
    if (figure) figure.textContent = Number(figure.dataset.count).toFixed(2)
  }
}

export function useSiteMotion() {
  useLayoutEffect(() => {
    const reduced = prefersReduced() || new URLSearchParams(location.search).has('still')
    const cleanups = []
    let lenis

    if (!reduced) {
      lenis = new Lenis({ lerp: 0.1 })
      lenis.on('scroll', ScrollTrigger.update)
      const tick = (t) => lenis.raf(t * 1000)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)
      document.querySelectorAll('a[href*="#"]').forEach((a) => {
        const url = new URL(a.href)
        if (url.origin !== location.origin || url.pathname !== location.pathname) return
        const go = (e) => {
          const id = url.hash
          const target = id.length > 1 && document.getElementById(decodeURIComponent(id.slice(1)))
          if (target) {
            e.preventDefault()
            const dest = scrollDestinations.get(target)
            if (dest) lenis.scrollTo(dest())
            else lenis.scrollTo(target, { offset: parseFloat(getComputedStyle(target).scrollMarginTop) ? 0 : -24 })
          }
        }
        a.addEventListener('click', go)
        cleanups.push(() => a.removeEventListener('click', go))
      })
      cleanups.push(() => {
        gsap.ticker.remove(tick)
        lenis.destroy()
      })
    }

    const ctx = gsap.context(() => {
      if (reduced) return

      const hero = document.querySelector('.hero')
      const title = hero.querySelector('.hero-title')
      const pill = hero.querySelector('.twin-pill')
      const reel = hero.querySelector('.hero-reel')
      const frame = reel?.querySelector('.hero-reel-frame')
      const label = hero.querySelector('.hero-label')
      const intro = !!pill && !!frame && window.scrollY < 40
      if (intro) {
        hero.classList.add('is-intro')
        const gap = getComputedStyle(reel).marginTop
        gsap.set(reel, { height: 0, marginTop: 0 })
        gsap.set(frame, { autoAlpha: 0 })
        gsap.set(label, { autoAlpha: 0, y: 14 })

        const open = () => {
          const p = pill.getBoundingClientRect()
          const f = frame.getBoundingClientRect()
          const radius = parseFloat(getComputedStyle(frame).borderTopLeftRadius)
          hero.classList.remove('is-intro')
          gsap.set(frame, { autoAlpha: 1 })
          gsap
            .timeline({
              defaults: { duration: 1.35, ease: 'expo.inOut' },
              onComplete: () => {
                gsap.set([reel, frame], { clearProps: 'all' })
                ScrollTrigger.refresh()
              },
            })
            .fromTo(
              frame,
              {
                x: p.left - f.left,
                y: p.top - f.top,
                scaleX: p.width / f.width,
                scaleY: p.height / f.height,
                borderRadius: f.height / 2,
              },
              { x: 0, y: 0, scaleX: 1, scaleY: 1, borderRadius: radius },
              0,
            )
            .to(reel, { height: f.height, marginTop: gap }, 0)
            .to(label, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'expo.out' }, 0.55)
        }

        gsap
          .timeline({ delay: 1 })
          .to(pill, {
            x: () => title.getBoundingClientRect().right - pill.getBoundingClientRect().right,
            duration: 0.85,
            ease: 'power3.inOut',
          })
          .call(open)
        cleanups.push(() => {
          hero.classList.remove('is-intro')
          gsap.killTweensOf([reel, frame, label])
          gsap.set([reel, frame, label], { clearProps: 'all' })
        })
      }

      gsap.from('.hero-title .line-inner', {
        yPercent: 105,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.09,
        delay: 0.1,
      })
      if (pill) {
        gsap.from(pill, {
          clipPath: 'inset(0 50% 0 50% round 999px)',
          duration: 1.3,
          ease: 'expo.out',
          delay: 0.35,
        })
      }
      gsap.from(gsap.utils.toArray(intro ? '.hero-lede, .hero-cta, .stat' : '.hero-row > *, .stat, .family-index li'), {
        y: 18,
        opacity: 0,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.05,
        delay: 0.55,
      })

      if (frame) {
        gsap.to(frame.querySelector('img'), {
          scale: 1.06,
          ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
        })
      }

      const cards = gsap.utils.toArray('.stack-card')
      cards.forEach((card, i) => {
        const next = cards[i + 1]
        if (!next || getComputedStyle(card).position !== 'sticky') return
        gsap.fromTo(
          card.querySelector('.stack-card-inner'),
          { scale: 1, filter: 'brightness(1)' },
          {
            scale: 0.94,
            filter: 'brightness(0.6)',
            ease: 'none',
            scrollTrigger: { trigger: next, start: 'top 85%', end: 'top 15%', scrub: true },
          },
        )
      })

      gsap.utils.toArray('.suite').forEach(revealFamily)

      const brandReel = document.querySelector('.reel')
      if (brandReel) {
        const walk = gsap.matchMedia()
        walk.add('(min-width: 901px) and (min-height: 640px)', () => stageReel(brandReel, (y) => lenis.scrollTo(y)))
        cleanups.push(() => walk.revert())
      }

      const verbs = gsap.utils.toArray('.engine-verb')
      if (verbs.length) {
        gsap.fromTo(
          verbs,
          { opacity: 0.14 },
          {
            opacity: 1,
            ease: 'none',
            stagger: 0.5,
            scrollTrigger: { trigger: '.engine-title', start: 'top 82%', end: 'bottom 45%', scrub: 0.4 },
          },
        )
      }

      gsap.utils.toArray('.territory-media').forEach((fig) => {
        gsap.fromTo(
          fig,
          { '--lit': 0 },
          {
            '--lit': 1,
            ease: 'none',
            scrollTrigger: { trigger: fig, start: 'top 85%', end: 'center 55%', scrub: 0.5 },
          },
        )
      })

      gsap.utils.toArray('.portal-step').forEach((fig) => {
        gsap.fromTo(
          fig,
          { '--r': () => getComputedStyle(fig).getPropertyValue('--r-from').trim(), '--lit': 0.1 },
          {
            '--r': '88%',
            '--lit': 1,
            ease: 'none',
            scrollTrigger: { trigger: fig, start: 'top 80%', end: 'center 45%', scrub: 0.6, invalidateOnRefresh: true },
          },
        )
      })

      const ring = document.querySelector('.hq-pin-ring')
      if (ring) {
        gsap.from(ring, {
          scale: 0.2,
          opacity: 0,
          transformOrigin: '50% 50%',
          duration: 1.8,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.hq-map', start: 'top 72%', once: true },
        })
      }

      const podium = document.querySelector('.podium-frame img')
      if (podium) gsap.from(podium, { scale: 1.12, duration: 1.8, ease: 'expo.out', delay: 0.15 })

      gsap.utils.toArray('.stack-media img').forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: 'none',
            scrollTrigger: { trigger: img.closest('.stack-card'), start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      })

      const settle = gsap.matchMedia()
      settle.add({ wide: '(min-width: 901px)', narrow: '(max-width: 900px)' }, ({ conditions }) => {
        gsap.utils.toArray('.result-card').forEach((card, i) => {
          const tilt = [-9, 7, -6, 11][i % 4]
          gsap.fromTo(
            card,
            { rotate: tilt, y: 90 + i * 28, x: tilt * 3 },
            {
              rotate: 0,
              y: 0,
              x: 0,
              ease: 'none',
              scrollTrigger: conditions.wide
                ? { trigger: '.results-deck', start: 'top bottom', end: `center ${62 - i * 3}%`, scrub: 0.6 }
                : { trigger: card, start: 'top bottom', end: 'center 70%', scrub: 0.6 },
            },
          )
        })
      })
      cleanups.push(() => settle.revert())

      gsap.utils.toArray('.work-card, .trust-card').forEach((card) => {
        gsap.fromTo(
          card.querySelector('img'),
          { scale: 1.15 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom center', scrub: true },
          },
        )
        if (card.matches('.trust-card:nth-child(2)') && window.innerWidth > 900) {
          gsap.fromTo(
            card,
            { y: 80 },
            { y: -40, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true } },
          )
        }
      })

      gsap.fromTo(
        '.why-rule',
        { scaleX: 0 },
        { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.why', start: 'top 90%', end: 'top 45%', scrub: 0.6 } },
      )
      gsap.utils.toArray('[data-ink]').forEach((el) => {
        gsap.fromTo(
          el.querySelectorAll('.ink-word'),
          { opacity: 0.16 },
          {
            opacity: 1,
            ease: 'none',
            stagger: 0.1,
            scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 52%', scrub: 0.6 },
          },
        )
      })
      gsap.fromTo(
        '.quote-mark',
        { scale: 0.4, rotate: -18, opacity: 0 },
        {
          scale: 1,
          rotate: 0,
          opacity: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.quote', start: 'top 88%', end: 'top 60%', scrub: 0.6 },
        },
      )
      gsap.fromTo(
        '.quote-portrait img',
        { scale: 1.15 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.quote', start: 'top bottom', end: 'top 40%', scrub: true },
        },
      )
      gsap.fromTo(
        '.quote figcaption',
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          ease: 'none',
          scrollTrigger: { trigger: '.quote figcaption', start: 'top 80%', end: 'top 62%', scrub: 0.6 },
        },
      )

      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          y: 28,
          opacity: 0.6,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        })
      })
    })

    const landing = location.hash.length > 1 && document.getElementById(decodeURIComponent(location.hash.slice(1)))
    let landFrame
    if (landing) {
      landFrame = requestAnimationFrame(() => {
        ScrollTrigger.refresh()
        const dest = scrollDestinations.get(landing)
        const y = dest
          ? dest()
          : landing.getBoundingClientRect().top + scrollY - (parseFloat(getComputedStyle(landing).scrollMarginTop) || 24)
        if (lenis) lenis.scrollTo(y, { immediate: true })
        else window.scrollTo(0, y)
      })
    }

    return () => {
      cancelAnimationFrame(landFrame)
      ctx.revert()
      cleanups.forEach((fn) => fn())
    }
  }, [])
}

export function useCursor() {
  useEffect(() => {
    if (!finePointer() || prefersReduced() || new URLSearchParams(location.search).has('still')) return
    const dot = document.querySelector('.cursor')
    const label = dot?.querySelector('.cursor-label')
    const tag = dot?.querySelector('.cursor-tag')
    if (!dot) return
    dot.classList.add('is-hidden')
    document.documentElement.classList.add('has-cursor')

    const pos = { x: innerWidth / 2, y: innerHeight / 2 }
    const xTo = gsap.quickTo(dot, 'x', { duration: 0.45, ease: 'power3.out' })
    const yTo = gsap.quickTo(dot, 'y', { duration: 0.45, ease: 'power3.out' })
    const swing = gsap.quickTo(dot, 'rotation', { duration: 0.7, ease: 'power3.out' })
    const clampSwing = gsap.utils.clamp(-14, 14)
    let stuck = null
    let labelText = ''
    let settle = 0

    const showLabel = (text) => {
      if (text !== labelText) {
        labelText = text
        label.replaceChildren(
          ...[...text].map((ch, i) => {
            const s = document.createElement('span')
            s.className = 'cursor-char'
            s.style.setProperty('--i', i)
            s.textContent = ch === ' ' ? '\u00a0' : ch
            return s
          }),
        )
      }
      const w = tag.offsetWidth
      const h = 56
      Object.assign(dot.style, { width: `${w}px`, height: `${h}px`, margin: `${-h / 2}px 0 0 ${-w / 2}px` })
    }
    const hideLabel = () => {
      if (!labelText) return
      labelText = ''
      swing(0)
      dot.style.width = dot.style.height = dot.style.margin = ''
    }

    const place = () => {
      if (!stuck) {
        xTo(pos.x)
        yTo(pos.y)
        return
      }
      const r = stuck.getBoundingClientRect()
      const w = r.width + 32
      const h = r.height + 16
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      Object.assign(dot.style, { width: `${w}px`, height: `${h}px`, margin: `${-h / 2}px 0 0 ${-w / 2}px` })
      xTo(cx + (pos.x - cx) * 0.12)
      yTo(cy + (pos.y - cy) * 0.2)
    }
    const unstick = () => {
      if (!stuck) return
      stuck = null
      dot.classList.remove('is-stuck')
      dot.style.width = dot.style.height = dot.style.margin = ''
    }

    const move = (e) => {
      dot.classList.remove('is-hidden')
      if (labelText) {
        swing(clampSwing((e.clientX - pos.x) * 0.9))
        clearTimeout(settle)
        settle = setTimeout(() => swing(0), 90)
      }
      pos.x = e.clientX
      pos.y = e.clientY
      place()
    }
    const over = (e) => {
      const target = e.target.closest('[data-cursor], a, button')
      const text = target?.getAttribute('data-cursor') || ''
      const own = !!target && !text && target.matches('.pill, .menu-toggle, [data-own-hover]')
      const r = target?.getBoundingClientRect()
      const small = !!target && !text && !own && r.width <= 320 && r.height <= 60

      if (small) {
        stuck = target
        dot.classList.add('is-stuck')
      } else unstick()
      dot.classList.toggle('is-tucked', own)
      dot.classList.toggle('is-link', !!target && !text && !own && !small)
      dot.classList.toggle('is-label', !!text)
      if (text) showLabel(text)
      else hideLabel()
      place()
    }
    const scroll = () => stuck && place()
    const leave = () => dot.classList.add('is-hidden')
    const enter = () => dot.classList.remove('is-hidden')

    window.addEventListener('pointermove', move)
    window.addEventListener('scroll', scroll, { passive: true })
    document.addEventListener('pointerover', over)
    document.documentElement.addEventListener('pointerleave', leave)
    document.documentElement.addEventListener('pointerenter', enter)

    const magnets = [...document.querySelectorAll('[data-magnetic]')]
    const handlers = magnets.map((el) => {
      const mx = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'elastic.out(1, 0.4)' })
      const my = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'elastic.out(1, 0.4)' })
      const onMove = (e) => {
        const r = el.getBoundingClientRect()
        mx((e.clientX - (r.left + r.width / 2)) * 0.28)
        my((e.clientY - (r.top + r.height / 2)) * 0.36)
      }
      const onLeave = () => {
        mx(0)
        my(0)
      }
      el.addEventListener('pointermove', onMove)
      el.addEventListener('pointerleave', onLeave)
      return () => {
        el.removeEventListener('pointermove', onMove)
        el.removeEventListener('pointerleave', onLeave)
      }
    })

    return () => {
      clearTimeout(settle)
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('scroll', scroll)
      document.removeEventListener('pointerover', over)
      document.documentElement.removeEventListener('pointerleave', leave)
      document.documentElement.removeEventListener('pointerenter', enter)
      handlers.forEach((fn) => fn())
    }
  }, [])
}
