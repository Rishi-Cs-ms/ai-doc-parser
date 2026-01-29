const COGNITO_DOMAIN = "ca-central-10vcciz7st.auth.ca-central-1.amazoncognito.com";
const CLIENT_ID = "4g8jp8jrqffad7k0kionio9hdb";
const REDIRECT_URI = "https://ai-doc-parser.rishimajmudar.me";

export const exchangeCodeForTokens = async (code) => {
    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("client_id", CLIENT_ID);
    params.append("code", code);
    params.append("redirect_uri", REDIRECT_URI);

    try {
        const response = await fetch(`https://${COGNITO_DOMAIN}/oauth2/token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: params,
        });

        if (!response.ok) {
            const error = await response.json();
            console.error("Token exchange failed:", error);
            throw new Error(error.error_description || error.error || "Failed to exchange code for tokens");
        }

        const tokens = await response.json();
        storeTokens(tokens.id_token, tokens.access_token);
        return tokens;
    } catch (error) {
        console.error("Token exchange error:", error);
        alert("Login failed: " + error.message);
        throw error;
    }
};

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
    return `https://${COGNITO_DOMAIN}/login?client_id=${CLIENT_ID}&response_type=code&scope=email+openid+phone&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
};

export const getSignupUrl = () => {
    return `https://${COGNITO_DOMAIN}/signup?client_id=${CLIENT_ID}&response_type=code&scope=email+openid+phone&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
};
