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
        serviceIdGmail: process.env.REACT_APP_SERVICEID_GMAIL,
        serviceIdOutlook: process.env.REACT_APP_SERVICEID_OUTLOOK,
        templateIdEditRequest: process.env.REACT_APP_TEMPLATEID_EDIT_REQUEST,
        userId: process.env.REACT_APP_USERID,
        templateIdInviteAccepted: process.env.REACT_APP_TEMPLATEID_INVITE_ACCEPTED,
        templateIdInviteDeclined: process.env.REACT_APP_TEMPLATEID_INVITE_DECLINED,
        templateIdCollaboratorEdits: process.env.REACT_APP_TEMPLATEID_COLLABORATOR_EDITS
    }
}

export default config; 