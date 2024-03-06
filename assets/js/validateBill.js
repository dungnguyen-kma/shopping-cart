
const inputFirstName = document.querySelector('.input--field.input-firstname')
const inputLastName = document.querySelector('.input--field.input-lastname')
const inputEmail = document.querySelector('.input--field.email')
const inputPhone = document.querySelector('.input--field.phonenumber')
const inputAddressNumber = document.querySelector('.input--field.address-number')
const provinceElement = document.querySelector('.province')


const validateBill = (function () {
    function validateName(value) {
        const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/
        const hasSpecialChars = specialChars.test(value)
        const numbers = /[0-9]/
        const hasNumbers = numbers.test(value)
        if (hasSpecialChars || hasNumbers) {
            return false
        } else {
            return true
        }
    }

    function validateEmail(value) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (regex.test(value)) {
            return true
        } else {
            return false
        }
    }

    function isPhoneNumber(value) {
        const regex = /^\d{10}$/
        if(!isEmpty(value)){
            return
        }
        else if (regex.test(value)) {
            return false
        } else {
            return true
        }
    }

    function isEmpty(value) {
        const isEmpty = value.trim() === ''
        if (isEmpty) {
            return false
        } else {
            return true
        }
    }

    function validateAddress(value) {
        const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/
        const hasSpecialChars = specialChars.test(value)
        if (hasSpecialChars) {
            return false
        } else {
            return true
        }
    }

    function validateInputOnBlur() {
        inputFirstName.addEventListener('blur', () => {
            const valueFirstName = inputFirstName.value
            if (!validateName(valueFirstName)) {
                document.querySelector('.warn-firstname').textContent = 'Họ không được chứa ký tự đặc biệt và số!'
            } else if (!isEmpty(valueFirstName)) {
                document.querySelector('.warn-firstname').textContent = 'Không được để trống!'
            } else {
                document.querySelector('.warn-firstname').textContent = ''
            }
        })
        inputLastName.addEventListener('blur', () => {
            const valueLastName = inputLastName.value
            if (!validateName(valueLastName)) {
                document.querySelector('.warn-lastname').textContent = 'Tên không được chứa ký tự đặc biệt và số!'
            } else if (!isEmpty(valueLastName)) {
                document.querySelector('.warn-lastname').textContent = 'Không được để trống!'
            } else {
                document.querySelector('.warn-lastname').textContent = ''
            }
        })
        inputEmail.addEventListener('blur', () => {
            const valueEmail = inputEmail.value
            if (!validateEmail(valueEmail)) {
                document.querySelector('.warn-email').textContent = 'Email không đúng!'
            } else {
                document.querySelector('.warn-email').textContent = ''
            }
        })
        inputPhone.addEventListener('blur', () => {
            const phoneValue = inputPhone.value
            if (isPhoneNumber(phoneValue)) {
                document.querySelector('.warn-phone').textContent = 'số điện thoại phải là 10 số!'
            } else if (!isEmpty(phoneValue)) {
                document.querySelector('.warn-phone').textContent = 'Không được để trống!'
            } else {
                document.querySelector('.warn-phone').textContent = ''
            }
        })
        inputAddressNumber.addEventListener('blur', () => {
            const addressValue = inputAddressNumber.value
            if (!validateAddress(addressValue)) {
                document.querySelector('.warn-address-number').textContent = 'Số nhà không đúng'
            } else if (!isEmpty(inputAddressNumber.value)) {
                document.querySelector('.warn-address-number').textContent = 'Không được để trống'
            }
            else {
                document.querySelector('.warn-address-number').textContent = ''
            }
        })
    }

    function validateInputIfEmpty() {
        let isValid = true;
        if (!(validateBill.isEmpty(inputFirstName.value))) {
            document.querySelector('.warn-firstname').textContent = 'Không được để trống!'
            isValid = false
        } if (!(validateBill.isEmpty(inputLastName.value))) {
            document.querySelector('.warn-lastname').textContent = 'Không được để trống!'
            isValid = false
        } if (!(validateBill.isEmpty(inputEmail.value))) {
            document.querySelector('.warn-email').textContent = 'Không được để trống!'
            isValid = false
        } if (!(validateBill.isEmpty(inputPhone.value))) {
            document.querySelector('.warn-phone').textContent = 'Không được để trống!'
            isValid = false
        } if (!(validateBill.isEmpty(inputAddressNumber.value))) {
            document.querySelector('.warn-address-number').textContent = 'Không được để trống!'
            isValid = false
        } if (Number(provinceElement.value) === 0) {
            document.querySelector('.warn-select').textContent = 'Vui lòng chọn địa chỉ!'
            return false
        }
        return isValid
    }

    function clearInput(){
        inputFirstName.value = ''
        inputLastName.value = ''
        inputEmail.value = ''
        inputPhone.value = ''
        inputAddressNumber.value = ''
    }

    function clearWarning(){
        document.querySelector('.warn-firstname').textContent = ''
        document.querySelector('.warn-lastname').textContent = ''
        document.querySelector('.warn-email').textContent = ''
        document.querySelector('.warn-phone').textContent = ''
        document.querySelector('.warn-address-number').textContent = ''
        document.querySelector('.warn-select').textContent = ''
    }

    return {
        validateName,
        validateEmail,
        isEmpty,
        isPhoneNumber,
        validateInputOnBlur,
        validateInputIfEmpty,
        clearInput,
        clearWarning
    }
})()

export default validateBill