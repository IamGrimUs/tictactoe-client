import * as React from 'react'

import './loader.styles.css'

export const Loader = ({ display }) => {
  return (
    <section className={display}>
      <div class="loader loader-3">
        <div class="dot dot1"></div>
        <div class="dot dot2"></div>
        <div class="dot dot3"></div>
      </div>
    </section>
  )
}
