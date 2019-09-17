/*
Logo 组件只显示一张图片，不和 redux 做交互，没有任何事件操作
 */
import React from 'react'

import './logo.css'
import logo from './logo.png'

export default function Logo() {
    return (
        <div className='logo-container'>
            <img src={logo} alt="logo" className='logo-img'/>
        </div>
    )
}

