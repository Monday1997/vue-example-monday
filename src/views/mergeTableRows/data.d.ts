export enum EItem {
  scheme = 'scheme',
  attr1 = 'attr1',
  attr2 = 'attr2',
  attr3 = 'attr3',
  price = 'price',
  price2 = 'price2',
}
export type TColumn = `${EItem}`
export type TColumnProps = Omit<ColumnProps, 'dataIndex'> & {
  dataIndex: TColumn
}
