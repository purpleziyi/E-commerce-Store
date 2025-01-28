import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { User } from "../../app/models/user";
import { FieldValues } from "react-hook-form";
import agent from "../../app/api/agent";
import { router } from "../../app/router/Routes";
import { toast } from "react-toastify";
import { setBasket } from "../basket/basketSlice";


interface AccountState {
    user: User | null;
}

const initialState: AccountState = {
    user: null    
}

export const signInUser = createAsyncThunk<User, FieldValues>(
    'account/signInUser',  // type prefix
    async (data, thunkAPI) => { // create an async function
        try{
            const userDto = await agent.Account.login(data);
            const {basket, ...user} = userDto;  // destruct user with email and token
            if(basket) thunkAPI.dispatch(setBasket(basket));
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    }
)

export const fetchCurrentUser = createAsyncThunk<User>(  // no need to pass data as param
    'account/fetchCurrentUser', // type prefix
    async (_, thunkAPI) => {  
        thunkAPI.dispatch(setUser(JSON.parse(localStorage.getItem('user')!)));
        try {
            const userDto = await agent.Account.currentUser();
            const { basket, ...user } = userDto;  // same logic as signInUser
            if (basket) thunkAPI.dispatch(setBasket(basket));
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    },
    {
        condition: () => {
            if (!localStorage.getItem('user')) return false;
        }
    }
)

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        signOut: (state) => {
            state.user = null;  // reset user as null
            localStorage.removeItem('user');
            router.navigate('/'); // go to HomePage
        },
        setUser: (state, action) => {
            state.user = action.payload;   
        }
    },
    extraReducers: (builder => {
        builder.addCase(fetchCurrentUser.rejected, (state) => {
            state.user = null;
            localStorage.removeItem('user');
            toast.error('Session expired - please login again');
            router.navigate('/');
        })
        builder.addMatcher(isAnyOf(signInUser.fulfilled, fetchCurrentUser.fulfilled), (_state, action) =>{
            _state.user = action.payload;
        });
        builder.addMatcher(isAnyOf(signInUser.rejected), (_state, action) => {
            console.log(action.payload);            
        })
    })
})

export const {signOut, setUser} = accountSlice.actions;