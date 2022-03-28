import React from 'react'
import AppContex from '../context'

function Info({ title, image, description }) {
  const { setCartOpened } = React.useContext(AppContex)
  return (
    <div>
      <div className="cartEmpty d-flex align-center justify-center flex-column flex">
        <img className="mb-20" width={120} src={image} alt="Empty-Cart" />
        <h2>{title}</h2>
        <p className="opacity-6">{description}</p>
        <button onClick={() => setCartOpened(false)} className="green-btn">
          <img src="img/arrow.svg" alt="Arrow" />
          Вернуться назад
        </button>
      </div>
    </div>
  )
}

export default Info