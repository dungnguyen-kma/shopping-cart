import handleLocalData, { keyLocalStorageListSP, keyLocalStorageItemCart } from "./localStorage.js";
import cartPage from "./cartPage.js";
import billForm from "./billForm.js";
import callAPI from "./callAPI.js";
import orderedPage from "./orderedPage.js";

const renderHTML = (function () {
    function renderProductList() {
        const productData = handleLocalData.getDataFromLocalStorage(keyLocalStorageListSP)
        const productList = document.querySelector('.product__list')
        let listItem = ''
        productData.map((item) => {
            listItem +=
                `
                <li class="list__item">
                    <img src=${item.image} alt=${item.imageAlt} class="item--image">
                    <p class="item--desc">${item.name}</p>
                    <p class="item--price">Price: $${item.price}</p>
                    <p class="item--quantity">Quantity: ${item.quantity}</p>
                    <div class="add-to-cart__btn">
                        <i class="fa-solid fa-cart-shopping btn--icon"></i>
                    </div>
                </li>
                `
        })
        productList.innerHTML = listItem
    }

    function renderCartItemNumber() {
        const cartData = handleLocalData.getDataFromLocalStorage(keyLocalStorageItemCart)
        const cartIcon = document.querySelector('.cart--icon')
        if (cartData.length > 0) {
            let number = cartData.length;
            cartIcon.classList.add('has-pseudo')
            cartIcon.setAttribute('data-content', `${number}`)
        } else {
            cartIcon.classList.remove('has-pseudo')
        }
    }

    function renderCartProductList() {
        const cartData = handleLocalData.getDataFromLocalStorage(keyLocalStorageItemCart)
        const productData = handleLocalData.getDataFromLocalStorage(keyLocalStorageListSP)
        const cartList = document.querySelector('.cart__list')
        let listItem = ''
        cartData.map((cartItem) => {
            let productIndex = productData.findIndex(productItem => productItem.id === cartItem.idSP)
            listItem +=
                `
                <li class="list__item">
                    <div class="product__info">
                        <img src="${productData[productIndex].image}" alt="${productData[productIndex].imageAlt}" class="product--image">
                        <div class="product__desc">
                            <h3>${productData[productIndex].name}</h3>
                            <span>quantity: ${productData[productIndex].quantity}</span>
                        </div>
                    </div>
                    <div class="product__quantity product--item">
                        <i class="fa-solid fa-minus quantity-control--btn"></i>
                        <span class="product--quantity">${cartItem.soluong}</span>
                        <i class="fa-solid fa-plus quantity-control--btn"></i>
                    </div>
                    <p class="product--subtotal product--item">$${productData[productIndex].price}</p>
                    <p class="product--total product--item">$${cartItem.soluong * productData[productIndex].price}</p>
                    <i class="fa-regular fa-circle-xmark product--clear-btn product--item"></i>
                </li>
                `
        })
        cartList.innerHTML = listItem
    }

    function renderTotalPrice() {
        const totalPriceElement = document.querySelector('.total-price')
        const totalPriceValue = cartPage.totalPrice()
        totalPriceElement.innerHTML = `Total: $${totalPriceValue}`
    }

    async function renderProvinces() {
        const provinceElement = document.querySelector('.province')
        const districtElement = document.querySelector('.district')
        const wardElement = document.querySelector('.ward')
        const { getProvinces } = callAPI
        const provinceData = await getProvinces()
        let htmlProvince = '<option selected value="0" class="select--province">--Chọn Tỉnh/Thành phố--</option>'
        provinceData.map(function (province) {
            htmlProvince +=
                `
                <option value="${province.code}" class="select--province">${province.name}</option>
                `
        })
        provinceElement.innerHTML = htmlProvince
        provinceElement.addEventListener('change', (e) => {
            document.querySelector('.warn-select').textContent = ''
            districtElement.innerHTML = '<option selected value="0" class="select--district">--Chọn Quận/Huyện--</option>'
            wardElement.innerHTML = '<option selected value="0" class="select--ward">--Chọn Phường/Xã--</option>'
            renderDistricts(e.target.value)
        })
    }

    async function renderDistricts(provinceID) {
        const districtElement = document.querySelector('.district')
        const { getDistrictsByProviceID } = billForm
        const districtData = await getDistrictsByProviceID(provinceID)
        let htmlDistrict = '<option selected value="0" class="select--district">--Chọn Quận/Huyện--</option>'
        districtData.map(district => {
            htmlDistrict +=
                `
                <option value="${district.code}" class="select--ward">${district.name}</option>
                `
        })
        districtElement.innerHTML = htmlDistrict
        districtElement.addEventListener('change', (e) => {
            renderWards(e.target.value)
        })
    }

    async function renderWards(distrctID) {
        const wardElement = document.querySelector('.ward')
        const { getWardsByDistrictID } = billForm
        const wardData = await getWardsByDistrictID(distrctID)
        let htmlWard = '<option selected value="0" class="select--ward">--Chọn Phường/Xã--</option>'
        wardData.map(ward => {
            htmlWard +=
                `
                <option value="${ward.code}" class="select--ward">${ward.name}</option>
                `
        })
        wardElement.innerHTML = htmlWard
    }

    async function renderOrderedItem() {
        const orderedListElement = document.querySelector('.ordered__list')
        const orderedData = await callAPI.getData('http://localhost:3000/purchased')
        let orderedListHTML = ''
        orderedData.map(orderedItem => {
            const totalPrice = orderedItem.product.reduce((acc, productItem) => {
                return acc + productItem.totalPrice
            }, 0)
            orderedListHTML +=
                `
                <div class="ordered__item">
                    <div class="ordered__detail">
                        <p class="ordered--code">${orderedItem.id}</p>
                        <div class="expand__details">
                            <p class="details--text">details</p>
                            <i class="fa-solid fa-caret-down"></i>
                        </div>
                    </div>
                    <p class="ordered--name">${orderedItem.name}</p>
                    <p class="ordered--date">${orderedItem.date}</p>
                    <p class="ordered--product-number">${orderedItem.product.length}</p>
                    <p class="ordered--total-price">$${totalPrice}</p>
                    <div class="ordered__refund">
                        <i class="fa-solid fa-arrow-rotate-left refund--btn"></i>
                    </div>
                </div>
                `
        })
        orderedListElement.innerHTML = orderedListHTML
        orderedPage.changeDisplay(orderedData)
        orderedPage.openDetailModal(orderedData)
        orderedPage.closeDetailModal()
        orderedPage.refundOrderedProduct(orderedData)
    }

    function renderOrderedDetail(orderedItemId, orderedData) {
        const modalDetailElement = document.querySelector('.modal__details')
        const orderedDataIndex = orderedData.findIndex(orderedItem => {
            return orderedItem.id === orderedItemId
        })
        const orderedProductData = orderedData[orderedDataIndex].product
        modalDetailElement.innerHTML =
            `
        <p class="detail--code item">${orderedData[orderedDataIndex].id}</p>
        <p class="detail--phone item">${orderedData[orderedDataIndex].phone}</p>
        <p class="detail--email item">${orderedData[orderedDataIndex].email}</p>
        <p class="detail--address item">${orderedData[orderedDataIndex].address}</p>
        <p class="detail--message item">${orderedData[orderedDataIndex].message}</p>
        <div class="detail__product-list item">
        </div
        `
        const detailProductListElement = document.querySelector('.detail__product-list')
        let productListItemHTML = ''
        orderedProductData.map(productItem => {
            productListItemHTML +=
                `
            <div class="product-list__item">
                <img src="${productItem.image}" alt="${productItem.imageAlt}" class="product--image product-detail--item">
                <p class="product--name product-detail--item">${productItem.name}</p>
                <div class="product__quantity product-detail--item">
                    <p class="quantity--label product--item">Số lượng: </p>
                    <p class="quantity--number product--item">${productItem.quantity}</p>
                </div>
                <div class="product__price product-detail--item">
                    <p class="price--label product--item">Đơn giá: </p>
                    <p class="price--number product--item">$${productItem.price}</p>
                </div>
                <div class="product__total-price product-detail--item">
                    <p class="total--label product--item">Thành tiền: </p>
                    <p class="total--number product--item">$${productItem.totalPrice}</p>
                </div>
            </div>
            `
        })
        detailProductListElement.innerHTML = productListItemHTML
    }

    return {
        renderProductList,
        renderCartItemNumber,
        renderCartProductList,
        renderTotalPrice,
        renderProvinces,
        renderDistricts,
        renderWards,
        renderOrderedItem,
        renderOrderedDetail
    }
})()

export default renderHTML