import renderHTML from "./renderItem.js"
import callAPI from "./callAPI.js"
import handleLocalData, { keyLocalStorageListSP } from "./localStorage.js"

const orderedPage = (function () {

    function changeDisplay(orderedData) {
        const listTitle = document.querySelector('.list__title')
        const emptyCart = document.querySelector('.cart__empty')
        if (orderedData.length > 0) {
            listTitle.style.display = 'grid'
        } else {
            listTitle.style.display = 'none'
            emptyCart.style.display = 'block'
        }
    }
    function openDetailModal(orderedData) {
        const detailBtn = document.querySelectorAll('.expand__details')
        const detailModalElement = document.querySelector('.ordered-details__modal')
        for (let i = 0; i < detailBtn.length; i++) {
            detailBtn[i].addEventListener('click', () => {
                detailModalElement.style.display = 'block'
                renderHTML.renderOrderedDetail(orderedData[i].id, orderedData)
            })
        }
    }

    function closeDetailModal() {
        const detailModalElement = document.querySelector('.ordered-details__modal')
        const detailModalMainElement = document.querySelector('.modal__main')
        detailModalElement.addEventListener('click', () => {
            detailModalElement.style.display = 'none'
        })
        detailModalMainElement.addEventListener('click', (e) => {
            e.stopPropagation()
        })
    }

    function refundOrderedProduct(orderedData) {
        const refundBtn = document.querySelectorAll('.ordered__refund')
        for (let i = 0; i < refundBtn.length; i++) {
            refundBtn[i].addEventListener('click', () => {
                if (confirm("Bạn muốn trả lại sản phẩm này?")) {
                    increaseProductAfterRefund(orderedData[i].product)
                    callAPI.deleteData(`http://localhost:3000/purchased/${orderedData[i].id}`)
                }
            })
        }
    }

    function increaseProductAfterRefund(orderedProduct) {
        const productData = handleLocalData.getDataFromLocalStorage(keyLocalStorageListSP)
        orderedProduct.forEach(item => {
            const product = productData.find(productItem => productItem.name === item.name)
            if (product) {
                product.quantity += item.quantity
            }
        })
        handleLocalData.uploadDataToLocalStorage(keyLocalStorageListSP, productData)
    }

    return {
        changeDisplay,
        openDetailModal,
        closeDetailModal,
        refundOrderedProduct,
        increaseProductAfterRefund
    }
})()

export default orderedPage