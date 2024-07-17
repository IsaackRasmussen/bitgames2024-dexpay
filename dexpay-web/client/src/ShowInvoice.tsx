import * as React from "react";
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { CurrencyBitcoin, AttachMoney } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const ShowInvoice = (props: any) => {
  const [lightningInvoice, setLightningInvoice] = useState(null);
  const [creatingLightningInvoice, setCreatingLightningInvoice] =
    useState(false);

  const getPriceFormatted = (price: number): string => {
    return (price ?? 0).toLocaleString("en-US", {
      maximumFractionDigits: 2,
      useGrouping: false,
    });
  };
  const getPriceInDollar = (price: number): number => {
    // 17th July 2024, approx 1 USD = 6.85 DKK
    return price / (100 * 6.85);
  };
  const getPriceInDollarString = (price: number): string => {
    // 17th July 2024, approx 1 USD = 6.85 DKK
    return getPriceFormatted(getPriceInDollar(price));
  };

  useEffect(() => {
    setCreatingLightningInvoice(true);
    fetch(`${__API_PATH__}/invoice`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        totalPrice: getPriceInDollar(props.shoppingCartTotal),
        text: "Textual content",
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then(async (data) => {
        setCreatingLightningInvoice(false);
        setLightningInvoice(data);
      });
  }, []);

  return (
    <Dialog
      key="KeyShowDialog"
      open={props.invoiceOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={props.closeDialog}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>
        <center> {"Your order"}</center>
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={props.closeDialog}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          <List
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          >
            {props.shoppingCart.map((product: any) => (
              <ListItem key={product.id}>
                <ListItemAvatar>
                  <img
                    style={{
                      paddingRight: "3em",
                      width: "5em",
                      maxHeight: "6em",
                    }}
                    src={product.imageUrl}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={product.name}
                  secondary={`$ ${getPriceInDollarString(
                    product.sellingPrice
                  )}`}
                />
              </ListItem>
            ))}
          </List>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          gap={2}
        >
          <Box
            sx={{
              flexShrink: 1,
              alignSelf: { xs: "flex-start", sm: "center" },
            }}
          >
            <Typography fontWeight="bold">
              <span style={{ fontSize: "2em" }}>
                <AttachMoney />
                {getPriceInDollarString(props.shoppingCartTotal)}
              </span>
            </Typography>
          </Box>

          {creatingLightningInvoice ? (
            <Box sx={{ display: "flex" }}>
              <LinearProgress />
            </Box>
          ) : (
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              gap={2}
            >
              <Box
                sx={{
                  flexShrink: 1,
                  alignSelf: { xs: "flex-start", sm: "center" },
                }}
              >
                <span style={{ fontSize: "2em" }}>
                  <CurrencyBitcoin />
                  {(lightningInvoice as any)?.priceInSats ?? -1}
                </span>
              </Box>
              <Button href={(lightningInvoice as any)?.lnInvoice ?? "#"}>
                <svg
                  style={{ height: "2em" }}
                  viewBox="0 0 169 34"
                  width="100%"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M44.898 21.7971H39.3337V11.6397H37.8989V23.2049H46.3245V18.0239H44.898V21.7971Z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M50.796 13.0393H53.8242V21.7971H50.796V23.2049H58.2456V21.7971H55.2591V13.0393H58.2456V11.6397H50.796V13.0393Z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M70.3 21.7972H67.2217C65.6868 21.7972 65.1445 21.5516 64.9527 21.4125C64.6607 21.1915 64.5189 20.7577 64.5189 20.1275V14.7582C64.5189 14.1116 64.6523 13.645 64.9193 13.4158C65.0778 13.2767 65.545 13.0393 66.838 13.0393H70.8339V11.6315H66.838C65.3948 11.6315 64.4605 11.8689 63.9099 12.3682C63.3676 12.8675 63.0923 13.6696 63.0923 14.75V20.1193C63.0923 20.6267 63.1507 21.0687 63.2675 21.437C63.401 21.8708 63.6513 22.231 64.0183 22.5093C64.352 22.763 64.8025 22.9512 65.3531 23.0576C65.8453 23.1559 66.4793 23.205 67.2301 23.205H71.7349V18.1385H70.3V21.7972Z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M84.8156 16.7143H78.5506V11.6397H77.1157V23.2049H78.5506V18.1221H84.8156V23.2049H86.2504V11.6397H84.8156V16.7143Z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M90.7968 13.0393H94.8011V23.2049H96.2359V13.0393H100.24V11.6397H90.7968V13.0393Z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M110.493 17.0744L106.355 16.2477C106.18 16.215 106.055 16.1659 105.963 16.0677C105.963 16.0677 105.871 15.9613 105.871 15.5602V13.9887C105.871 13.7104 105.963 13.5058 106.163 13.3257C106.372 13.1375 106.655 13.0475 107.056 13.0475H112.011V11.6397H107.056C106.297 11.6397 105.671 11.8607 105.195 12.2863C104.695 12.7283 104.445 13.3012 104.445 13.9887V15.5602C104.445 16.2641 104.612 16.7634 104.962 17.0826C105.262 17.3609 105.646 17.541 106.096 17.631L110.209 18.4577C110.451 18.5068 110.635 18.5968 110.76 18.7278C110.776 18.7441 110.91 18.9078 110.91 19.5463V20.6594C110.91 21.0032 110.801 21.2569 110.568 21.4697C110.326 21.6907 109.992 21.7971 109.55 21.7971H104.069V23.2049H109.55C110.376 23.2049 111.052 22.9675 111.561 22.4928C112.078 22.0099 112.336 21.396 112.336 20.6594V19.5463C112.336 18.7114 112.153 18.1221 111.777 17.7456C111.435 17.4018 111.002 17.1808 110.493 17.0744Z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M125.233 12.5891C124.958 12.2863 124.574 12.0407 124.091 11.877C123.64 11.7215 123.064 11.6397 122.389 11.6397H117.55V23.2049H118.985V19.4317H122.389C123.064 19.4317 123.64 19.358 124.082 19.2107C124.566 19.047 124.95 18.8178 125.233 18.515C125.509 18.2203 125.701 17.8602 125.809 17.4427C125.901 17.0826 125.943 16.6897 125.943 16.2723V14.8563C125.943 14.4389 125.901 14.046 125.809 13.6777C125.709 13.2603 125.517 12.9001 125.242 12.5891H125.233ZM118.977 13.0393H122.38C122.881 13.0393 123.281 13.0884 123.573 13.1866C123.832 13.2766 124.024 13.383 124.141 13.5222C124.266 13.6613 124.358 13.8332 124.408 14.0296C124.466 14.2752 124.499 14.5535 124.499 14.8481V16.2641C124.499 16.5588 124.466 16.8289 124.408 17.0662C124.358 17.2627 124.274 17.41 124.149 17.5491C124.024 17.6801 123.84 17.7865 123.582 17.8684C123.29 17.9666 122.881 18.0075 122.38 18.0075H118.977V13.0311V13.0393Z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M139.148 16.436L137.797 13.3012C137.622 12.8919 137.43 12.54 137.23 12.2617C137.021 11.9752 136.612 11.6397 135.82 11.6397H133.901C133.092 11.6397 132.675 11.9752 132.466 12.2535C132.249 12.54 132.066 12.8838 131.899 13.293L130.648 16.4524C130.531 16.7634 130.439 17.0826 130.381 17.4182C130.314 17.7538 130.281 18.1303 130.281 18.5231V23.2131H131.715V19.9146H138.097V23.2131H139.532V18.5231C139.532 18.1303 139.499 17.762 139.432 17.4182C139.365 17.0826 139.274 16.7552 139.157 16.4442L139.148 16.436ZM133.592 13.1129C133.592 13.1129 133.709 13.0393 133.901 13.0393H135.82C135.903 13.0393 136.045 13.0475 136.095 13.1129C136.229 13.3012 136.362 13.5467 136.487 13.8414L137.822 16.9271C137.905 17.1563 137.972 17.41 138.022 17.6719C138.072 17.9257 138.097 18.2039 138.097 18.4986H131.715C131.715 18.1958 131.74 17.9175 131.791 17.6719C131.841 17.41 131.907 17.1645 131.982 16.9517L133.234 13.8087C133.342 13.5304 133.467 13.3012 133.601 13.1129H133.592Z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M152.462 17.5328C152.462 17.5328 152.496 17.4592 152.512 17.4264C152.696 16.9763 152.796 16.4115 152.796 15.7485V14.4226C152.796 13.6532 152.563 12.9902 152.095 12.4664C151.612 11.9098 150.886 11.6315 149.943 11.6315H144.871V23.1968H146.306V18.7524H151.219C151.795 18.7524 152.212 18.8588 152.446 19.0634C152.663 19.2599 152.771 19.5709 152.771 20.021V23.1968H154.206V20.021C154.206 19.1862 153.939 18.5232 153.422 18.0485C153.163 17.8193 152.846 17.6474 152.471 17.5328H152.462ZM149.943 13.0393C150.444 13.0393 150.802 13.1539 151.011 13.3913C151.244 13.6532 151.353 13.9806 151.353 14.4308V15.7731C151.353 16.346 151.253 16.7798 151.053 17.0581C150.911 17.2627 150.51 17.3773 149.935 17.3773H146.289V13.0475H149.935L149.943 13.0393Z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M167.629 17.3036C167.153 16.9435 166.477 16.7552 165.61 16.7388L167.854 11.6397H166.294L164.05 16.7388H160.83V11.6397H159.395V23.2049H160.83V18.1466H165.468C166.044 18.1466 166.477 18.2367 166.728 18.4167C166.803 18.4659 167.02 18.6214 167.02 19.227V23.2049H168.454V19.227C168.454 18.3676 168.179 17.721 167.629 17.3036Z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M14.2652 18.1213H3.94587L18.5197 5.60665L15.6667 11.6716H17.3017L22.7909 0L0 19.5782H13.5811L14.2652 18.1213Z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M14.3736 14.4218L13.6896 15.8787H24.0089L9.43506 28.3934L12.2881 22.3284H10.653L5.16385 34L27.9548 14.4218H14.3736Z"
                    fill="currentColor"
                  ></path>
                </svg>{" "}
              </Button>
            </Stack>
          )}
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default ShowInvoice;
