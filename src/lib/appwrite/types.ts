export type User = {
    userId: string
    name: string
    email: string
    password: string
    phone: string
}

export type Bucket = {
    userId: string
    product: string[]
    totalPrice: string[]
}

export type CartItem = {
    $id: string;
    userId: string;
    pizzaId: string;
    dough: string;
    size: string;
    ingredient: string[];
    totalPrice: number;
    name: string;
    count: string;
}

export type Order = {
    _id?: string;
    userId: string;
    phone: string;
    deliveryType: 'delivery' | 'pickup';
    address: string;
    comment: string;
    items: string;
    totalPrice: string;
};