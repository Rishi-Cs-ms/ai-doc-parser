const COGNITO_DOMAIN = "ca-central-10vcciz7st.auth.ca-central-1.amazoncognito.com";
const CLIENT_ID = "52v409gv203dm0vvofn4h179q1";
const REDIRECT_URI = "https://ai-doc-parser.rishimajmudar.me";

export const storeTokens = (idToken, accessToken) => {
    console.log("auth.js: storeTokens called");
    if (idToken) localStorage.setItem("id_token", idToken);
    if (accessToken) localStorage.setItem("access_token", accessToken);
};

export const getAccessToken = () => localStorage.getItem("access_token");
export const getIdToken = () => localStorage.getItem("id_token");

export const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("id_token");
    localStorage.removeItem("refresh_token");
    // Cognito Logout URL
    const logoutUrl = `https://${COGNITO_DOMAIN}/logout?client_id=${CLIENT_ID}&logout_uri=${encodeURIComponent(REDIRECT_URI)}`;
    window.location.href = logoutUrl;
};

export const isLoggedIn = () => {
    const token = localStorage.getItem("id_token");
    if (!token) {
        console.log("isLoggedIn: No id_token found");
        return false;
    }

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const isValid = payload.exp * 1000 > Date.now();
        if (!isValid) console.log("isLoggedIn: Token expired");
        return isValid;
    } catch (e) {
        console.error("isLoggedIn: Error parsing token", e);
        return false;
    }
};

export const getLoginUrl = () => {
    // response_type=token so that we get id_token and access_token in the hash
    return `https://${COGNITO_DOMAIN}/login?client_id=${CLIENT_ID}&response_type=token&scope=email+openid+phone&redirect_uri=${REDIRECT_URI}`;
};
