import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import {
  Box,
  Button,
  CardActionArea,
  CardActions,
  Grid,
  LinearProgress,
  Divider,
  Rating,
} from "@mui/material";
import { AddShoppingCart, AttachMoney } from "@mui/icons-material";

const ShowProducts = (props: any) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getPriceFormatted = (price: number): string => {
    return (price ?? 0).toLocaleString("en-US", {
      maximumFractionDigits: 2,
      useGrouping: false,
    });
  };
  const getPriceInDollarString = (price: number): string => {
    // 17th July 2024, approx 1 USD = 6.85 DKK
    return getPriceFormatted(price / (100 * 6.85));
  };

  useEffect(() => {
    fetch(`${__API_PATH__}/products/all`)
      .then((res) => {
        return res.json();
      })
      .then(async (data) => {
        setIsLoading(false);
        setProducts(data.products);
      });
  }, []);

  return !isLoading ? (
    <div>
      {products.map((product: any) => (
        <div key={product.id} style={{ paddingBottom: "2em" }}>
          <Card sx={{ maxWidth: 445, minWidth: "50%" }}>
            <CardActionArea>
              <CardMedia
                component="img"
                height="140"
                image={product.imageUrl}
                alt={product.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.description}
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Grid container spacing={2} columns={3}>
                <Grid item xs={8}>
                  <Rating defaultValue={product.ratingsValue} size="small" />
                </Grid>
                <Grid item xs={8}>
                  <div>
                    <AttachMoney />
                    <span style={{ fontSize: "2em" }}>
                      {
                        // Price is returned in Danish cents, 1/100 of a DKK which is locked approximately to 6.85 DKK per 1 Dollar
                        getPriceInDollarString(product.sellingPrice)
                      }
                    </span>
                  </div>
                  <Divider orientation="horizontal" variant="middle" flexItem />
                  <Button
                    size="small"
                    color="primary"
                    startIcon={<AddShoppingCart />}
                    onClick={() => props.onProductAdd(product)}
                  >
                    Order
                  </Button>
                </Grid>
              </Grid>
            </CardActions>
          </Card>
          <Divider></Divider>
        </div>
      ))}
    </div>
  ) : (
    <Box sx={{ display: "flex" }}>
      <LinearProgress />
    </Box>
  );
};
export default ShowProducts;
