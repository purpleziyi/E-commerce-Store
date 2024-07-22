/* for centralize state*/
import { createContext, PropsWithChildren, useContext, useState } from "react";
import { Basket } from "../models/basket";

interface StoreContextValue{
    basket: Basket | null;
    setBasket: (basket: Basket) => void;
    removeItem: (productId: number, quantity: number) => void;
}

// create a method for storing context
export const StoreContext = createContext<StoreContextValue | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export function useStoreContext() {
    const context = useContext(StoreContext);

    if(context === undefined) {
        throw Error("Oops - there will be provider very soon");
    }

    return context;
}

// create a storeProvider, 该组件接受一个包含children属性的props对象，通过解构赋值，直接从 props 对象中提取 children 属性。
export function StoreProvider({ children }: PropsWithChildren<unknown>) { 
    const [basket, setBasket] = useState<Basket | null>(null);

    function removeItem(productId: number, quantity: number){
        if(!basket) return;
        const items = [...basket.items];  // create the copy of basket.itmes and store it in the items
        const itmeIndex = items.findIndex(i => i.productId === productId)  // Returns the index of the first element in the array where predicate is true, and -1 otherwise.
        if (itmeIndex >= 0){  // 说明有元素可以删除
            items [itmeIndex].quantity -= quantity;
            if (items[itmeIndex].quantity === 0) items.splice(itmeIndex, 1);  // splice用于通过移除或替换现有元素以及添加新元素来修改数组的内容
            setBasket(prevState => { // 访问前面的状态，并在此方法中使用
                return {...prevState!, items}  // 传入我们目前为止一直在处理的items数组
            })
        }
    }

    return (
        <StoreContext.Provider value={{ basket, setBasket, removeItem}}>
            {children}
        </StoreContext.Provider>
    )
} 
