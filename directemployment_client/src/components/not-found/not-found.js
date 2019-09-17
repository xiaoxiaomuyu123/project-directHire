import React, {Component} from "react"
import {Button} from "antd-mobile"
import {withRouter} from "react-router-dom"

class NotFound extends Component {

    handClick = () => {
        this.props.history.replace('/');
    }

    render() {
        return (
            <div>
                <h2>抱歉，找不到该页面！</h2>
                <Button type="primary"
                        onClick={this.handleClick}>回到首页</Button>
            </div>
        )
    }
}

export default withRouter(NotFound)