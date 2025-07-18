export interface Pizza {
    id: number
    name: string
    ingridients: string[]
    dough: string[]
    sizes: string[]
    imageUrl: string
    price: number
}

export const PizzaCatalog: Pizza[] = [
    {
        id: 1,
        name: "Чоризо фреш",
        ingridients: ["Маринованные огурчики", "Свежие томаты", "Красный лук", "Сочные ананасы", "Итальянские травы", "Сладкий перец", "Кубики брынзы", "Митболы"],
        imageUrl: "/assets/pizza1.webp",
        price: 453,
        sizes: ["20 см", "30 см", "40 см"],
        dough: ["Тонкое", "Традиционное"]
    },
    {
        id: 2,
        name: "Пепперони фреш",
        ingridients: ["Сырный бортик", "Сливочная моцарелла", "Сыры чеддер и пармезан", "Нежный цыпленок"],
        imageUrl: "/assets/pizza2.webp",
        price: 205,
        sizes: ["20 см", "30 см", "40 см"],
        dough: ["Тонкое", "Традиционное"]
    },
    {
        id: 3,
        name: "Креветки со сладким чили",
        ingridients: ["Креветки", "Соус сладкий чили", "Сладкий перец", "Сочные ананасы", "Сливочная моцарелла", "Фирменный соус альфредо"],
        imageUrl: "/assets/pizza3.webp",
        price: 469,
        sizes: ["20 см", "30 см", "40 см"],
        dough: ["Тонкое", "Традиционное"]
    },
    {
        id: 4,
        name: "Креветка и песто",
        ingridients: ["Креветки", "Свежие томаты", "Шампиньоны", "Соус песто", "Сливочная моцарелла", "Итальянские травы", "Фирменный томатный соус"],
        imageUrl: "/assets/pizza4.webp",
        price: 479,
        sizes: ["20 см", "30 см", "40 см"],
        dough: ["Тонкое", "Традиционное"]
    },
    {
        id: 5,
        name: "Ветчина и грибы",
        ingridients: ["Ветчина", "Шампиньоны", "Сливочная моцарелла", "Фирменный томатный соус"],
        imageUrl: "/assets/pizza5.webp",
        price: 379,
        sizes: ["20 см", "30 см", "40 см"],
        dough: ["Тонкое", "Традиционное"]
    },
    {
        id: 6,
        name: "Охотничья",
        ingridients: ["Классические колбаски", "Красный лук", "Свежие томаты", "Союс барбекю", "Сливочная моцарелла", "Фирменный томатный соус"],
        imageUrl: "/assets/pizza6.webp",
        price: 419,
        sizes: ["20 см", "30 см", "40 см"],
        dough: ["Тонкое", "Традиционное"]
    },
    {
        id: 7,
        name: "Гавайская",
        ingridients: ["Нежный цыпленок", "Сочные ананасы", "Сливочная моцарелла", "Фирменный соус альфредо"],
        imageUrl: "/assets/pizza7.webp",
        price: 339,
        sizes: ["20 см", "30 см", "40 см"],
        dough: ["Тонкое", "Традиционное"]
    },
    {
        id: 8,
        name: "Диабло",
        ingridients: ["Острые колбаски чоризо", "Острый перец халапенью", "Соус барбекю", "Митболы", "Свежие томаты", "Сладкий перец", "Красный лук", "Сливочная моцарелла", "Фирменный томатный соус"],
        imageUrl: "/assets/pizza8.webp",
        price: 439,
        sizes: ["20 см", "30 см", "40 см"],
        dough: ["Тонкое", "Традиционное"]
    },
    {
        id: 9,
        name: "Чилл грилл",
        ingridients: ["Нежный цыпленок", "Маринованные огурчики", "Соус гриль", "Красный лук", "Сливочная моцарелла", "Чеснок", "Фирменный соус альфредо"],
        imageUrl: "/assets/pizza9.webp",
        price: 369,
        sizes: ["20 см", "30 см", "40 см"],
        dough: ["Тонкое", "Традиционное"]
    },
    {
        id: 10,
        name: "Креветки блю чиз",
        ingridients: ["Креветки", "Сыр блю чиз", "Сливочная моцарелла", "Фирменный соус альфредо"],
        imageUrl: "/assets/pizza10.webp",
        price: 749,
        sizes: ["20 см", "30 см", "40 см"],
        dough: ["Тонкое", "Традиционное"]
    },
]