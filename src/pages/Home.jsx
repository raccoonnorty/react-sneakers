import React from 'react';
import Card from "../components/Card";


function Home({
  items,
  searchValue, 
  setSearchValue, 
  onChangeSearchInput, 
  onAddToFavorite, 
  onAddToCart,
  isLoading
}) {
  
  const renderItems = () => {
    const filteredItems = items.filter((item) => 
      item.name.toLowerCase().includes(searchValue.toLowerCase()))
    return (
      isLoading
        ? [...Array(8)]
        : filteredItems
      )
    .map((item, index) => (
      <Card 
        key={index}
        onFavorite={(obj) => onAddToFavorite(obj)}
        onPlus={(obj) => onAddToCart(obj)}
        loading={isLoading}
        {...item}
      />
    ))
  }
  return (
    <div className="content p-40">
        <div className="d-flex align-center mb-40 justify-between">
          <h1>{searchValue ? `Поиск по запросу: "${searchValue}"` : 'Все кроссовки'}</h1>
          <div className="serach-block d-flex">
            <img src="/img/search.svg" alt="Search" />
            {searchValue && <img onClick={() => setSearchValue('')} className="remove-btn clear" src="/img/btn-remove.svg" alt="Close" />}
            <input onChange={onChangeSearchInput} value={searchValue} placeholder="Поиск..." />
          </div>
        </div>
        <div className="d-flex flex-wrap">
          {
            renderItems()
          }
        </div>
        
      </div>
  )
}

export default Home;