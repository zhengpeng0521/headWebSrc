import React, { PropTypes } from 'react';
import { Select, Button, Input } from 'antd';
import styles from './commonSelector.less';

const Option = Select.Option;


class OrgFilterSelect extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            currentSubComponents:[], //保存当前的筛选条件 用于判断是否要更新当前组建
            reRender:true, //是否需要渲染组建
        };

        this.onSearch = this.onSearch.bind(this);
        this.onReset = this.onReset.bind(this);
        this.handleSelectStateChange = this.handleSelectStateChange.bind(this);
        this.renderSelect = this.renderSelect.bind(this);
        this.renderInput = this.renderInput.bind(this);
        this.renderExport = this.renderExport.bind(this);
    }

    onSearch() {
        let props =  {...this.state}
        if(props.orgs && props.orgs.length>0){
            props.orgIds = props.orgs.join(",")
        }
        delete props.currentSubComponents
        delete props.reRender
        delete props.orgs
        this.props.onSearch && this.props.onSearch(props);
    }

    onReset() {
        let {subComponents} = this.props;
        subComponents && subComponents.length>0 && subComponents.map((item)=>{
            this.setState({
               [item.stateKey]:undefined,
            })
        })
        this.props.onSearch && this.props.onSearch();
    }

    componentDidMount() {
        
    }
    componentWillReceiveProps(nextProps){
        let {subComponents} = nextProps;
        if(subComponents && subComponents.length>0){
            !this.state.reRender && subComponents.map((item)=>{
                this.setState({
                   [item.stateKey]:"",
                })
            })
            this.setState({
                reRender:true,
                currentSubComponents:subComponents,
            })
        }
    }

    handleSelectStateChange(v,key) {
        this.setState({
            [key]:v,
        })
    }
    
    renderSelect(obj,index){ //渲染select组建
        let currentKey = obj.stateKey
        let renderOptions = [];
        let muti = false;
        if(currentKey == "orgs"){ //此处传入的 value 为对象数组
            muti = true;
            obj["value"].map((item)=>{
                renderOptions.push(<Option value={item.key} key={item.key}>{item.label}</Option>)
            })
        }else{//此处接受的为字符串数组
            obj["value"].map((ct, ci) => {
                renderOptions.push(<Option value={String(ci)} key={ci}>{ct}</Option>)
            })
        }
        return (
            <Select 
                mode={muti?"tags":""}
                key={index}
                value={this.state[obj.stateKey]}
                style={obj.style} 
                placeholder={obj.placeholder}
                onChange={(v)=>{
                    this.handleSelectStateChange(v,obj.stateKey)
                }
            }>
                {
                    renderOptions
                }
            </Select>
        )
    }
    
    renderInput(obj,index){
        return (
             <Input 
                    key = {index}
                    placeholder={obj.placeholder}
                    value={this.state[obj.stateKey]}
                    style={obj.style}
                    onChange={(e)=>{
                            this.handleSelectStateChange(e.target.value,obj.stateKey)
                        }
                    }
             />
        )
    }
    
    renderExport(obj,index){
        return (
            <Button style={obj.style} type="primary" onClick={obj.func}>{obj.value}</Button>
        )
    }

    render() {

        let { all_org_list, org_select, payStatus, babyName, currentSubComponents } = this.state;

        let { isDown,subComponents, isShowCampus } = this.props;

        return (
            <div className={styles.common_org_fileter_select_cont}>
                {
                    currentSubComponents && currentSubComponents.length>0 && currentSubComponents.map((item, index) => {
                          switch(item.type){
                             case 'select':
                                  return this.renderSelect(item,index);
                                  break;
                              case 'input':
                                  return this.renderInput(item,index);
                                  break; 
                          }
                    })  
                }
                <Button type="primary" style={{ marginRight: '10px' }} onClick={this.onSearch}>
                    <img src="//img.ishanshan.com/gimg/img/40850ec85b8698d4bf87ab918e636b5b"></img>
                </Button>
                <Button onClick={this.onReset}>
                    <img src="//img.ishanshan.com/gimg/img/6e7035a2df657c0350ffe4e86e9880f4"></img>
                </Button>
                <Button type="primary" onClick={this.props.export} style={{position:"absolute",right:"0",width:"60px"}}>导出</Button>
            </div>
        )
    }

}

export default OrgFilterSelect;
