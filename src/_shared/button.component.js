import * as React from 'react'

export const Button = ({ text, btnStyle, handleClick }) => {
  return (
    <button className={btnStyle} onClick={() => handleClick()}>
      {text}
    </button>
  )
}
