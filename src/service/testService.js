export default {
    testConnect(){
        return new Promise((resolve,reject)=>{
            axios.get('http://localhost:3030/getList').then(res=>resolve(res))
        })
    }
}