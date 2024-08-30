import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { router } from "../router/Routes";
import { PaginatedResponse } from "../models/pagination";

// 在JS中处理异步代码
const sleep = () => new Promise(resolve => setTimeout(resolve, 500));

axios.defaults.baseURL = 'http://localhost:5000/api/';
axios.defaults.withCredentials = true;  // browser将收到cookie，APP中存储中将设置cookie

// create a help-method 以下写法保证了代码的简洁
const responseBody = (response: AxiosResponse) => response.data;

// use interceptor checking error-state
axios.interceptors.response.use (async response => {
    await sleep();  // 使用sleep方法delay 500ms
    const pagination = response.headers['pagination'];  // response only uses lowercase
    if (pagination){
        response.data = new PaginatedResponse(response.data, JSON.parse(pagination));
        return response;
    }
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
    get: (url: string, params?: URLSearchParams) => axios.get(url, { params }).then(responseBody),  // get-attribute,param is url, send a HTTP GET-request to the url
    post: (url: string, body: object) => axios.post(url, body).then(responseBody),
    put: (url: string, body: object) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody),
}

const Catalog = {
    list: (params: URLSearchParams) => requests.get('products', params),
    details: (id: number) => requests.get(`products/${id}`),  // 反引号用于定义模板字符串，当需要在字符串中嵌入变量或表达式时
    fetchFilters: () => requests.get('products/filters')
}

// create testerror-object
const TestErrors = {
    get400Error: () => requests.get('buggy/bad-request'),
    get401Error: () => requests.get('buggy/unauthorised'),
    get404Error: () => requests.get('buggy/not-found'),
    get500Error: () => requests.get('buggy/server-error'),
    getValidationError: () => requests.get('buggy/validation-error')
}

// create a basket-object
const Basket = {
    get: () => requests.get('basket'),

    // 向购物车添加项目 make sure that the params are in line with the basketController's HttpPost params
    addItem: (productId: number, quantity = 1) => requests.post(`basket?productId=${productId}&quantity=${quantity}`, {}),  //需要空对象{}来执行此请求

    // make sure that the params are in line with the basketController's HttpDelete params
    removeItem: (productId: number, quantity = 1) => requests.delete(`basket?productId=${productId}&quantity=${quantity}`)
}

const agent = {
    Catalog,
    TestErrors,
    Basket
}

export default agent;