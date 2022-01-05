const config = {
    firebaseConfig: {
        apiKey: process.env.REACT_APP_APIKEY,
        authDomain: process.env.REACT_APP_AUTHDOMAIN,
        projectId: process.env.REACT_APP_PROJECTID,
        storageBucket: process.env.REACT_APP_STORAGEBUCKET,
        messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
        appId: process.env.REACT_APP_APPID,
        measurementId: process.env.REACT_APP_MEASUREMENTID
    },
    emailJSConfig: {
        serviceId: process.env.REACT_APP_SERVICEID,
        templateId: process.env.REACT_APP_TEMPLATEID,
        userId: process.env.REACT_APP_USERID
    }
}

export default config; 