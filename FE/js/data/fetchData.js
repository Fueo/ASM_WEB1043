import { fetchJsonData } from "../util/fetchJsonData.js";
const DATA_URL = 'http://localhost:3000/api/';
let ProductIndexList = [];
let OrderList = [];
let ProductList = [];
let CategoryList = [];

export async function initializeIndex() {
    const fullData = await fetchJsonData(DATA_URL + 'index');
    if (fullData) ProductIndexList = fullData;
    return fullData || [];
}

export async function initializeOrder() {
    const fullData = await fetchJsonData(DATA_URL + 'orders-history');
    if (fullData) {
        OrderList = fullData;
    }
    return fullData || [];
}



export async function initializeCategories() {
    const fullData = await fetchJsonData(DATA_URL + 'category');
    if (fullData) {
        CategoryList = fullData;
    }
    return fullData || [];
}



export async function initializeProduct() {
    const fullData = await fetchJsonData(DATA_URL + 'product');
    if (fullData) {
        ProductList = fullData;
    }
    return fullData || [];
}


export function getAllProducts() {
    return ProductList;
}

export function getAllProductIndex() {
    return ProductIndexList;
}


export function getAllOrder() {
    return OrderList;
}

export function getAllCategory() {
    return CategoryList;
}