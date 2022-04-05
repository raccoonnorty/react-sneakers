import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Drawer from "./components/Drawer/";
import Header from "./components/Header";

import axios from 'axios';

import Home from './pages/Home';
import Favorites from './pages/Favorites';
import Orders from './pages/Orders';

import AppContex from "./context";

function App() {
  const [items, setItems] = React.useState([])
  const [cartItems, setCartItems] = React.useState([]);
  const [favorites, setFavorites] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState('');
  const [cartOpened, setCartOpened] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        const [cartResponse, favoritesResponse, itemsResponse] = await Promise.all([
        axios.get('https://622e56678d943bae34938260.mockapi.io/cart'),
        axios.get('https://622e56678d943bae34938260.mockapi.io/favorites'),
        axios.get('https://622e56678d943bae34938260.mockapi.io/items')
      ])
      
        setIsLoading(false)
  
        setCartItems(cartResponse.data)
        setFavorites(favoritesResponse.data)
        setItems(itemsResponse.data)
      } catch (error) {
        alert('Ошибка при запросе данных')
        console.error(error);
      }
    }
  
    fetchData()
  }, [])

  const onAddToCart = async (obj) => {
    try {
      const findItem = cartItems.find(item => Number(item.parentId) === Number(obj.id))
      if (findItem) {
        setCartItems(prev => prev.filter(item => Number(item.parentId) !== Number(obj.id)))
        await axios.delete(`https://622e56678d943bae34938260.mockapi.io/cart/${findItem.id}`)
      } else {
        const { data } = await axios.post('https://622e56678d943bae34938260.mockapi.io/cart', obj)
        setCartItems(prev => prev.map(item => {
          if (item.parentId === data.parentId) {
            return {
              ...item,
              id: data.id
            }
          } else {
            return item
          }
        }))
      }
    } catch (error) {
      alert('Не удалось добавить в Корзину')
      console.error(error);
    }
  }

  const onRemoveItem = (id) => {
    try {
      axios.delete(`https://622e56678d943bae34938260.mockapi.io/cart/${id}`)
      setCartItems((prev) => prev.filter(item => item.id !== id))
    } catch (error) {
      alert('Не удалось удалить из Корзины')
      console.error(error);
    }
  }

  const onAddToFavorite = async (obj) => {
    try {
      if (favorites.find((favObj) => favObj.id === obj.id)) {
        axios.delete(`https://622e56678d943bae34938260.mockapi.io/favorites/${obj.id}`)
        setFavorites((prev) => prev.filter((item) => Number(item.id) !== Number(obj.id)));
      } else {
        const { data } = await axios.post('https://622e56678d943bae34938260.mockapi.io/favorites', obj)
        setFavorites((prev) => [...prev, data])
      }
    } catch (error) {
      alert('Не удалось добавить в Избранное')
      console.error(error);
    }
  }

  const onChangeSearchInput = (event) => {
    setSearchValue(event.target.value)
  }

  const isItemAdded = (id) => {
    return cartItems.some(obj => Number(obj.parentId) === Number(id))
  }

  return (
    <AppContex.Provider value={{ 
      items,
      cartItems,
      favorites,
      isItemAdded,
      onAddToFavorite,
      onAddToCart,
      setCartOpened,
      setCartItems
    }}>
      <div className="wrapper clear">
      <Drawer 
        items={cartItems} 
        onClose={() => setCartOpened(false)} 
        onRemove={onRemoveItem}
        opened={cartOpened}
        />
        <Header onClickCart={() => setCartOpened(true)} />
        <Routes>
          <Route path={process.env.PUBLIC_URL + '/orders'} element={
            <Orders />
            } exact />
          <Route path={process.env.PUBLIC_URL + '/favorites'} element={
            <Favorites />
            } exact />
          <Route path={process.env.PUBLIC_URL + '/'} element={
            <Home 
            items={items}
            cartItems={cartItems}
            searchValue={searchValue} 
            setSearchValue={setSearchValue} 
            onChangeSearchInput={onChangeSearchInput}
            onAddToFavorite={onAddToFavorite}
            onAddToCart={onAddToCart}
            isLoading={isLoading} />
            } exact />
        </Routes>
      </div>
    </AppContex.Provider>
  );
}

export default App;