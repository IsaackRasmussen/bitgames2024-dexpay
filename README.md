## Overview ##
dExPay consist of a mobile POS app based on Flutter to be used on any supported platform. Already used platforms are Windows, iOS and in particularly Android.
Android provides much more flexibility.

### dExPay POS ###
This project is based on Flutter and the Lightspark SDK.

### dExPay Web ###
This project demonstrates mobile payment from a webapp. Its based on NodeJS, ExpressJS, React and consist of a client frontend and server backend.
For deployment, the frontend can be deployed to any provider. The backend is based on NodeJS and ExpressJS, for this demonstration, Vercel has been used and deployment config is included.

The following environment variables are used

#### Frontend ####
VITE_SERVER_URL=http://localhost:3001  # Full backend host if deployed on separate server
VITE_SERVER_API_PATH=/api  # Full backend url if deployed on separate server

#### Backend ####
SHOPBOX_APIKEY =  # API Key, free trial is available www.shopbox.com
SHOPBOX_APIURL = "https://api.shopbox.com/api/v3"
LIGHTSPARK_API_TOKEN_CLIENT_ID= # Lightspark API Client ID, create under settings
LIGHTSPARK_API_TOKEN_CLIENT_SECRET= # Lightspark API Client Secret, create under settings
PORT = 3001
