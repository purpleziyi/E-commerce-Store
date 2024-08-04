import { Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow,  TextField,  Typography } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Product } from "../../app/models/product";
import agent from "../../app/api/agent";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { LoadingButton } from "@mui/lab";
import { useAppSelector, useAppDispatch } from "../../app/store/configureStore";
import { addBasketItemAsync, removeBasketItemAsync } from "../basket/basketSlice";


export default function ProductDetails() {
    const { basket, status } = useAppSelector(state => state.basket);
    const dispatch = useAppDispatch();
    const { id } = useParams<{ id: string }>();  // 从useParams中获得产品的id
    const [product, setProduct] = useState<Product | null>(null);  // initialized value
    const [loading, setLoading] = useState(true); // add loading state
    const [quantity, setQuantity] = useState(0);
    const item = basket?.items.find(i => i.productId === product?.id);

    useEffect(() => {
        if (item) setQuantity(item.quantity);
        id && agent.Catalog.details(parseInt(id)) //此时的id从useParams中获得
            .then(response => setProduct(response))  // get response-data
            .catch(error => console.log(error.response))  // check errors
            .finally(() => setLoading(false));
    }, [id,item]) //当依赖项参数id改变时，useEffect会被再次调用
    
    // 处理输入的变化
    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        if (parseInt(event.currentTarget.value) >= 0) {   // "quantity in cart" cannot be less than 0
            setQuantity(parseInt(event.currentTarget.value));
        }        
    }

    function handleUpdateCart() {
        // check if we have item or not
        if (!item || quantity > item.quantity) {
            const updatedQuantity = item ? quantity - item.quantity : quantity;
            // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
            dispatch(addBasketItemAsync({productId: product?.id!, quantity: updatedQuantity}))
        } else {
            const updatedQuantity = item.quantity - quantity;
            // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
            dispatch(removeBasketItemAsync({ productId: product?.id!, quantity: updatedQuantity }))
        }
    }

       
    if (loading) return <LoadingComponent message="Loading product..."/>

    if (!product) return <h3>Product not found</h3>
    
    return (
        <Grid container spacing={6}>
            <Grid item xs={6}>  
                <img src={product.pictureUrl} alt={product.name} style={{ width: '100%' }} />  {/*产品图片*/}
            </Grid>

            <Grid item xs={6}>
                {/*产品详情*/}
                <Typography variant='h3'>{product.name}</Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant='h4' color='secondary'>${(product.price / 100).toFixed(2)}</Typography>
                <TableContainer>
                    <Table>
                        <TableBody sx={{ fontSize: '1.1em' }}>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>{product.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Description</TableCell>
                                <TableCell>{product.description}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Type</TableCell>
                                <TableCell>{product.type}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Brand</TableCell>
                                <TableCell>{product.brand}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Quantity in stock</TableCell>
                                <TableCell>{product.quantityInStock}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField 
                            onChange={handleInputChange}
                            variant ='outlined'
                            type='number'
                            label ='Quantity in Cart'
                            fullWidth
                            value={quantity}
                        />
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    <LoadingButton
                        disabled={item?.quantity === quantity || !item && quantity === 0 }  // 当改变的数量与之前的数量相同，则更新按钮不能使用
                        loading ={status.includes('pendingRemoveItem' + item?.productId)}
                        onClick={handleUpdateCart}
                        sx={{height: '55ps'}}
                        color="primary"
                        size='large'
                        variant="contained"
                        fullWidth
                    >
                        {item ? 'Update Quantity' : 'Add to Cart'}
                    </LoadingButton>
                </Grid>


            </Grid>            
        </Grid>
    )
}