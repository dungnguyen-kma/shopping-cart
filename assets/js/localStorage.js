
export const keyLocalStorageListSP = "DANHSACHSP"
export const keyLocalStorageItemCart = "DANHSACHITEMCART"

const handleLocalData = (function(){
    function uploadDataToLocalStorage(key, data){
        if (data) {           
            localStorage.setItem(key, JSON.stringify(data));
        }

    }
    function getDataFromLocalStorage(key){
        const listItemData = localStorage.getItem(key)
        let data = []
        if (listItemData !== null) {
            data = JSON.parse(listItemData)
        }
        return data
    }
    function addItemToCart(id){     
        const productData = handleLocalData.getDataFromLocalStorage(keyLocalStorageListSP)
        const cartData = handleLocalData.getDataFromLocalStorage(keyLocalStorageItemCart)
        const indexProduct = productData.findIndex(product => product.id === id)
        const indexCart = cartData.findIndex(cart => cart.idSP === id)
        if (0 === productData[indexProduct].quantity) {
            alert("Sản phẩm này đã hết hàng!")
        } else if (indexCart < 0) {
            cartData.push({ 'idSP': id, 'soluong': 1 })
        } else if (cartData[indexCart].soluong === productData[indexProduct].quantity) {
            alert("Bạn đã yêu cầu số lượng tối đa của sản phẩm hiện tại có trong kho")
        } else {
            cartData[indexCart].soluong++
        }
        handleLocalData.uploadDataToLocalStorage(keyLocalStorageItemCart, cartData)
    }
    return {
        uploadDataToLocalStorage,
        getDataFromLocalStorage,
        addItemToCart
    }
})()
export default handleLocalData