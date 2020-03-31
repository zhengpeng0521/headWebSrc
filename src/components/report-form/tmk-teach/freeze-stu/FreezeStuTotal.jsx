import React from "react"
import styles from "./FreezeStuTotal.less"

function FreezeStuTotal({ total }) {
  let columns = [
    { label: "已冻结剩余课时合计", key: "countPeriodLeft" },
    { label: "已冻结剩余课时金额合计", key: "countMoneyLeft" },
    { label: "已冻结合同数合计", key: "countPurchase" }
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
          return <li key={"value" + index}>{total[item.key] || "0"}</li>
        })}
      </ul>
    </div>
  )
}

export default FreezeStuTotal
