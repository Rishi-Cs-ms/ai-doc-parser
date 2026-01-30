const COGNITO_DOMAIN = "ca-central-1sy011dk91.auth.ca-central-1.amazoncognito.com";
const CLIENT_ID = "4m3cbg0ibvtdc9ab54vq2j1f6h";
const REDIRECT_URI = "https://ai-doc-parser.rishimajmudar.me";

// PKCE Helpers
const generateRandomString = (length) => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let result = '';
    const values = new Uint8Array(length);
    crypto.getRandomValues(values);
    for (let i = 0; i < length; i++) {
        result += charset[values[i] % charset.length];
    }
    return result;
};

const sha256 = async (plain) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(hash)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
};

export const exchangeCodeForTokens = async (code) => {
    const codeVerifier = localStorage.getItem('code_verifier');

    if (!codeVerifier) {
        console.error("No code_verifier found. PKCE flow failed.");
        throw new Error("PKCE validation failed: No code_verifier found");
    }

    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("client_id", CLIENT_ID);
    params.append("code", code);
    params.append("redirect_uri", REDIRECT_URI);
    params.append("code_verifier", codeVerifier);

    try {
        const response = await fetch(`https://${COGNITO_DOMAIN}/oauth2/token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: params.toString(),
        });

        console.log("Token exchange using domain:", COGNITO_DOMAIN);

        if (!response.ok) {
            const error = await response.json();
            console.error("Token exchange failed:", error);
            throw new Error(error.error_description || error.error || "Failed to exchange code for tokens");
        }

        const tokens = await response.json();
        console.log("------------------------------------------");
        console.log("Access Token:", tokens.access_token);
        console.log("ID Token:", tokens.id_token);
        console.log("Refresh Token:", tokens.refresh_token);
        console.log("------------------------------------------");
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

export const getLoginUrl = async () => {
    const codeVerifier = generateRandomString(128);
    localStorage.setItem('code_verifier', codeVerifier);

    const codeChallenge = await sha256(codeVerifier);

    return `https://${COGNITO_DOMAIN}/login?client_id=${CLIENT_ID}&response_type=code&scope=email+openid+phone&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&code_challenge_method=S256&code_challenge=${codeChallenge}`;
};

export const getSignupUrl = async () => {
    const codeVerifier = generateRandomString(128);
    localStorage.setItem('code_verifier', codeVerifier);

    const codeChallenge = await sha256(codeVerifier);

    return `https://${COGNITO_DOMAIN}/signup?client_id=${CLIENT_ID}&response_type=code&scope=email+openid+phone&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&code_challenge_method=S256&code_challenge=${codeChallenge}`;
};
