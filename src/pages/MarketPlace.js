import { Input, Select } from 'antd';
import MarketPlaceCard from 'components/MarketplaceCard'
import React from 'react'
import {SearchOutlined} from '@ant-design/icons'
const { Option } = Select;
const products = [
    {
      id: 1,
      price: '$240.00',
      title: 'Leather Small Handb...',
      jobs: '3/3',
      value: '$1.00',
      imageUrl: 'https://images.unsplash.com/photo-1512201078372-9c6b2a0d528a?q=80&w=2946&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' // Replace with actual image path
    }
    ,
    {
      id: 2,
      price: '$240.00',
      title: 'Leather Small Handb...',
      jobs: '3/3',
      value: '$1.00',
      imageUrl: 'https://images.unsplash.com/photo-1512201078372-9c6b2a0d528a?q=80&w=2946&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    }
    ,
    {
      id: 3,
      price: '$240.00',
      title: 'Leather Small Handb...',
      jobs: '3/3',
      value: '$1.00',
      imageUrl: 'https://images.unsplash.com/photo-1512201078372-9c6b2a0d528a?q=80&w=2946&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    }
    ,
    {
      id: 4,
      price: '$240.00',
      title: 'Leather Small Handb...',
      jobs: '3/3',
      value: '$1.00',
      imageUrl: 'https://images.unsplash.com/photo-1512201078372-9c6b2a0d528a?q=80&w=2946&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    }
    ,
    {
      id: 5,
      price: '$240.00',
      title: 'Leather Small Handb...',
      jobs: '3/3',
      value: '$1.00',
      imageUrl: 'https://images.unsplash.com/photo-1512201078372-9c6b2a0d528a?q=80&w=2946&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    }
  ];
const MarketPlace = () => {
  return (
    <>
    <div className="allCamp-filters">
        <Input
          placeholder="Search..."
          prefix={<SearchOutlined />}
          className="allCamp-search-input"
        />
        <Select defaultValue="Featured" className="allCamp-sort-select">
          <Option value="Featured">Sort By: Featured</Option>
          <Option value="date">Date</Option>
          <Option value="name">Name</Option>
        </Select>
      </div>
    <div className='d-flex' style={{gap:'10px',flexWrap:'wrap'}}>
        {
            products.map((elm,i)=>{
                return(
                    <>
                <MarketPlaceCard product={elm} key={i}/>
                    </>
                )
            })
        }
    </div>
    </>
  )
}

export default MarketPlace
