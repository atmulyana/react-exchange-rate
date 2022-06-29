const API_KEY = '<YOUR_API_KEY>';

const val = (name, rate) => ({name, rate});

const currencies = {
    USD: val('United States Dollar', 1),
    IDR: val('Indonesian Rupiah', 14410.45),
    EUR: val('Euro', 0.85694),
    GBP: val('British Pound', 0.75894),
    SGD: val('Singapore Dollar', 1.36637),
    JPY: val('Japanese Yen', 110.974),
    CAD: val("Canadian Dollar", 1.24),
    CHF: val('Swiss Franc', 0.92),
    INR: val('Indian Rupee', 74.96),
    MYR: val('Malaysian Ringgit', 4.15),
    KRW: val('South Korean Won', 1167.42),
}

export const baseCurrency = Object.keys(currencies)[0];

///// One query for each currency
/* export const refreshRate = () => {
    
    const curCodes = Object.keys(currencies).filter(code => code != baseCurrency)
        , baseCode = baseCurrency
        , headers = new Headers()
        //, apiUrl = `https://api.currencylayer.com/convert?access_key=${API_KEY}&from=${baseCode}&amount=1&to=`
        , apiUrl = `https://api.apilayer.com/currency_data/convert?from=${baseCode}&amount=1&to=`; headers.append('apikey', API_KEY);
    currencies[baseCode].rate = 1;
    
    const httpReqs = [];
    for (let i = 0; i < curCodes.length; i++) {
        let code = curCodes[i];
        httpReqs.push(
            fetch(apiUrl + code, {method: 'GET', headers}).then(response => {
                if (response.ok) return response.json();
                throw new Error('Response not OK');
            }).then(data => {
                if (data.success) {
                    currencies[code].rate = parseFloat(data.result) || currencies[code].rate;
                    currencies[code].error = null;
                }
                else {
                    //currencies[code].rate = 0.0;
                    currencies[code].error = data.error?.info || 'Error';
                }
            }).catch(() => {
                //currencies[code].rate = 0.0;
                currencies[code].error = "Error";
            })
        );
    }
    return Promise.all(httpReqs);
} */


///// Single query for all currencies (more efficient)
export const refreshRate = () => {
    
    const curCodes = Object.keys(currencies).filter(code => code !== baseCurrency),
          source = baseCurrency,
          targets = curCodes.join(),
          headers = new Headers(),
          apiUrl = `https://api.apilayer.com/currency_data/live?source=${source}&currencies=${targets}`;
    headers.append('apikey', API_KEY);
    
    currencies[source].rate = 1;
    for (let i = 0; i < curCodes.length; i++) {
        let code = curCodes[i];
        currencies[code].error = null;
    }

    return fetch(apiUrl, {
        method: 'GET',
        redirect: 'follow',
        headers
    })
        .then(async (response) => {
            if (response.ok) return response.json();
            throw await response.json();
        }).then(data => {
            if (data.success) {
                for (let i = 0; i < curCodes.length; i++) {
                    let code = curCodes[i];
                    currencies[code].rate = data.quotes[source + code];
                }
            }
            else {
                alert('Cannot get data from server\n' + data.error?.info);
            }
        }).catch(err => {
            alert('Cannot get data from server\n' + err?.message);
        });
}

export default currencies;