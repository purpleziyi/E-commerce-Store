import { Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Typography } from "@mui/material";
import { Product } from "../../app/models/product";
import { Link } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addBasketItemAsync } from "../basket/basketSlice";


interface Props {
    product: Product;
}

export default function ProductCard({ product }: Props) {
    const {state} = useAppSelector(state => state.basket);
    const dispatch = useAppDispatch();  // 需要使用dispatch来分派异步函数

    // 异步函数代码中不再需要一下方法
    // function handleAddItem(productId: number){  // 用于向购物车中添加项目的回调函数
    //     setLoading(true);
    //     agent.Basket.addItem(productId)
    //         .then(basket => dispatch(setBasket(basket)))  // 当购物车中添加物品后，会马上使用setBasket来添加，这样catalog页面上的购物车右上badge会及时更新
    //         .catch(error => console.log(error))
    //         .finally(() => setLoading(false));  // use finally to close loading
    // }

    return ( 
        <Card >
            <CardHeader
                avatar = {
                    <Avatar sx={{bgcolor: 'secondary.main'}}>
                        {product.name.charAt(0).toUpperCase()}   {/* 将每个产品名的首字母大写展示在card头 */}
                    </Avatar>
                }
                title ={product.name}
                titleTypographyProps={{
                    sx: {fontWeight:'bold', color: 'secondary.main'}
                }}
            />
            <CardMedia
                sx={{ height: 140, backgroundSize: 'contain', bgcolor: '#ede7f6'}}
                image={product.pictureUrl}
                title={product.name}
            />
            <CardContent>
                <Typography gutterBottom color='secondary' variant="h5" >
                    $ {(product.price / 10).toFixed(2)}  {/* 价格细节 */}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {product.brand} / {product.type}
                </Typography>
            </CardContent>

            <CardActions>
                <LoadingButton 
                    loading={status.includes('pendingAddItem' + product.id)} 
                    onClick={() => dispatch(addBasketItemAsync({productId: product.id}))}  
                    size="small">Add to cart</LoadingButton>   {/* 该LoadingButton按钮点击时触发回调函数handleAddItem */}
                <Button component={Link} to={`/catalog/${product.id}`} size="small">View</Button> {/*点击View会跳转至该产品的details页面*/}
            </CardActions>
        </Card>
    )
}