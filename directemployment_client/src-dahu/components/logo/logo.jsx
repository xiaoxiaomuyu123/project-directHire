/**
 * 这个组件的作用是引入一张图片，没有任何状态，因此可以使用函数组件
 * */

import React from 'react'

import './logo.css'

import logo from './logo.png'


export default function logoImage() {
    return (
        <div className="logo-container">
            <img src={logo} alt="logo" className="logo-img"/>
        </div>
    )
}
