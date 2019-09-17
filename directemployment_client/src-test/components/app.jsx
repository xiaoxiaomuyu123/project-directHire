import React, {Component} from "react"
import {Button, Toast} from "antd-mobile"

// import 'antd-mobile/dist/antd-mobile.css'

class App extends Component {

    handleClick = () => {
        Toast.info("successful")
    }
    render() {
        return (
            <div>
                <Button type="primary" onClick={this.handleClick}>start</Button>
            </div>
        )
    }
}

export default App