
import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { Basket } from "../../app/models/basket";
import agent from "../../app/api/agent";
import { getCookie } from "../../app/util/util";

interface BasketState {
    basket: Basket | null;
    status: string
}

const initialState: BasketState = {
    basket: null,
    status: 'idle'   
}

export const fetchBasketAsync = createAsyncThunk<Basket>(
    'basket/fetchBasketAsync',
    async(_, thunkAPI) => {
        try{
            return await agent.Basket.get();
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    },
    {  // 当没有buyerId时(在inspect中的application中查看Cookies),返回false，以防止调用该函数
        condition: () => {
            if (!getCookie('buyerId')) return false;
        }
    }
)

// 异步添加购物车物品
export const addBasketItemAsync =  createAsyncThunk<Basket, {productId: number, quantity?: number }>(
    'basket/addBasketItemAsync',
    async ({productId, quantity = 1}) => {
        try {
            return await agent.Basket.addItem(productId, quantity);
        } catch (error) {
            console.log(error);            
        }
    }
)

export const removeBasketItemAsync = createAsyncThunk<void, { productId: number, quantity: number, name?: string }>(
    'basket/removeBasketItemASync',
    async ({ productId, quantity }, thunkAPI) => {
            try {
                await agent.Basket.removeItem(productId, quantity);
            } catch (error: any) {
                return thunkAPI.rejectWithValue({ error: error.data })
            }
        }
    )

export const basketSlice = createSlice({
    name: 'basket',
    initialState,
    reducers: {
        setBasket: (state, action) => {
            state.basket = action.payload
        }
    },
    extraReducers: (builder => {
        builder.addCase(addBasketItemAsync.pending, (state, action) => {        
            state.status = 'pendingAddItem' + action.meta.arg.productId;
        });
        builder.addCase(removeBasketItemAsync.pending, (state, action) => {
            state.status = 'pendingRemoveItem' + action.meta.arg.productId + action.meta.arg.name;
        });
        builder.addCase(removeBasketItemAsync.fulfilled, (state, action) => {
            const { productId, quantity } = action.meta.arg; // 从payload中获得productId
            const itemIndex = state.basket?.items.findIndex(i => i.productId === productId);
            if (itemIndex === -1 || itemIndex === undefined) return;
            state.basket!.items[itemIndex].quantity -= quantity;
            if (state.basket?.items[itemIndex].quantity === 0)
                state.basket.items.splice(itemIndex, 1);
            state.status = 'idle';
        });
        builder.addCase(removeBasketItemAsync.rejected, (state, action) => {
            state.status = 'idle';
            console.log(action.payload);
        });
        builder.addMatcher(isAnyOf(addBasketItemAsync.fulfilled, fetchBasketAsync.fulfilled), (state, action) => {
            state.basket = action.payload;
            state.status = 'idle';  // 将加载状态设置为“闲置”
        });
        builder.addMatcher(isAnyOf(addBasketItemAsync.rejected, fetchBasketAsync.rejected), (state, action) => {
            state.status = 'idle';  // 将加载状态设置为“闲置”
            console.log(action.payload);
        });
    })
})

export const {setBasket} = basketSlice.actions;