import React from "react"
import * as styles from "./dataViewPage.less"
import {Button,Icon } from "antd"
import TableSelect from "../../common/table-select/tables"

export default class DataViewPage extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            visible:false,
            dataDetailUrl:"",
        }
        this.renderChildren = this.renderChildren.bind(this)
    }
    
    componentWillReceiveProps(nextProps){
        if(nextProps.visible !== this.state.visible){
            this.setState({
                visible:nextProps.visible,  //是否展示当前页面
                dataDetailUrl:nextProps.dataDetailUrl, //iframe链接
            })
        }
    }
    
    renderChildren(){
        let renderChildren =null;
        let {tableType} = this.props
        if(tableType == "game"){ //直接引入iframe
              renderChildren = 
                <iframe src={this.state.dataDetailUrl}
                        style={{width:"100%",height:"calc(100vh - 150px)",border:"0"}}
                    >
                </iframe>
        }else if(tableType == "acti"){ //微活动表格
            renderChildren = <TableSelect {...this.props.tableProps} />
        }
        
        return renderChildren;
    }
   
    render(){
        return(
          <div className={this.state.visible? styles.open_page:styles.close_page}>
                <div className={styles.topic_main}>
                    <img className={styles.topic_icon} src="https://img.ishanshan.com/gimg/img/17f0dfd2429ae6f65391477aee5b7a25"/>数据详情
                </div> 
                <Button type="ghost" onClick={this.props.onClose} className={styles.closeBtn}>
                   关闭
                </Button>
                {this.renderChildren()}
          </div>
        )
    }
}