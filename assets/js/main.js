import listData from './productDatas.js';
import handleLocalData, { keyLocalStorageItemCart, keyLocalStorageListSP } from './localStorage.js';
import renderHTML from "./renderItem.js";
import cartPage from './cartPage.js';
import billForm from './billForm.js';

document.querySelector('.product__list')

function checkLocalData() {
    const checkProductData = localStorage.getItem(keyLocalStorageListSP)
    const checkCartData = localStorage.getItem(keyLocalStorageItemCart)
    if (checkProductData === null) {
        handleLocalData.uploadDataToLocalStorage(keyLocalStorageListSP, listData)
    }
    if (checkCartData === null) {
        handleLocalData.uploadDataToLocalStorage(keyLocalStorageItemCart, [])
    }
}
checkLocalData()

if (document.getElementById('homepage')) {
    function addSP(id) {
        handleLocalData.addItemToCart(id)
    }
    renderHTML.renderProductList()
    const addToCartBtn = document.querySelectorAll('.add-to-cart__btn')
    for (let i = 0; i < addToCartBtn.length; i++) {
        addToCartBtn[i].onclick = () => {
            addSP(i)
            renderHTML.renderCartItemNumber()
        }
    }
    renderHTML.renderCartItemNumber()
}

if (document.getElementById('cartpage')) {
    cartPage.changeDisplay()
    cartPage.displayModal.openModal()
    cartPage.displayModal.closeModal()
}
if (document.getElementById('bill')) {
    cartPage.modifyNumberOfItem()
    renderHTML.renderProvinces()
    billForm.createUserData()
}
if(document.getElementById('ordered-page')){
    renderHTML.renderOrderedItem()
    renderHTML.renderCartItemNumber()
}
