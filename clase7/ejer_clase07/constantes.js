
const API_URL = "https://reqres.in/api/";

const manejadorFetch = async (url, options) => {
    return await fetch(url, options)
        .then(manejadorError);
};

const manejadorError = (res) => {
    if (!res.ok)
        throw new Error(res.statusText);
    return res;
};