import axios from 'axios';
import React from 'react'
import AppContex from '../context';
import Info from './Info';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function Drawer({ onClose, onRemove, items = [] }) {
  const { cartItems, setCartItems } = React.useContext(AppContex)
  const [orderId, setOrderId] = React.useState(null)
  const [isOrderComplete, setIsOrderComplete] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false);

  const onClickOrder = async () => {
    try {
      setIsLoading(true)
      const { data } = await axios.post('https://622e56678d943bae34938260.mockapi.io/orders', {
        items: cartItems
      })
      setOrderId(data.id)
      setIsOrderComplete(true)
      setCartItems([])

      for (let i = 0; i < cartItems.length; i++) {
        const item = cartItems[i];
        await axios.delete('https://622e56678d943bae34938260.mockapi.io/cart/' + item.id)
        await delay(1000)
      }

    } catch (error) {
      alert('Ошибка при создании заказа :(')
      console.error(error);
    }
    setIsLoading(false)
  }
  return (
    <div className="overlay">
        <div className="drawer">
            <h2 className="d-flex justify-between mb-30">
            Корзина
            <img onClick={onClose} className="remove-btn" src="/img/btn-remove.svg" alt="Close" />
            </h2>
            
            {
              items.length > 0 ? (
                
                <div className='d-flex flex-column flex'>
                  <div className="items">
                    {items.map((obj) => (
                    <div key={obj.id} className="cart-item d-flex align-center mb-20">
                      <img className="mr-20" width={70} height={70} src={obj.imageUrl} alt="Sneakers" />
                      <div className="mr-20">
                        <p className="mb-5">{obj.name}</p>
                        <b>{obj.price} руб.</b>
                      </div>
                      <img onClick={() => onRemove(obj.id)} className="remove-btn" src="/img/btn-remove.svg" alt="Remove" />
                    </div>
                    ))}
                  </div>
                  
                  <div className="cart-total-block">
                    <ul className="cart-total-block">
                      <li className="d-flex">
                        <span>Итого: </span>
                        <div></div>
                        <b>21 498 руб. </b>
                      </li>
                      <li className="d-flex">
                        <span>Налог 5%: </span>
                        <div></div>
                        <b>1074 руб. </b>
                      </li>
                    </ul>
                    <button disabled={isLoading} onClick={onClickOrder} className="green-btn">Оформить заказ<img src="/img/arrow.svg" alt="Arrow" /></button>
                  </div>
                </div>
              ) : (
                <Info
                  title={isOrderComplete ? "Заказ оформлен" : "Корзина пустая"}
                  description={isOrderComplete ? `Ваш заказ #${orderId} скоро будет передан курьерской доставке` : "Добавте хотя бы одну пару кросовок, чтобы сделать заказ."}
                  image={isOrderComplete ? "/img/complete-order.jpg" : "/img/empty-cart.jpg"}
                />
              )
              
              }
            

            

            

        </div>
    </div>
  )
}

export default Drawer;