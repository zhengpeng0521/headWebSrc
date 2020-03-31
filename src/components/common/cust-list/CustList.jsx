/**
 * 列表组件
 * 属性
 *   title  标题  {String}
 *   list  数据  {Array}  示例: [{id: '1', value: '小黄'}]
 *   placeholder  输入框提示  {String}
 *   itemKey  唯一标识，默认为id
 *   loading  加载状态  {Boolean}
 *   custClass  列表容器className
 *
 * 方法
 *   onSave  保存  参数: name(输入框值), callback(保存完的回调), id(当前行的id，新增时为undefind)
 *   onRemove  删除  参数: row(当前行数据), callback(保存完的回调)
 */

import React from 'react'
import { Input, Button, Popconfirm, Spin } from 'antd'
import { NullData } from '../new-component/NewComponent'
import styles from './CustList.less'

class CustList extends React.Component{

  constructor(props){
    super(props)
    let index = props.onChange ? 0 : undefined
    this.state = {
      newList: props.list || [],  //当前列表
      selectIndex: undefined,     //当前修改行
      itemName: undefined,        //当前名称
      type: 'add',                //修改类型  add新增，edit编辑

      rowIndex: index,            //选中行
      currentRow: {},             //当前行数据
    }
    this.itemNameChange = this.itemNameChange.bind(this)
    this.cancel = this.cancel.bind(this)
    this.openInput = this.openInput.bind(this)
    this.reset = this.reset.bind(this)
  }

  componentWillReceiveProps(newProps){
    this.setState({ newList: newProps.list })

    // 空数组新增
    if(newProps.list.length === 1 && this.props.list.length === 0){
      this.selectRow(0, newProps.list[0])
    }
  }

  /** 名称change */
  itemNameChange(e){
    this.setState({ itemName: e.target.value })
  }

  /** 新建或编辑 */
  openInput(type, index, row){
    const { ctrlList, addFunc } = this.props
    const { newList } = this.state

    // 没有父级时回调
    if(ctrlList && ctrlList.length < 1){
      addFunc && addFunc()
      return
    }

    if(row) {
      // 编辑
      this.setState({
        selectIndex: index,
        itemName: row.value,
        type
      })
    } else {
      // 新增
      let tempList = [...newList]
      tempList.push({})
      this.setState({
        selectIndex: tempList.length - 1,
        newList: tempList,
        type
      })
    }
  }

  /** 重置 */
  reset(index){
    const { rowIndex, currentRow, newList } = this.state

    if((index || index === 0) && rowIndex === index){
      // 如果删除当前行，那么重置到第一行
      this.setState({
        selectIndex: undefined,
        itemName: undefined,
        rowIndex: 0
      })
    } else {
      let newIndex = 0
      newList && newList.forEach((item, key) => {
        if(item.id == currentRow.id) {
          newIndex = key
        }
      })
      this.setState({
        selectIndex: undefined,
        itemName: undefined,
        rowIndex: newIndex
      })
    }
  }

  /** 取消 */
  cancel(){
    const { type } = this.state
    const { list } = this.props

    this.reset()
    if(type == 'add'){
      this.setState({
        newList: list
      })
    }
  }

  /** 保存修改 */
  saveItem(item){
    const { itemName } = this.state
    const { onSave } = this.props

    onSave(itemName, this.reset, item)
  }

  /** 删除 */
  remove(row, index){
    const { newList } = this.state
    const { onRemove } = this.props

    if(newList.length === 1){
      // 全部删除清空当前行数据
      this.selectRow(undefined, {})
    }
    onRemove && onRemove(row, () => this.reset(index))
  }

  /** 选中该行 */
  selectRow(index, row){
    const { onChange } = this.props

    this.setState({
      rowIndex: index,
      currentRow: row
    })
    onChange && onChange(row, index)
  }

  /** 列表子项渲染 */
  itemRender(){
    const { itemKey, placeholder, placement, hasAction, onChange } = this.props
    const { selectIndex, itemName, newList, rowIndex } = this.state

    let items = []

    newList && newList.map((item, index) => {
      if (index === selectIndex) {
        items.push(
          <li key={`item${itemKey || item.id}`} className={styles.cust_item}>
            <Input
              style={{ width: '78%' }}
              placeholder={placeholder}
              value={itemName}
              onChange={this.itemNameChange}
            />
            <div>
              <a
                disabled={!itemName || itemName == ""}
                className={styles.cust_item_btn}
                onClick={this.saveItem.bind(this, item)}
              >保存</a>
              <a onClick={this.cancel}>取消</a>
            </div>
          </li>
        )
      } else {
        let itemStyle = (rowIndex === index && onChange) ? styles.cust_item_selected : ''
        items.push(
          <li key={`item${itemKey || item.id}`} className={`${styles.cust_item} ${itemStyle}`}>
            <span
              style={onChange ? { cursor: 'pointer' } : {}}
              onClick={onChange && this.selectRow.bind(this, index, item)}
            >{item.value}</span>
            {hasAction && <div>
              <a
                disabled={selectIndex || selectIndex === 0}
                className={styles.cust_item_btn}
                onClick={this.openInput.bind(this, 'edit', index, item)}
              >编辑</a>
              <Popconfirm
              title="确定要删除吗?"
              placement={placement || 'top'}
              arrowPointAtCenter
              onConfirm={this.remove.bind(this, item, index)}>
                <a disabled={selectIndex || selectIndex === 0}>删除</a>
              </Popconfirm>
            </div>}
          </li>
        )
      }
    })

    return items
  }

  render(){
    const { title, custClass, loading, hasAction } = this.props
    const { selectIndex, newList } = this.state

    return (
      <div className={`${styles.cust_container} ${custClass || ''}`}>
        <Spin tip="加载中..." spinning={loading}>
          <div className={styles.cust_list_box}>
            <h3 className={styles.cust_title}>{title}</h3>
            {newList && newList.length > 0 ? <ul className={styles.cust_list}>
              {this.itemRender()}
            </ul> : <NullData />}
          </div>

          {hasAction && <Button
            type="primary"
            className={styles.cust_add}
            disabled={selectIndex || selectIndex === 0}
            onClick={this.openInput.bind(this, 'add')}
          >新增</Button>}
        </Spin>
      </div>
    )
  }
}

export default CustList
