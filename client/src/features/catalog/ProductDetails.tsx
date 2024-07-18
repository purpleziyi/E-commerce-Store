import { Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow,  Typography } from "@mui/material";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Product } from "../../app/models/product";
import agent from "../../app/api/agent";
import LoadingComponent from "../../app/layout/LoadingComponent";

export default function ProductDetails() {
    const { id } = useParams<{ id: string }>();  // 从useParams中获得产品的id
    const [product, setProduct] = useState<Product | null>(null);  // initialized value
    const [loading, setLoading] = useState(true); // add loading state

    useEffect(() => {
        id && agent.Catalog.details(parseInt(id)) //此时的id从useParams中获得
            .then(response => setProduct(response))  // get response-data
            .catch(error => console.log(error.response))  // check errors
            .finally(() => setLoading(false));
    }, [id]) //当依赖项参数id改变时，useEffect会被再次调用

       
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


            </Grid>            
        </Grid>
    )
}