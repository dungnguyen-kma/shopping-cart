
const callAPI = (function () {
    async function postData(url, data) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
        } catch (e) {
            alert("Không thể lưu dữ liệu lên API")
            console.error(e)
        }
    }

    async function getData(url) {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            })
            return await response.json()
        } catch (e) {
            alert("Không lấy dữ liệu từ API")
            console.error(e)
        }
    }

    async function deleteData(url) {
        try {
            await fetch(url, {
                method: "DELETE",
            })
        } catch (e) {
            alert("Không thể xóa dữ liệu trên API")
            console.error(e)
        }
    }

    async function getProvinces() {
        try {
            const response = await fetch('https://provinces.open-api.vn/api/p/')
            const provinceData = await response.json()
            return provinceData
        }
        catch (e) {
            alert('Không thể lấy dữ liệu tỉnh/thành phố')
            console.log(e)
        }
    }

    async function getDistricts() {
        try {
            const response = await fetch('https://provinces.open-api.vn/api/d/')
            const DistrictData = await response.json()
            return DistrictData
        }
        catch (e) {
            alert('Không thể lấy dữ liệu quận/huyện')
            console.log(e)
        }
    }

    async function getWards() {
        try {
            const response = await fetch('https://provinces.open-api.vn/api/w/')
            const wardData = await response.json()
            return wardData
        }
        catch (e) {
            alert('Không thể lấy dữ liệu phường/xã')
            console.log(e)
        }
    }

    
    return {
        postData,
        getData,
        deleteData,
        getProvinces,
        getDistricts,
        getWards
    }
})()

export default callAPI