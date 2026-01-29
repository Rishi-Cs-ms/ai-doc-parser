const COGNITO_DOMAIN = "ca-central-10vcciz7st.auth.ca-central-1.amazoncognito.com"; // Replace with your actual Cognito domain
const CLIENT_ID = "52v409gv203dm0vvofn4h179q1";
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
            throw new Error(error.error || "Failed to exchange code for tokens");
        }

        const tokens = await response.json();
        storeTokens(tokens);
        return tokens;
    } catch (error) {
        console.error("Token exchange error:", error);
        throw error;
    }
};

export const storeTokens = (tokens) => {
    if (tokens.access_token) localStorage.setItem("access_token", tokens.access_token);
    if (tokens.id_token) localStorage.setItem("id_token", tokens.id_token);
    if (tokens.refresh_token) localStorage.setItem("refresh_token", tokens.refresh_token);
};

export const getAccessToken = () => localStorage.getItem("access_token");
export const getIdToken = () => localStorage.getItem("id_token");

export const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("id_token");
    localStorage.removeItem("refresh_token");
    const logoutUrl = `https://${COGNITO_DOMAIN}/logout?client_id=${CLIENT_ID}&logout_uri=${encodeURIComponent(REDIRECT_URI)}`;
    window.location.href = logoutUrl;
};

export const isLoggedIn = () => {
    return !!getAccessToken();
};

export const getLoginUrl = () => {
    return `https://${COGNITO_DOMAIN}/login?client_id=${CLIENT_ID}&response_type=code&scope=email+openid+phone&redirect_uri=${REDIRECT_URI}`;
};
