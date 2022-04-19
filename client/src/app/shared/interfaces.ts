//------- User ----------
export interface User {
  email: string
  password: string
}

//------- CATEGORY ----------
export interface Category {
  name: string
  imageSrc?: string
  parent?: string
  user?: string
  _id?: string
  level?: number
}

export interface CategoryResponse {
  success: boolean
  category: Category
  message: string
}

export interface CategoriesResponse {
  success: boolean
  categories: Category[]
  message: string
}

//------- POSITION ----------
export interface Position {
  name: string
  imageSrc?: string
  cost?: number
  barcode?: string
  category?: string
  user?: string
  _id?: string
}

export interface PositionResponse {
  success: boolean
  position: Position
  message: string
}

export interface PositionsResponse {
  success: boolean
  positions: Position[]
  message: string
}
//------- CLIENTS ----------
export interface Client {
  name: string
  phone?: string
  email?: string
  barcode?: string
  bdate?: Date
  user?: string
  _id?: string
}

export interface ClientsResponse {
  success: boolean
  clients: Client[]
  message: string
}

export interface ClientResponse {
  success: boolean
  client: Client
  message: string
}

//------- Orders ----------
export interface Order {
  _id?: string
  date: Date
  number: number
  user?: string
  client: Client
  list: [{
    name: string
    quantity: number
    cost: number
    total: number
  }],
  payment: [{
    type: string
    total: number
  }],
  client_details: [{
    name: string
    phone: string
    email: string
  }]
}

export interface OrderResponse {
  success: boolean
  order: Order
  message: string
}

export interface OrdersResponse {
  success: boolean
  orders: Order[]
  message: string
}
