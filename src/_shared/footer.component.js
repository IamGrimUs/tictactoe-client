import * as React from 'react'
import './footer.styles.css'

export const Footer = ({ text }) => {
  return (
    <footer className="footer">
      <p>{text}</p>
    </footer>
  )
}
