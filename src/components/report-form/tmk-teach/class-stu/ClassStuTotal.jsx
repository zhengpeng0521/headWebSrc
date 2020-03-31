import React from "react"
import styles from "./ClassStuTotal.less"

function ClassStuTotal({ total }) {
  let columns = [
    { label: "带班数", key: "clsNum" },
    { label: "班级人次", key: "clsStuNum" },
    { label: "满班数", key: "fullClsNum" },
    { label: "满班率", key: "fullClsRate" },
    { label: "班容", key: "capacityClsRate" },
    { label: "一人班", key: "oneClsNum" },
    { label: "学员出勤率（本月）", key: "signStuRate" }
  ]

  return (
    <div className={styles.report_form_top_total}>
      <ul className={styles.report_form_top_total_title}>
        <li>统计类型</li>
        {columns.map((item, index) => {
          return <li key={"title" + index}>{item.label}</li>
        })}
      </ul>
      <ul className={styles.report_form_top_total_date}>
        <li>总计</li>
        {columns.map((item, index) => {
          return <li key={"value" + index}>{total.length > 0 ? total[0][item.key] : "0"}</li>
        })}
      </ul>
    </div>
  )
}

export default ClassStuTotal
