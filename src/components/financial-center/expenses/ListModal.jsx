import React from "react"
import { Modal, Button, Spin, Input, Popconfirm } from "antd"
import styles from "./ListModal.less"

function ListModal({
  listVisible,
  listType, // 弹窗类型
  listLoading,
  list, // 列表
  selectIndex, // 当前选中项
  itemName, // 类别名

  /** 方法 */
  closeListModal,
  deleteItem, // 删除类别
  editItem, // 编辑类别名
  itemNameChange, // 类别名change
  saveItem, // 保存类别名
  cancelItem, // 取消类别名
  createItem // 增加类别
}) {
  const title = listType == "project" ? "支出项目" : "支付方式"

  function itemRender() {
    let placeholder =
      listType == "project" ? "支出项目最多8个字" : "支付方式最多15字"
    let items = []
    list &&
      list.map((item, index) => {
        if (index === selectIndex) {
          items.push(
            <li key={"item" + index} className={styles.expense_item}>
              <Input
                className={styles.expense_item_name}
                placeholder={placeholder}
                value={itemName}
                onChange={itemNameChange}
              />
              <div className={styles.item_action}>
                <a onClick={saveItem.bind(this, item)} disabled={!itemName && itemName == ""}>
                  保存
                </a>
                <a onClick={cancelItem}>取消</a>
              </div>
            </li>
          )
        } else {
          items.push(
            <li key={"item" + index} className={styles.expense_item}>
              <span>{item.name}</span>
              <div className={styles.item_action}>
                <a disabled={selectIndex || selectIndex === 0} onClick={editItem.bind(this, index, item)}>编辑</a>
                <Popconfirm
                title="确定要删除吗?"
                onConfirm={deleteItem.bind(this, item)}>
                  <a disabled={selectIndex || selectIndex === 0}>删除</a>
                </Popconfirm>
              </div>
            </li>
          )
        }
      })

    return items
  }

  return (
    <Modal
      title={title}
      width={500}
      maskClosable={false}
      visible={listVisible}
      onCancel={closeListModal}
      footer={null}>

      <Spin tip="加载中..." spinning={listLoading}>
        <Button
          type="primary"
          disabled={selectIndex || selectIndex === 0}
          onClick={createItem}>
          添加类别
        </Button>
        <div className={styles.expense_list_box}>
          <ul className={styles.expense_list}>{itemRender()}</ul>
        </div>
      </Spin>
    </Modal>
  )
}

export default ListModal
