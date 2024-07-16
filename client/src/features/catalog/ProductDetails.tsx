import { Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Product } from "../../app/models/product";

export default function ProductDetails() {
    const { id } = useParams<{ id: string }>();  // 从useParams中获得产品的id
    const [product, setProduct] = useState<Product | null>(null);  // initialized value
    const [loading, setLoading] = useState(true); // add loading state

    useEffect(() => {
        axios.get(`http://localhost:5000/api/products/${id}`)  //此时的id从useParams中获得
            .then(response => setProduct(response.data))  // get response-data
            .catch(error => console.log(error))  // check errors
            .finally(() => setLoading(false));
    }, [id]) //当依赖项参数id改变时，useEffect会被再次调用

    if (loading) return <h3>Loading...</h3>

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
                            variant={'outlined'}
                            type={'number'}
                            label={'Quantity in Cart'}
                            fullWidth
                            value={quantity}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <LoadingButton
                            disabled={item?.quantity === quantity || !item && quantity === 0}
                            loading={status.includes('pending')}
                            onClick={handleUpdateCart}
                            sx={{ height: '55px' }}
                            color={'primary'}
                            size={'large'}
                            variant={'contained'}
                            fullWidth>
                            {item ? 'Update Quantity' : 'Add to Cart'}
                        </LoadingButton>
                    </Grid>
                </Grid>
            </Grid>            
        </Grid>
    )
}