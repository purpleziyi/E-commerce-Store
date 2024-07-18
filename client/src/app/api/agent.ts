import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { router } from "../router/Routes";

axios.defaults.baseURL = 'http://localhost:5000/api/';

// create a help-method 以下写法保证了代码的简洁
const responseBody = (response: AxiosResponse) => response.data;

// use interceptor checking error-state
axios.interceptors.response.use (response => {
    return response
}, (error: AxiosError) => {
    const { data, status } = error.response as AxiosResponse; //将error指定为AxiosResponse，以便我们从interceptor中删除该error
    switch (status){
        case 400:
            if (data.errors) {
                const modelStateErrors: string[] = [];  // create en array to store errors
                for (const key in data.errors) {
                    if (data.errors[key]) {
                        modelStateErrors.push(data.errors[key])
                    }
                }
                throw modelStateErrors.flat(); // use flat() to unfold the 2 strings in the array
            }
            toast.error(data.title);
            break;
        case 401:
            toast.error(data.title);
            break;
        // case 403:
        //     toast.error('You are not allowed to do that!');
        //     break;
        case 500:
            router.navigate('/server-error', {state: {error: data}});  // pass the 'data' to the 'state' of the route we navigate to
            break;
        default:
            break;
    }
    return Promise.reject(error.response);    
})

// define a request-object
const requests = {
    get: (url: string) => axios.get(url).then(responseBody),  // get-attribute,param is url, send a HTTP GET-request to the url
    post: (url: string, body:{}) => axios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody),
}

const Catalog = {
    list: () => requests.get('products'),
    details: (id: number) => requests.get(`products/${id}`)  // 反引号用于定义模板字符串，当需要在字符串中嵌入变量或表达式时
}

// create testerror-object
const TestErrors = {
    get400Error: () => requests.get('buggy/bad-request'),
    get401Error: () => requests.get('buggy/unauthorised'),
    get404Error: () => requests.get('buggy/not-found'),
    get500Error: () => requests.get('buggy/server-error'),
    getValidationError: () => requests.get('buggy/validation-error')
}

const agent = {
    Catalog,
    TestErrors
}

export default agent;