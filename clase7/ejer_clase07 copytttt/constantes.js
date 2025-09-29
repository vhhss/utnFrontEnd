
const API_URL = "https://api-users-paginado.onrender.com/";

const manejadorFetch = async (url, options) => {
    return await fetch(url, options)
        .then(manejadorError);
};

const manejadorError = (res) => {
    if (!res.ok)
        throw new Error(res.statusText);
    return res;
};