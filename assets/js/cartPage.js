import handleLocalData, { keyLocalStorageItemCart, keyLocalStorageListSP } from "./localStorage.js";
import renderHTML from "./renderItem.js";
import validateBill from "./validateBill.js";

const cartPage = (function () {
    function totalPrice() {
        const cartData = handleLocalData.getDataFromLocalStorage(keyLocalStorageItemCart)
        const productData = handleLocalData.getDataFromLocalStorage(keyLocalStorageListSP)
        const totalPriceValue = cartData.reduce((acc, cartItem) => {
            let productIndex = productData.findIndex(productItem => productItem.id === cartItem.idSP)
            return acc + (productData[productIndex].price * cartItem.soluong)
        }, 0)
        return totalPriceValue
    }

    function changeDisplay() {
        const emptyCart = document.querySelector('.cart__empty')
        const buyBtn = document.querySelector('.buy--btn')
        const listTitle = document.querySelector('.list__title')
        const cartList = document.querySelector('.cart__list')
        const totalPriceElement = document.querySelector('.total-price')
        const cartData = handleLocalData.getDataFromLocalStorage(keyLocalStorageItemCart)
        if (cartData.length > 0) {
            renderHTML.renderCartProductList()
            emptyCart.style.display = 'none'
            buyBtn.style.display = 'block'
            listTitle.style.display = 'flex'
            totalPriceElement.style.display = 'block'
            renderHTML.renderTotalPrice()
        }
        else {
            emptyCart.style.display = 'block'
            buyBtn.style.display = 'none'
            listTitle.style.display = 'none'
            cartList.style.display = 'none'
            totalPriceElement.style.display = 'none'
        }
    }

    function clearItem(id) {
        const cartData = handleLocalData.getDataFromLocalStorage(keyLocalStorageItemCart)
        if (confirm('Bạn muốn xóa sản phẩm này?')) {
            const cartIndex = cartData.findIndex(cartItem => cartItem.idSP === id)
            cartData.splice(cartIndex, 1)
            handleLocalData.uploadDataToLocalStorage(keyLocalStorageItemCart, cartData)
            changeDisplay()
        }
    }

    function plusCartItem(id) {
        handleLocalData.addItemToCart(id)
        changeDisplay()
    }

    function minusCartItem(id) {
        const cartData = handleLocalData.getDataFromLocalStorage(keyLocalStorageItemCart)
        let cartIndex = cartData.findIndex(cartItem => cartItem.idSP === id)
        if (cartData[cartIndex].soluong > 1) {
            cartData[cartIndex].soluong--
            handleLocalData.uploadDataToLocalStorage(keyLocalStorageItemCart, cartData)
            renderHTML.renderCartProductList()
            changeDisplay()
        } else {
            cartPage.clearItem(id)
        }
    }

    function modifyNumberOfItem() {
        const minusBtns = document.querySelectorAll('.fa-minus')
        const plusBtns = document.querySelectorAll('.fa-plus')
        const clearBtns = document.querySelectorAll('.product--clear-btn')
        const cartData = handleLocalData.getDataFromLocalStorage(keyLocalStorageItemCart)
        renderHTML.renderCartItemNumber()
        for (let i = 0; i < cartData.length; i++) {
            minusBtns[i].onclick = () => {
                minusCartItem(cartData[i].idSP)
                modifyNumberOfItem()
            }
        } for (let i = 0; i < cartData.length; i++) {
            plusBtns[i].onclick = () => {
                plusCartItem(cartData[i].idSP)
                modifyNumberOfItem()
            }
        }
        for (let i = 0; i < cartData.length; i++) {
            clearBtns[i].onclick = () => {
                clearItem(cartData[i].idSP)
                modifyNumberOfItem()
            }
        }
    }

    const displayModal = (function displayBillModal() {
        const modal = document.querySelector('.buy-modal')
        const buyBtn = document.querySelector('.buy--btn')
        const closeBtn = document.querySelector('.modal__close')
        const ignoreBtn = document.querySelector('.submit--btn.ignore')
        function openModal() {
            buyBtn.addEventListener('click', () => {
                modal.style.display = 'block'
                validateBill.clearInput()
                validateBill.clearWarning()
            })
        }
        function closeModal() {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none'
            })
            ignoreBtn.addEventListener('click', () => {
                modal.style.display = 'none'
            })
        }
        return {
            openModal,
            closeModal
        }
    })()
    return {
        displayModal,
        totalPrice,
        changeDisplay,
        plusCartItem,
        minusCartItem,
        clearItem,
        modifyNumberOfItem
    }
})()

export default cartPage
