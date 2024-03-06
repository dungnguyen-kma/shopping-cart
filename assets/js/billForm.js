import handleLocalData, { keyLocalStorageItemCart, keyLocalStorageListSP } from "./localStorage.js";
import validateBill from "./validateBill.js";
import callAPI from "./callAPI.js";

const inputFirstName = document.querySelector('.input--field.input-firstname')
const inputLastName = document.querySelector('.input--field.input-lastname')
const inputEmail = document.querySelector('.input--field.email')
const inputPhone = document.querySelector('.input--field.phonenumber')
const provinceElement = document.querySelector('.province')
const districtElement = document.querySelector('.district')
const wardElement = document.querySelector('.ward')
const inputAddressNumber = document.querySelector('.input--field.address-number')
const inputMessage = document.querySelector('.input--field.input-message')


const userData = []

const billForm = (function () {
    function randomID() {
        const newUserId = Math.floor(Math.random() * 1000) + 1
        userData.map((user) => {
            if (user.id === newUserId) {
                randomID()
            }
        })
        return newUserId
    }

    async function getDistrictsByProviceID(provinceID) {
        const districtData = await callAPI.getDistricts()
        const districtByProvinceID = districtData.filter(districtItem => {
            return districtItem.province_code === Number(provinceID)
        })
        return districtByProvinceID
    }

    async function getWardsByDistrictID(DistrictID) {
        const wardData = await callAPI.getWards()
        const wardByDistrictID = wardData.filter(wardItem => {
            return wardItem.district_code === Number(DistrictID)
        })
        return wardByDistrictID
    }

    function getOrderedProductByCartID() {
        const cartData = handleLocalData.getDataFromLocalStorage(keyLocalStorageItemCart)
        const productData = handleLocalData.getDataFromLocalStorage(keyLocalStorageListSP)
        const purchasedProduct = cartData.map(cartItem => {
            const productIndex = productData.findIndex(productItem => productItem.id === cartItem.idSP)
            return {
                name: productData[productIndex].name,
                image: productData[productIndex].image,
                price: productData[productIndex].price,
                quantity: cartItem.soluong,
                totalPrice: cartItem.soluong * productData[productIndex].price
            }
        })
        return purchasedProduct
    }

    function reduceProductAfterOrdered() {
        const cartData = handleLocalData.getDataFromLocalStorage(keyLocalStorageItemCart)
        const productData = handleLocalData.getDataFromLocalStorage(keyLocalStorageListSP)
        cartData.forEach(cartItem => {
            const product = productData.find(item => item.id === cartItem.idSP)
            if (product) {
                product.quantity -= cartItem.soluong
            }
        })
        handleLocalData.uploadDataToLocalStorage(keyLocalStorageListSP, productData)
    }

    async function createUserData() {
        const provinceData = await callAPI.getProvinces()
        const districtData = await callAPI.getDistricts()
        const wardData = await callAPI.getWards()
        const date = new Date()
        validateBill.validateInputOnBlur()
        document.querySelector('.submit--btn.submit').addEventListener('click', () => {
            if (validateBill.validateInputIfEmpty() === true) {
                const customerName = `${inputFirstName.value} ${inputLastName.value}`
                const customerPhone = inputPhone.value
                const customerEmail = inputEmail.value
                const selectedProvince = provinceData.find(province => province.code === Number(provinceElement.value))
                const selectedDistrict = districtData.find(district => district.code === Number(districtElement.value))
                const selectedWard = wardData.find(ward => ward.code === Number(wardElement.value))
                const currentDay = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
                const customerAddress = `${inputAddressNumber.value}, ${selectedWard.name}, ${selectedDistrict.name}, ${selectedProvince.name}`
                const messageValue = inputMessage.value
                const orderedProduct = getOrderedProductByCartID()
                userData.push(
                    {
                        id: randomID(),
                        date: currentDay,
                        name: customerName,
                        phone: customerPhone,
                        email: customerEmail,
                        address: customerAddress,
                        message: messageValue,
                        product: orderedProduct
                    }
                )
                reduceProductAfterOrdered()
                callAPI.postData('http://localhost:3000/purchased', ...userData)
                alert('Bạn vừa đặt hàng thành công')
                handleLocalData.uploadDataToLocalStorage(keyLocalStorageItemCart, [])
            }
        })
    }
    return {
        randomID,
        getDistrictsByProviceID,
        getWardsByDistrictID,
        getOrderedProductByCartID,
        createUserData,
    }
})()
export default billForm