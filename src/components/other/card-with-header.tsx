import { Card } from "antd"
import React, { ReactNode } from "react"

interface CardWithHeaderProps {
  title: string
  children: ReactNode
}

const CardWithHeader = ({ children, title }: CardWithHeaderProps) => {
  return (
    <Card title={title} headStyle={{ fontSize: "1.5rem", textAlign: "center" }}>
      {children}
    </Card>
  )
}

export default CardWithHeader
